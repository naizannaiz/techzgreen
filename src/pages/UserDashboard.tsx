import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Camera, ShoppingBag, Package, ArrowRight, Leaf, Truck, CheckCheck,
  Clock, Mail, ChevronDown, ChevronUp, ExternalLink, Gift
} from 'lucide-react';
import { GCoinIcon } from '../components/GCoin';

const ADMIN_EMAIL = 'techzgreen23@gmail.com';

function OrderTrackCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  const isShipped = order.shipped;
  const isDelivered = order.status === 'delivered';
  const step = isDelivered ? 2 : isShipped ? 1 : 0;

  const steps = [
    { label: 'Placed', icon: <Package className="w-3.5 h-3.5" />, done: step >= 0 },
    { label: 'Shipped', icon: <Truck className="w-3.5 h-3.5" />, done: step >= 1 },
    { label: 'Delivered', icon: <CheckCheck className="w-3.5 h-3.5" />, done: step >= 2 },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-3 p-4 text-left cursor-pointer">
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isShipped ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
          {isShipped ? <Truck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-[#1a3d1f] text-sm">#{order.id.substring(0, 8).toUpperCase()}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDelivered ? 'bg-green-100 text-green-700' :
              isShipped ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {isDelivered ? '✓ Delivered' : isShipped ? '🚚 Shipped' : '⏳ Processing'}
            </span>
          </div>
          <p className="text-[11px] text-[#5f7a60] mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-black text-[#2e7d32] text-sm">₹{Number(order.total_amount).toFixed(0)}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#5f7a60]" /> : <ChevronDown className="w-4 h-4 text-[#5f7a60]" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[rgba(46,125,50,0.1)] p-4 space-y-4 bg-[rgba(46,125,50,0.02)]">
          <div className="flex items-center">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? 'bg-[#2e7d32] text-white' : 'bg-[rgba(46,125,50,0.1)] text-[#5f7a60]'}`}>
                  {s.icon}
                </div>
                <span className={`ml-1 text-[10px] font-bold whitespace-nowrap ${s.done ? 'text-[#2e7d32]' : 'text-[#5f7a60]'}`}>{s.label}</span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded-full min-w-[8px] ${step > i ? 'bg-[#2e7d32]' : 'bg-[rgba(46,125,50,0.12)]'}`} />
                )}
              </div>
            ))}
          </div>

          {order.order_items && order.order_items.length > 0 && (
            <div className="space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 bg-white/50 rounded-xl p-2.5">
                  <img src={item.products?.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=60&q=60'}
                    alt={item.products?.name} className="w-9 h-9 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-[#1a3d1f] text-xs truncate">{item.products?.name}</p>
                    <p className="text-[10px] text-[#5f7a60]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-[#2e7d32] text-xs">₹{(item.quantity * item.price_at_time).toFixed(0)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1 border-t border-[rgba(46,125,50,0.08)]">
            <Mail className="w-3.5 h-3.5 text-[#5f7a60] flex-shrink-0" />
            <span className="text-xs text-[#5f7a60]">Need help?</span>
            <a href={`mailto:${ADMIN_EMAIL}?subject=Order #${order.id.substring(0, 8).toUpperCase()} Help`}
              className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1">
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

    supabase.from('orders')
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

  const displayName = user.email?.split('@')[0] || 'User';

  return (
    <div className="fade-in bottom-nav-safe">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>

      <div className="max-w-4xl mx-auto px-4">

        {/* ── Hero Banner ── */}
        <div className="mt-4 sm:mt-6 glass-panel-dark p-5 sm:p-8 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
          <div className="relative z-10 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="text-[#66bb6a] w-4 h-4" />
                <span className="text-[rgba(200,230,201,0.8)] text-xs font-semibold">Welcome back</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white capitalize" style={{ fontFamily: 'Outfit,sans-serif' }}>{displayName}</h1>
              <p className="text-[rgba(200,230,201,0.7)] text-xs sm:text-sm mt-0.5">Keep saving our planet! 🌿</p>
            </div>
            {/* G Coins badge */}
            <div className="mt-4 sm:mt-0 inline-flex items-center gap-3 bg-black/25 border border-white/20 rounded-2xl px-5 py-3">
              <GCoinIcon size={42} />
              <div>
                <p className="text-[rgba(200,230,201,0.7)] text-xs font-semibold">G Coins Balance</p>
                <p className="font-black text-white text-3xl leading-none" style={{ fontFamily: 'Outfit,sans-serif' }}>{totalPoints}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="mt-6">
          <h2 className="font-bold text-[#1a3d1f] text-sm uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { to: '/rewards', icon: <Camera className="w-7 h-7 text-[#2e7d32]" />, bg: 'bg-[rgba(46,125,50,0.1)]', border: 'border-[rgba(46,125,50,0.15)]', label: 'Earn Points', sub: 'Upload waste photo' },
              { to: '/shop', icon: <ShoppingBag className="w-7 h-7 text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-200', label: 'Shop', sub: 'Eco products' },
              { to: '/events', icon: <Package className="w-7 h-7 text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-200', label: 'Events', sub: 'Community eco-events' },
              { to: '/rewards', icon: <Gift className="w-7 h-7 text-[#ffb300]" />, bg: 'bg-amber-50', border: 'border-amber-200', label: 'Vouchers', sub: 'Redeem points' },
            ].map(({ to, icon, bg, border, label, sub }) => (
              <Link key={label} to={to} className="glass-card p-4 sm:p-5 flex flex-col gap-3 tap-card">
                <div className={`${bg} p-3 rounded-xl border ${border} w-fit`}>{icon}</div>
                <div>
                  <p className="font-bold text-[#1a3d1f] text-sm">{label}</p>
                  <p className="text-[10px] sm:text-xs text-[#5f7a60] mt-0.5">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── My Orders ── */}
        <div className="mt-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1a3d1f] text-sm uppercase tracking-wide">My Orders</h2>
            {recentOrders.length > 0 && (
              <Link to="/shop" className="text-xs font-bold text-[#2e7d32] flex items-center gap-1">
                Shop More <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="glass-panel p-8 text-center">
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
