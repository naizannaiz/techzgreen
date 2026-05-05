import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ChevronRight, Package, Home, Receipt, MapPin, Star, CreditCard, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const pollRef = useRef<number | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    const { data } = await supabase
      .from('orders')
      .select('*, user_addresses(*), order_items(quantity, price_at_time, products(name))')
      .eq('id', id)
      .single();
    if (data) setOrder(data);
  };

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false));
  }, [id]);

  // Poll every 5s for up to 2 min when status is pending — webhook may flip it.
  useEffect(() => {
    if (!order || order.status !== 'pending') return;
    let elapsed = 0;
    pollRef.current = window.setInterval(async () => {
      elapsed += 5;
      await fetchOrder();
      if (order.status !== 'pending' || elapsed >= 120) {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [order?.status]);

  const handleRetry = async () => {
    if (!order || !user) return;
    setRetrying(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      // Re-fetch line items to send to backend for trusted-amount validation
      const { data: lineItems } = await supabase
        .from('order_items').select('product_id, partner_product_id, quantity').eq('order_id', order.id);
      const itemsBody = (lineItems || []).map((li: any) => ({
        product_id: li.product_id || li.partner_product_id,
        quantity: li.quantity,
        isPartner: !!li.partner_product_id,
      }));
      const resp = await fetch(`${backendUrl}/api/create-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: order.total_amount,
          currency: 'INR',
          receipt: `retry_${order.id.substring(0, 8)}_${Date.now().toString().slice(-6)}`,
          order_id: order.id,
          items: itemsBody,
        }),
      });
      const rzp = await resp.json();
      if (!rzp?.id) { alert(rzp?.error || 'Failed to start retry'); setRetrying(false); return; }

      await new Promise((res) => {
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = res; s.onerror = res;
        document.body.appendChild(s);
      });

      const opts = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzp.amount, currency: rzp.currency,
        name: 'TechzGreen', description: 'Retry payment', order_id: rzp.id,
        handler: async (response: any) => {
          const verifyResp = await fetch(`${backendUrl}/api/verify-payment`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, order_id: order.id }),
          });
          const v = await verifyResp.json();
          if (v.verified) await fetchOrder();
          setRetrying(false);
        },
        modal: { ondismiss: () => setRetrying(false) },
        prefill: { email: user.email },
        theme: { color: '#2e7d32' },
      };
      const po = new (window as any).Razorpay(opts);
      po.on('payment.failed', async (resp: any) => {
        await supabase.from('orders').update({
          status: 'failed', last_payment_error: resp?.error?.description || 'payment_failed',
        }).eq('id', order.id);
        await fetchOrder();
        setRetrying(false);
      });
      po.open();
    } catch (e) {
      console.error('retry:', e);
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">Order Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">We couldn't find the details for this order.</p>
        <Link to="/shop" className="btn-primary px-6 py-3">Back to Shop</Link>
      </div>
    );
  }

  // Status: prefer URL hint on first paint, fall back to DB.
  const status: string = (searchParams.get('status') || order.status || 'pending');
  const isPaid = order.status === 'paid';
  const isFailed = order.status === 'failed' || status === 'failed';
  const isPending = !isPaid && !isFailed;

  const headerStyle = isPaid
    ? { bg: 'from-[#1a3d1f] to-[#2e7d32]', icon: <CheckCircle2 className="w-12 h-12 text-[#ffb300]" />, title: 'Order Confirmed!', sub: 'Thank you for shopping sustainably with TechzGreen.' }
    : isFailed
      ? { bg: 'from-red-700 to-red-500', icon: <AlertTriangle className="w-12 h-12 text-white" />, title: 'Payment Failed', sub: 'Your payment did not go through. You can retry below.' }
      : { bg: 'from-amber-600 to-amber-400', icon: <Clock className="w-12 h-12 text-white" />, title: 'Payment Pending', sub: 'Waiting for confirmation. Retry if you closed the payment window.' };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 fade-in relative overflow-hidden">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="bg-white max-w-2xl w-full rounded-[2rem] shadow-2xl overflow-hidden relative z-10">
        <div className={`bg-gradient-to-r ${headerStyle.bg} p-10 text-center text-white relative`}>
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            {headerStyle.icon}
          </div>
          <h1 className="text-4xl font-black mb-3">{headerStyle.title}</h1>
          <p className="text-white/90 text-lg">{headerStyle.sub}</p>
        </div>

        <div className="p-8 md:p-10">
          {/* Retry / Pending banner */}
          {(isPending || isFailed) && (
            <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${isFailed ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              {isFailed ? <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" /> : <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              <div className="flex-grow">
                <p className="text-sm font-bold text-[#1a3d1f]">{isFailed ? 'Payment failed.' : 'Payment not received yet.'}</p>
                <p className="text-xs text-[#5f7a60]">{isFailed ? (order.last_payment_error || 'Please retry to complete this order.') : 'If you completed the payment, this page will update automatically.'}</p>
              </div>
              <button onClick={handleRetry} disabled={retrying} className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
                {retrying ? 'Opening…' : 'Retry Payment'}
              </button>
            </div>
          )}

          {/* Order Header Summary */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-mono font-black text-[#1a3d1f] text-lg">#{id?.substring(0, 8).toUpperCase()}</p>
            </div>
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Amount</p>
              <p className="font-black text-[#2e7d32] text-xl" style={{fontFamily: 'Outfit, sans-serif'}}>₹{Number(order.total_amount).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-[#1a3d1f] flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Receipt className="w-4 h-4 text-[#ffb300]" /> Payment Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    isPaid ? 'text-[#2e7d32] bg-green-50'
                      : isFailed ? 'text-red-700 bg-red-50'
                      : 'text-amber-700 bg-amber-50'
                  }`}>{isPaid ? 'Paid' : isFailed ? 'Failed' : 'Pending'}</span>
                </div>
                {order.points_discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points Applied</span>
                    <span className="font-bold text-[#ffb300] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#ffb300]" /> {order.points_used} pts (−₹{Number(order.points_discount_amount).toFixed(2)})
                    </span>
                  </div>
                )}
                {order.payment_attempts > 1 && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Attempts</span><span>{order.payment_attempts}</span>
                  </div>
                )}
                {order.razorpay_payment_id && (
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Razorpay Ref</span>
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{order.razorpay_payment_id}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#1a3d1f] flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <MapPin className="w-4 h-4 text-[#2e7d32]" /> Shipping Address
              </h3>
              {order.user_addresses ? (
                <div className="text-sm text-gray-600 leading-relaxed bg-[rgba(46,125,50,0.03)] p-4 rounded-xl border border-[rgba(46,125,50,0.1)]">
                  <p className="font-bold text-[#1a3d1f] mb-1">{order.user_addresses.fullname}</p>
                  <p>{order.user_addresses.street}</p>
                  <p>{order.user_addresses.city}, {order.user_addresses.state}</p>
                  <p>{order.user_addresses.zip_code}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No address provided</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link to="/shop" className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
              Continue Shopping <ChevronRight className="w-5 h-5"/>
            </Link>
            <Link to="/dashboard" className="flex-1 bg-white border-2 border-gray-200 text-gray-700 hover:border-[#2e7d32] hover:text-[#2e7d32] font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
              <Home className="w-5 h-5"/> Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
