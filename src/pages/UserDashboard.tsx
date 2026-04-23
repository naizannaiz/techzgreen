import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Camera, ShoppingBag, Package, Star, ArrowRight, Leaf, Truck, CheckCheck,
  Clock, Mail, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

const ADMIN_EMAIL = 'techzgreen23@gmail.com';

// ── Order Tracking Card ──
function OrderTrackCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);

  const isShipped = order.shipped;
  const isDelivered = order.status === 'delivered';
  const step = isDelivered ? 2 : isShipped ? 1 : 0;

  const steps = [
    { label: 'Order Placed', icon: <Package className="w-4 h-4" />, done: step >= 0 },
    { label: 'Shipped', icon: <Truck className="w-4 h-4" />, done: step >= 1 },
    { label: 'Delivered', icon: <CheckCheck className="w-4 h-4" />, done: step >= 2 },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isShipped ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
          {isShipped ? <Truck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black text-[#1a3d1f] text-sm">#{order.id.substring(0, 8).toUpperCase()}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isDelivered ? 'bg-green-100 text-green-700' :
              isShipped ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {isDelivered ? '✓ Delivered' : isShipped ? '🚚 Shipped' : '⏳ Processing'}
            </span>
          </div>
          <p className="text-xs text-[#5f7a60] mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            {order.expected_delivery && isShipped && !isDelivered && (
              <span className="ml-2 text-[#2e7d32] font-semibold">
                · Est. {new Date(order.expected_delivery).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-black text-[#2e7d32] text-sm">₹{Number(order.total_amount).toFixed(2)}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#5f7a60]" /> : <ChevronDown className="w-4 h-4 text-[#5f7a60]" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[rgba(46,125,50,0.1)] p-4 space-y-5 bg-[rgba(46,125,50,0.02)]">
          {/* 3-step timeline */}
          <div>
            <p className="text-xs font-bold text-[#2d4a30] uppercase tracking-wide mb-3">Tracking</p>
            <div className="flex items-center">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${s.done ? 'bg-[#2e7d32] text-white' : 'bg-[rgba(46,125,50,0.1)] text-[#5f7a60]'}`}>
                    {s.icon}
                  </div>
                  <span className={`ml-1 text-[10px] sm:text-xs font-bold whitespace-nowrap ${s.done ? 'text-[#2e7d32]' : 'text-[#5f7a60]'}`}>{s.label}</span>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded-full min-w-[12px] ${step > i ? 'bg-[#2e7d32]' : 'bg-[rgba(46,125,50,0.12)]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          {order.order_items && order.order_items.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[#2d4a30] uppercase tracking-wide mb-2">Items</p>
              <div className="space-y-2">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 bg-white/50 rounded-xl p-2.5">
                    <img
                      src={item.products?.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=60&q=60'}
                      alt={item.products?.name}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-[#1a3d1f] text-sm truncate">{item.products?.name}</p>
                      <p className="text-xs text-[#5f7a60]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-[#2e7d32] text-sm">₹{(item.quantity * item.price_at_time).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support */}
          <div className="flex items-center gap-2 pt-1 border-t border-[rgba(46,125,50,0.08)]">
            <Mail className="w-3.5 h-3.5 text-[#5f7a60] flex-shrink-0" />
            <span className="text-xs text-[#5f7a60]">Need help?</span>
            <a
              href={`mailto:${ADMIN_EMAIL}?subject=Order #${order.id.substring(0, 8).toUpperCase()} Help`}
              className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1"
            >
              Contact support <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, profileRole, totalPoints, loading } = useAuth();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    if (profileRole === 'admin') { navigate('/admin'); return; }

    supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setRecentOrders(data); });
  }, [user, profileRole, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-in pb-24 sm:pb-10">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      {/* Hero Header */}
      <div className="glass-panel-dark p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="text-[#66bb6a] w-5 h-5" />
              <span className="text-[rgba(200,230,201,0.8)] text-sm font-semibold">Welcome back</span>
            </div>
            <h1 className="text-3xl font-black text-white">{user.email?.split('@')[0]}</h1>
            <p className="text-[rgba(200,230,201,0.7)] mt-1 text-sm">Keep up the great work saving our planet!</p>
          </div>
          <div className="stat-box-dark px-4 sm:px-8 py-4 sm:py-5 text-center">
            <Star className="w-6 h-6 text-[#ffb300] mx-auto mb-1 fill-[#ffb300]" />
            <p className="stat-num text-4xl">{totalPoints}</p>
            <p className="stat-label tracking-wide">Green Points</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-xl font-bold text-[#1a3d1f] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/rewards" className="group glass-card p-3 sm:p-5 flex flex-col items-center gap-3 text-center cursor-pointer !rounded-xl">
              <div className="bg-[rgba(46,125,50,0.1)] p-3 rounded-xl border border-[rgba(46,125,50,0.15)] group-hover:bg-[rgba(46,125,50,0.18)] transition-colors">
                <Camera className="w-7 h-7 text-[#2e7d32]" />
              </div>
              <div>
                <p className="font-bold text-[#1a3d1f] text-sm">Earn Points</p>
                <p className="text-xs text-[#5f7a60] mt-0.5">Upload waste pic</p>
              </div>
            </Link>
            <Link to="/shop" className="group glass-card p-3 sm:p-5 flex flex-col items-center gap-3 text-center cursor-pointer !rounded-xl">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 group-hover:bg-amber-100 transition-colors">
                <ShoppingBag className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-[#1a3d1f] text-sm">Shop</p>
                <p className="text-xs text-[#5f7a60] mt-0.5">Eco products</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Order History + Tracking */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1a3d1f]">My Orders</h2>
            {recentOrders.length > 0 && (
              <Link to="/shop" className="text-xs font-bold text-[#2e7d32] flex items-center gap-1 hover:underline">
                Shop More <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-[rgba(46,125,50,0.2)] mx-auto mb-2" />
                <p className="text-[#5f7a60] text-sm font-medium">No orders yet.</p>
                <Link to="/shop" className="text-xs text-[#2e7d32] font-bold hover:underline mt-1 inline-block">Browse the shop</Link>
              </div>
            ) : (
              recentOrders.map(order => <OrderTrackCard key={order.id} order={order} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
