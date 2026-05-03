import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User, Mail, Leaf, MapPin, Plus, Trash2, CheckCircle2,
  XCircle, Clock, Award, Gift, TrendingUp, TrendingDown,
  Camera, ShoppingBag, Calendar, ChevronRight, Pencil, X, Check
} from 'lucide-react';
import { GCoinIcon } from '../components/GCoin';

// ─── Address Form ───────────────────────────────────────────────────────────
function AddressForm({ onSave, onCancel, saving }: {
  onSave: (form: any) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ fullname: '', street: '', city: '', state: '', zip_code: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSave(form); }}
      className="space-y-3 pt-4 border-t border-[rgba(46,125,50,0.1)] mt-4"
    >
      <p className="text-sm font-bold text-[#1a3d1f] mb-2">New Address</p>
      <input required value={form.fullname} onChange={e => set('fullname', e.target.value)} placeholder="Full name" className="input-glass" />
      <input required value={form.street} onChange={e => set('street', e.target.value)} placeholder="Street address" className="input-glass" />
      <div className="grid grid-cols-2 gap-3">
        <input required value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" className="input-glass" />
        <input required value={form.state} onChange={e => set('state', e.target.value)} placeholder="State" className="input-glass" />
      </div>
      <input required value={form.zip_code} onChange={e => set('zip_code', e.target.value)} placeholder="PIN code" className="input-glass" />
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 !py-2 !px-5 disabled:opacity-50 text-sm">
          {saving ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : <><Check className="w-3.5 h-3.5" />Save</>}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl border border-[rgba(46,125,50,0.2)] text-[#5f7a60] text-sm font-bold hover:bg-[rgba(46,125,50,0.05)] transition-colors">Cancel</button>
      </div>
    </form>
  );
}

