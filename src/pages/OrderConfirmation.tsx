import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CheckCircle2, ChevronRight, Package, Home, Receipt, MapPin, Star, CreditCard } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      supabase
        .from('orders')
        .select('*, user_addresses(*)')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          setOrder(data);
          setLoading(false);
        });
    }
  }, [id]);

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

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 fade-in relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="bg-white max-w-2xl w-full rounded-[2rem] shadow-2xl overflow-hidden relative z-10">
        <div className="bg-gradient-to-r from-[#1a3d1f] to-[#2e7d32] p-10 text-center text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
            <CheckCircle2 className="w-12 h-12 text-[#ffb300]" />
          </div>
          <h1 className="text-4xl font-black mb-3">Order Confirmed!</h1>
          <p className="text-green-100 text-lg">Thank you for shopping sustainably with TechzGreen.</p>
        </div>
        
        <div className="p-8 md:p-10">
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
            {/* Payment Details */}
            <div>
              <h3 className="font-bold text-[#1a3d1f] flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Receipt className="w-4 h-4 text-[#ffb300]" /> Payment Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="font-bold text-[#2e7d32] bg-green-50 px-2 py-0.5 rounded-md">Paid</span>
                </div>
                {order.points_discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Points Applied</span>
                    <span className="font-bold text-[#ffb300] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#ffb300]" /> {order.points_used} pts (−₹{Number(order.points_discount_amount).toFixed(2)})
                    </span>
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

            {/* Shipping Details */}
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
