import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MapPin, CheckCircle, Plus, Check } from 'lucide-react';
import { GCoinIcon } from '../components/GCoin';
import RedeemPanel from '../components/RedeemPanel';

interface SavedAddress {
  id: string;
  fullname: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

const EMPTY_FORM = { fullname: '', street: '', city: '', state: '', zip_code: '' };

export default function Checkout() {
  const { items, totalAmount, clearCart, totalPointsToRedeem } = useCart();
  const { user, refreshPoints } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAddress, setNewAddress] = useState(EMPTY_FORM);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  // Points (usePoints + pointsToRedeem live in CartContext for cart→checkout sharing)
  const [pointToRs, setPointToRs] = useState(1);

  useEffect(() => {
    if (items.length === 0) navigate('/shop');
    if (!user) navigate('/login');
  }, [items, user, navigate]);

  useEffect(() => {
    supabase.from('app_settings').select('value').eq('key', 'point_to_rs').single()
      .then(({ data }) => { if (data) setPointToRs(parseFloat(data.value)); });

    if (user) {
      supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setSavedAddresses(data);
            setSelectedAddressId(data[0].id); // auto-select most recent
          } else {
            // No saved addresses — show new form immediately
            setShowNewForm(true);
          }
          setAddressesLoading(false);
        });
    }
  }, [user]);

  const discountAmount = totalPointsToRedeem * pointToRs;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  // Save new address to DB and select it
  const handleSaveNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingAddr(true);
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ user_id: user.id, ...newAddress })
      .select()
      .single();
    setSavingAddr(false);
    if (error) { alert('Failed to save address: ' + error.message); return; }
    if (data) {
      setSavedAddresses(prev => [data, ...prev]);
      setSelectedAddressId(data.id);
      setShowNewForm(false);
      setNewAddress(EMPTY_FORM);
    }
  };

  const handleAddressNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) return;
    setStep(2);
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Step 1: insert pending order + items into DB. Returns the row, or null on error.
  const createPendingOrder = async (addressId: string) => {
    if (!user) return null;
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: addressId,
        total_amount: finalAmount,
        status: finalAmount <= 0 ? 'paid' : 'pending',
        points_used: totalPointsToRedeem,
        points_discount_amount: discountAmount,
      })
      .select()
      .single();
    if (orderError || !orderData) {
      console.error('Order Insert Error:', orderError);
      alert('Failed to create order. Please try again.');
      return null;
    }
    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map(item => ({
        order_id: orderData.id,
        product_id: (item.product as any).isPartnerProduct ? null : item.product.id,
        partner_product_id: (item.product as any).isPartnerProduct ? item.product.id : null,
        quantity: item.quantity,
        price_at_time: item.product.price,
      }))
    );
    if (itemsError) console.error('Items Insert Error:', itemsError);
    return orderData;
  };

  // Free orders + post-payment success: decrement stock, refresh points, clear cart, nav.
  const completeOrder = async (orderId: string, status: 'paid' | 'pending' | 'failed') => {
    if (status === 'paid') {
      await Promise.all(items.map(async item => {
        const table = (item.product as any).isPartnerProduct ? 'partner_products' : 'products';
        await supabase.rpc('decrement_stock', { row_id: item.product.id, qty: item.quantity, tbl: table });
      }));
      await refreshPoints();
    }
    clearCart();
    navigate(`/order-confirmation/${orderId}?status=${status}`);
  };

  const handlePaymentSubmit = async () => {
    if (!user || !selectedAddressId) return;
    setLoading(true);

    try {
      const addressId = selectedAddressId;
      const order = await createPendingOrder(addressId);
      if (!order) { setLoading(false); return; }

      // Free order — already marked paid in createPendingOrder; skip Razorpay.
      if (finalAmount <= 0) {
        if (totalPointsToRedeem > 0) {
          await supabase.from('points_ledger').insert({
            user_id: user.id,
            points_change: -totalPointsToRedeem,
            description: `Redeemed ${totalPointsToRedeem} G Coins on Order #${order.id.substring(0, 8).toUpperCase()}`,
          });
        }
        await completeOrder(order.id, 'paid');
        return;
      }

      const res = await loadRazorpayScript();
      if (!res) { alert('Razorpay SDK failed to load. Are you online?'); setLoading(false); return; }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const orderResponse = await fetch(`${backendUrl}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
          receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now().toString().slice(-6)}`,
          order_id: order.id,
          items: items.map(it => ({
            product_id: it.product.id,
            quantity: it.quantity,
            isPartner: !!(it.product as any).isPartnerProduct,
          })),
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderData || !orderData.id) {
        alert(orderData?.error || 'Server error. Please try again.');
        setLoading(false);
        return;
      }

      const selectedAddr = savedAddresses.find(a => a.id === addressId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TechzGreen',
        description: 'Eco-friendly products purchase',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(`${backendUrl}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              }),
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.verified) {
              await completeOrder(order.id, 'paid');
            } else {
              await completeOrder(order.id, 'failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            await completeOrder(order.id, 'failed');
          }
        },
        modal: {
          ondismiss: () => {
            // User closed Razorpay without paying. Order stays 'pending' — they can retry from confirmation page.
            completeOrder(order.id, 'pending');
          },
          escape: true,
        },
        prefill: {
          name: selectedAddr?.fullname || '',
          email: user.email,
        },
        theme: { color: '#2e7d32' },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', async (resp: any) => {
        console.warn('payment.failed:', resp?.error);
        await supabase.from('orders').update({
          status: 'failed',
          last_payment_error: resp?.error?.description || 'payment_failed',
        }).eq('id', order.id);
        await completeOrder(order.id, 'failed');
      });
      paymentObject.open();
      setLoading(false);

    } catch (error) {
      console.error('Payment flow failed:', error);
      alert('Failed to process. Please try again.');
      setLoading(false);
    }
  };

  const inputClass = 'input-glass';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 fade-in">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${step >= 1 ? 'bg-[#2e7d32] text-white shadow' : 'bg-[rgba(46,125,50,0.1)] text-[#5f7a60]'}`}>1</div>
        <div className={`h-1 flex-grow rounded-full transition-all ${step >= 2 ? 'bg-[#2e7d32]' : 'bg-[rgba(46,125,50,0.15)]'}`} />
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${step >= 2 ? 'bg-[#2e7d32] text-white shadow' : 'bg-[rgba(46,125,50,0.1)] text-[#5f7a60]'}`}>2</div>
      </div>

      {/* ── Step 1: Address ── */}
      {step === 1 && (
        <div className="glass-panel p-8">
          <h2 className="text-2xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2">
            <MapPin className="text-[#2e7d32]" /> Shipping Address
          </h2>

          {addressesLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleAddressNext} className="space-y-4">

              {/* Saved address cards */}
              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#2d4a30] mb-2">Your saved addresses</p>
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => { setSelectedAddressId(addr.id); setShowNewForm(false); }}
                      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedAddressId === addr.id
                          ? 'border-[#2e7d32] bg-[rgba(46,125,50,0.06)]'
                          : 'border-[rgba(46,125,50,0.15)] hover:border-[rgba(46,125,50,0.35)] bg-white/50'
                      }`}
                    >
                      <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedAddressId === addr.id ? 'border-[#2e7d32] bg-[#2e7d32]' : 'border-[rgba(46,125,50,0.3)]'
                      }`}>
                        {selectedAddressId === addr.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1a3d1f] text-sm">{addr.fullname}</p>
                        <p className="text-xs text-[#5f7a60] mt-0.5">{addr.street}, {addr.city}, {addr.state} — {addr.zip_code}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Add another / first address button */}
              {!showNewForm && (
                <button
                  type="button"
                  onClick={() => { setShowNewForm(true); setSelectedAddressId(null); }}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[rgba(46,125,50,0.3)] hover:border-[#2e7d32] text-[#2e7d32] font-bold text-sm py-3 rounded-xl transition-all cursor-pointer hover:bg-[rgba(46,125,50,0.04)]"
                >
                  <Plus className="w-4 h-4" />
                  {savedAddresses.length === 0 ? 'Add Delivery Address' : 'Add Another Address'}
                </button>
              )}

              {/* New address form */}
              {showNewForm && (
                <div className="border border-[rgba(46,125,50,0.2)] rounded-xl p-4 bg-[rgba(46,125,50,0.03)] space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-[#1a3d1f]">New Address</p>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setShowNewForm(false); setSelectedAddressId(savedAddresses[0].id); setNewAddress(EMPTY_FORM); }}
                        className="text-xs text-[#5f7a60] hover:text-[#2e7d32] cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <input required value={newAddress.fullname} onChange={e => setNewAddress(f => ({ ...f, fullname: e.target.value }))} placeholder="Full Name" className={inputClass} />
                  <input required value={newAddress.street} onChange={e => setNewAddress(f => ({ ...f, street: e.target.value }))} placeholder="Street Address" className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <input required value={newAddress.city} onChange={e => setNewAddress(f => ({ ...f, city: e.target.value }))} placeholder="City" className={inputClass} />
                    <input required value={newAddress.state} onChange={e => setNewAddress(f => ({ ...f, state: e.target.value }))} placeholder="State" className={inputClass} />
                  </div>
                  <input required value={newAddress.zip_code} onChange={e => setNewAddress(f => ({ ...f, zip_code: e.target.value }))} placeholder="PIN Code" className={inputClass} />
                  <button
                    type="button"
                    onClick={handleSaveNewAddress}
                    disabled={savingAddr}
                    className="btn-primary w-full flex items-center justify-center gap-2 !py-2.5 disabled:opacity-50 text-sm"
                  >
                    {savingAddr
                      ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                      : <><Check className="w-3.5 h-3.5" />Save & Use This Address</>
                    }
                  </button>
                </div>
              )}

              {/* Continue button — only active when an address is selected */}
              <button
                type="submit"
                disabled={!selectedAddressId}
                className="btn-accent w-full !py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── Step 2: Payment ── */}
      {step === 2 && (() => {
        const addr = savedAddresses.find(a => a.id === selectedAddressId);
        return (
          <div className="space-y-4">
            {/* Delivery Address summary */}
            {addr && (
              <div className="glass-panel p-5 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2e7d32] mt-0.5 flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-bold text-[#5f7a60] uppercase tracking-wide mb-1">Delivering to</p>
                  <p className="font-bold text-[#1a3d1f] text-sm">{addr.fullname}</p>
                  <p className="text-xs text-[#5f7a60]">{addr.street}, {addr.city}, {addr.state} — {addr.zip_code}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-xs text-[#2e7d32] font-bold hover:underline flex-shrink-0 cursor-pointer">Change</button>
              </div>
            )}

            {/* Order Summary */}
            <div className="glass-panel p-6">
              <h3 className="font-bold text-[#1a3d1f] mb-3">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm text-[#5f7a60]">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span className="font-semibold">₹{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[rgba(46,125,50,0.1)] pt-3 flex justify-between">
                <span className="text-[#5f7a60] font-semibold">Subtotal</span>
                <span className="font-black text-[#1a3d1f]">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Points Redemption (shared with Cart page) */}
            <RedeemPanel pointToRs={pointToRs} />

            {/* Total */}
            <div className="glass-panel p-6">
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-700 mb-2">
                  <span className="flex items-center gap-1"><GCoinIcon size={20} /> G Coins Discount</span>
                  <span className="font-bold">−₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[#5f7a60] font-semibold">Total to Pay</span>
                <span className="text-3xl font-black text-[#1a3d1f]" style={{ fontFamily: 'Outfit,sans-serif' }}>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="glass-panel p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #2e7d32, #ffb300)' }} />
              <div className="flex gap-3 items-start">
                <CheckCircle className="text-[#2e7d32] w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#1a3d1f] text-sm mb-1">Demo Mode Active</p>
                  <p className="text-[#5f7a60] text-xs">No real payment is processed. Clicking confirm will complete the order and deduct any redeemed points from your balance.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 glass-panel !rounded-xl py-3 font-semibold text-[#2d4a30] hover:bg-[rgba(46,125,50,0.05)] transition-colors cursor-pointer text-sm">
                ← Back
              </button>
              <button onClick={handlePaymentSubmit} disabled={loading}
                className="flex-[2] btn-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
                  : `Confirm Payment · ₹${finalAmount.toFixed(2)}`
                }
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