// ─── Stat Pill ───────────────────────────────────────────────────────────────
function StatPill({ icon, label, value, accent = false }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`glass-card !rounded-2xl p-4 flex flex-col items-center gap-1.5 text-center min-w-[90px] ${accent ? 'border-[rgba(255,179,0,0.4)]' : ''}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-amber-50 text-amber-600' : 'bg-[rgba(46,125,50,0.1)] text-[#2e7d32]'}`}>
        {icon}
      </div>
      <p className={`text-xl font-black ${accent ? 'text-amber-600' : 'text-[#1a3d1f]'}`} style={{ fontFamily: 'Outfit,sans-serif' }}>{value}</p>
      <p className="text-[10px] font-bold text-[#5f7a60] uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    approved: { label: 'Approved', cls: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-600', icon: <XCircle className="w-3 h-3" /> },
    pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function UserProfile() {
  const navigate = useNavigate();
  const { user, profileRole, totalPoints, loading } = useAuth();

  const [addresses, setAddresses]   = useState<any[]>([]);
  const [ledger, setLedger]         = useState<any[]>([]);
  const [vouchers, setVouchers]     = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats]           = useState({ orders: 0, events: 0 });

  const [showAddrForm, setShowAddrForm] = useState(false);
  const [savingAddr, setSavingAddr]     = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  const [editName, setEditName]     = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    if (profileRole === 'admin') { navigate('/admin'); return; }

    const uid = user.id;

    // Display name from user metadata or email
    setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');

    Promise.all([
      supabase.from('user_addresses').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
      supabase.from('points_ledger').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(20),
      supabase.from('user_vouchers').select('*, vouchers(title, brand_name, points_cost)').eq('user_id', uid).order('redeemed_at', { ascending: false }),
      supabase.from('waste_submissions').select('id, status, points_awarded, created_at, image_url').eq('user_id', uid).order('created_at', { ascending: false }).limit(10),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('user_id', uid),
    ]).then(([addr, led, vouch, subs, ord, evt]) => {
      if (addr.data)   setAddresses(addr.data);
      if (led.data)    setLedger(led.data);
      if (vouch.data)  setVouchers(vouch.data);
      if (subs.data)   setSubmissions(subs.data);
      setStats({ orders: ord.count ?? 0, events: evt.count ?? 0 });
    });
  }, [user, profileRole, loading, navigate]);

  const saveAddress = async (form: any) => {
    if (!user) return;
    setSavingAddr(true);
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({ ...form, user_id: user.id })
      .select()
      .single();
    setSavingAddr(false);
    if (!error && data) {
      setAddresses(a => [data, ...a]);
      setShowAddrForm(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!window.confirm('Remove this address?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('user_addresses').delete().eq('id', id);
    if (error) {
      // FK constraint — address is linked to a past order, can't hard-delete
      if (error.code === '23503') {
        alert('This address is linked to an existing order and cannot be deleted.');
      } else {
        alert('Failed to delete: ' + error.message);
      }
    } else {
      setAddresses(a => a.filter(x => x.id !== id));
    }
    setDeletingId(null);
  };

  const saveName = async () => {
    if (!user) return;
    setSavingName(true);
    await supabase.auth.updateUser({ data: { full_name: displayName } });
    setSavingName(false);
    setEditName(false);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-[#2e7d32] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (displayName || user.email || 'U').slice(0, 2).toUpperCase();
  const joinedDate = new Date(user.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 fade-in pb-24 sm:pb-10">
      <Helmet>
        <title>My Profile · TechzGreen</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Hero ── */}
      <div className="glass-panel-dark p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4caf50] to-[#2e7d32] flex items-center justify-center text-white font-black text-2xl shadow-lg" style={{ fontFamily: 'Outfit,sans-serif' }}>
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#ffb300] w-6 h-6 rounded-lg flex items-center justify-center shadow">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Name & Email */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {editName ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="bg-white/10 border border-white/30 text-white rounded-lg px-3 py-1.5 text-lg font-bold outline-none focus:border-white/60 placeholder:text-white/40"
                    placeholder="Your name"
                  />
                  <button onClick={saveName} disabled={savingName} className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-white transition-colors">
                    {savingName ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditName(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{displayName || user.email?.split('@')[0]}</h1>
                  <button onClick={() => setEditName(true)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <span className="flex items-center gap-1.5 text-[rgba(200,230,201,0.8)] text-sm"><Mail className="w-3.5 h-3.5" />{user.email}</span>
              <span className="flex items-center gap-1.5 text-[rgba(200,230,201,0.7)] text-xs"><Calendar className="w-3 h-3" />Joined {joinedDate}</span>
            </div>
          </div>

          {/* G Coins */}
          <div className="stat-box-dark px-5 py-3 flex items-center gap-3 flex-shrink-0">
            <GCoinIcon size={42} />
            <p className="stat-num text-3xl">{totalPoints}</p>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
        <StatPill icon={<GCoinIcon size={28} />} label="G Coins" value={totalPoints} accent />
        <StatPill icon={<ShoppingBag className="w-4.5 h-4.5" />} label="Orders" value={stats.orders} />
        <StatPill icon={<Camera className="w-4.5 h-4.5" />} label="Submissions" value={submissions.length} />
        <StatPill icon={<Calendar className="w-4.5 h-4.5" />} label="Events" value={stats.events} />
        <StatPill icon={<Gift className="w-4.5 h-4.5" />} label="Vouchers" value={vouchers.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Left column ── */}
        <div className="space-y-6">

          {/* Points History */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2"><Award className="w-5 h-5 text-[#ffb300]" />G Coin History</h2>
              <Link to="/rewards" className="text-xs font-bold text-[#2e7d32] flex items-center gap-1 hover:underline">
                Earn more <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {ledger.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-10 h-10 text-[rgba(46,125,50,0.18)] mx-auto mb-2" />
                <p className="text-[#5f7a60] text-sm">No points activity yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
                {ledger.map((row: any) => (
                  <div key={row.id} className="flex items-center gap-3 bg-[rgba(46,125,50,0.03)] border border-[rgba(46,125,50,0.08)] rounded-xl px-4 py-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${row.points_change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                      {row.points_change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d1f] truncate">{row.description}</p>
                      <p className="text-xs text-[#5f7a60]">{new Date(row.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </div>
                    <span className={`flex-shrink-0 font-black text-sm ${row.points_change > 0 ? 'text-green-700' : 'text-red-500'}`}>
                      {row.points_change > 0 ? '+' : ''}{row.points_change}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Redeemed Vouchers */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2 mb-5"><Gift className="w-5 h-5 text-[#2e7d32]" />My Vouchers</h2>
            {vouchers.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="w-10 h-10 text-[rgba(46,125,50,0.18)] mx-auto mb-2" />
                <p className="text-[#5f7a60] text-sm">No vouchers redeemed yet.</p>
                <Link to="/rewards" className="text-xs font-bold text-[#2e7d32] hover:underline mt-1 inline-block">Browse rewards →</Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scroll">
                {vouchers.map((uv: any) => (
                  <div key={uv.id} className="flex items-center gap-3 bg-[rgba(255,179,0,0.05)] border border-[rgba(255,179,0,0.2)] rounded-xl px-4 py-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-[#1a3d1f] truncate">{uv.vouchers?.title}</p>
                      <p className="text-xs text-[#5f7a60]">{uv.vouchers?.brand_name} · {uv.vouchers?.points_cost} G Coins</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${uv.is_used ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                      {uv.is_used ? 'Used' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">

          {/* Addresses */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2"><MapPin className="w-5 h-5 text-[#2e7d32]" />Saved Addresses</h2>
              {!showAddrForm && (
                <button
                  onClick={() => setShowAddrForm(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#2e7d32] bg-[rgba(46,125,50,0.08)] hover:bg-[rgba(46,125,50,0.15)] border border-[rgba(46,125,50,0.18)] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />Add
                </button>
              )}
            </div>

            {addresses.length === 0 && !showAddrForm ? (
              <div className="text-center py-6">
                <MapPin className="w-10 h-10 text-[rgba(46,125,50,0.18)] mx-auto mb-2" />
                <p className="text-[#5f7a60] text-sm">No saved addresses.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <div key={addr.id} className={`flex items-start gap-3 bg-[rgba(46,125,50,0.03)] border border-[rgba(46,125,50,0.1)] rounded-xl p-4 transition-opacity ${deletingId === addr.id ? 'opacity-40 pointer-events-none' : ''}`}>
                    <MapPin className="w-4 h-4 text-[#2e7d32] mt-0.5 flex-shrink-0" />
                    <div className="flex-grow min-w-0 text-sm text-[#2d4a30]">
                      <p className="font-bold">{addr.fullname}</p>
                      <p className="text-[#5f7a60] text-xs mt-0.5">{addr.street}, {addr.city}, {addr.state} — {addr.zip_code}</p>
                    </div>
                    <button onClick={() => deleteAddress(addr.id)} className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddrForm && (
              <AddressForm onSave={saveAddress} onCancel={() => setShowAddrForm(false)} saving={savingAddr} />
            )}
          </div>

          {/* Waste Submissions */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1a3d1f] flex items-center gap-2"><Camera className="w-5 h-5 text-[#2e7d32]" />Waste Submissions</h2>
              <Link to="/rewards" className="text-xs font-bold text-[#2e7d32] flex items-center gap-1 hover:underline">
                Submit new <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <Camera className="w-10 h-10 text-[rgba(46,125,50,0.18)] mx-auto mb-2" />
                <p className="text-[#5f7a60] text-sm">No submissions yet.</p>
                <Link to="/rewards" className="text-xs font-bold text-[#2e7d32] hover:underline mt-1 inline-block">Submit waste photo →</Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
                {submissions.map((sub: any) => (
                  <div key={sub.id} className="flex items-center gap-3 bg-[rgba(46,125,50,0.03)] border border-[rgba(46,125,50,0.08)] rounded-xl p-3">
                    <img
                      src={sub.image_url}
                      alt="Waste"
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={sub.status} />
                        {sub.points_awarded > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-green-700"><GCoinIcon size={18} />+{sub.points_awarded} G Coins</span>
                        )}
                      </div>
                      <p className="text-xs text-[#5f7a60] mt-0.5">{new Date(sub.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick nav */}
          <div className="glass-panel p-5">
            <p className="text-xs font-bold text-[#5f7a60] uppercase tracking-wide mb-3">Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/dashboard', label: 'Dashboard', icon: <User className="w-4 h-4" /> },
                { to: '/rewards', label: 'Earn G Coins', icon: <Camera className="w-4 h-4" /> },
                { to: '/shop', label: 'Shop', icon: <ShoppingBag className="w-4 h-4" /> },
                { to: '/events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
              ].map(({ to, label, icon }) => (
                <Link key={to} to={to} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[rgba(46,125,50,0.05)] hover:bg-[rgba(46,125,50,0.1)] border border-[rgba(46,125,50,0.1)] text-sm font-bold text-[#2d4a30] transition-colors">
                  <span className="text-[#2e7d32]">{icon}</span>{label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
