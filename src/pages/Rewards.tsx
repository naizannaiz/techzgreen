import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, Leaf, Clock, XCircle, Star, Gift, Tag } from 'lucide-react';
import QRCode from 'react-qr-code';
import type { Submission } from '../types';

export default function Rewards() {
  const { user, totalPoints, refreshPoints } = useAuth();
  const [activeTab, setActiveTab] = useState<'earn' | 'redeem'>('earn');

  // Earn State
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Redeem State
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [myVouchers, setMyVouchers] = useState<any[]>([]);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
      fetchVouchers();
      fetchMyVouchers();
      refreshPoints();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;
    const { data } = await supabase.from('waste_submissions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setSubmissions(data as Submission[]);
  };

  const fetchVouchers = async () => {
    const { data } = await supabase.from('vouchers').select('*').eq('is_active', true);
    if (data) setVouchers(data);
  };

  const fetchMyVouchers = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_vouchers').select('*, vouchers(*)').eq('user_id', user.id).order('redeemed_at', { ascending: false });
    if (data) setMyVouchers(data);
  };

  // Earn Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}_${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('waste-images').upload(filePath, file, { cacheControl: '31536000' });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('waste-images').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('waste_submissions').insert({
        user_id: user.id,
        image_url: publicUrl,
        status: 'pending',
      });
      if (dbError) throw dbError;

      setFile(null);
      setPreview(null);
      fetchSubmissions();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const totalEarned = submissions.filter((s: any) => s.status === 'approved').reduce((sum: number, s: any) => sum + (s.points_awarded || 0), 0);

  // Redeem Logic
  const buyVoucher = async (voucher: any) => {
    if (!user) return;
    if (totalPoints < voucher.points_cost) {
      alert("Not enough points!");
      return;
    }
    setBuying(true);
    try {
      const { error: ledgerError } = await supabase.from('points_ledger').insert({
        user_id: user.id,
        points_change: -voucher.points_cost,
        description: `Purchased voucher: ${voucher.title}`
      });
      if (ledgerError) throw ledgerError;

      const { error: voucherError } = await supabase.from('user_vouchers').insert({
        user_id: user.id,
        voucher_id: voucher.id
      });
      if (voucherError) throw voucherError;

      await fetchMyVouchers();
      await refreshPoints();
      alert("Voucher purchased successfully! You can see it in 'My Vouchers'.");
    } catch (err: any) {
      alert("Failed to purchase: " + err.message);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 fade-in">
      <Helmet>
        <title>Earn Green Points by Uploading Waste Photos | TechzGreen</title>
        <meta name="description" content="Submit plastic waste photos and earn green reward points. Redeem points for eco-friendly products or partner vouchers on TechzGreen." />
        <link rel="canonical" href="https://techzgreen.in/rewards" />
        <meta property="og:title" content="Earn Green Points by Uploading Waste Photos | TechzGreen" />
        <meta property="og:description" content="Submit plastic waste photos and earn green reward points. Redeem points for eco-friendly products or partner vouchers." />
        <meta property="og:url" content="https://techzgreen.in/rewards" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://techzgreen.in/favicon.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Hero Banner */}
      <div className="glass-panel-dark p-10 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Leaf className="text-[#ffb300] w-8 h-8" />
              <h1 className="text-3xl font-black text-white">Earn Green Points</h1>
            </div>
            <p className="text-[rgba(200,230,201,0.85)] leading-relaxed max-w-lg">
              Earn points by submitting plastic waste, and redeem them for exciting partner vouchers or discounts on TechzGreen products!
            </p>
          </div>
          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="stat-box-dark px-6 py-4 text-center min-w-[130px]">
              <Star className="w-5 h-5 text-[#ffb300] mx-auto mb-1 fill-[#ffb300]" />
              <p className="stat-num">{totalEarned}</p>
              <p className="stat-label">Total Earned</p>
            </div>
            <div className="stat-box-dark px-6 py-4 text-center min-w-[130px]">
              <Star className="w-5 h-5 text-green-300 mx-auto mb-1 fill-green-300" />
              <p className="stat-num">{totalPoints}</p>
              <p className="stat-label">Available Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('earn')}
          className={`pb-4 px-4 font-bold text-lg transition-colors flex items-center gap-2 ${activeTab === 'earn' ? 'text-[#2e7d32] border-b-4 border-[#2e7d32]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <UploadCloud className="w-5 h-5" /> Earn Points
        </button>
        <button
          onClick={() => setActiveTab('redeem')}
          className={`pb-4 px-4 font-bold text-lg transition-colors flex items-center gap-2 ${activeTab === 'redeem' ? 'text-[#ffb300] border-b-4 border-[#ffb300]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Gift className="w-5 h-5" /> Redeem Vouchers
        </button>
      </div>

      {/* EARN TAB */}
      {activeTab === 'earn' && (
        <div className="grid md:grid-cols-2 gap-8 fade-in">
          {/* Upload Card */}
          <div className="glass-panel p-8 h-fit">
            <h2 className="text-2xl font-bold text-[#1a3d1f] mb-6">Upload Evidence</h2>
            <form onSubmit={handleUpload} className="space-y-5">
              <label className="block cursor-pointer">
                <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${preview ? 'border-[#2e7d32] bg-[rgba(46,125,50,0.04)]' : 'border-[rgba(46,125,50,0.25)] hover:border-[#2e7d32] hover:bg-[rgba(46,125,50,0.03)]'}`}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-[rgba(46,125,50,0.4)] mx-auto mb-3" />
                      <p className="text-[#5f7a60] font-semibold">Click to browse or drag image here</p>
                      <p className="text-xs text-[#5f7a60] mt-1 opacity-70">JPG, PNG or WEBP accepted</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {file && (
                <p className="text-sm text-[#2e7d32] font-semibold bg-[rgba(46,125,50,0.08)] px-3 py-2 rounded-lg">
                  ✓ {file.name}
                </p>
              )}

              <button type="submit" disabled={!file || uploading} className="btn-accent w-full flex items-center justify-center gap-2 !py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {uploading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> Uploading...</> : <><UploadCloud className="w-4 h-4" /> Submit to Earn</>}
              </button>
            </form>
          </div>

          {/* History */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a3d1f] mb-6">Your History</h2>
            <div className="space-y-4">
              {submissions.length === 0 && (
                <div className="glass-panel p-8 text-center">
                  <Leaf className="w-10 h-10 text-[rgba(46,125,50,0.25)] mx-auto mb-2" />
                  <p className="text-[#5f7a60] font-medium">No submissions yet. Start earning!</p>
                </div>
              )}
              {submissions.map((sub: any) => (
                <div key={sub.id} className="glass-card p-4 flex gap-4 items-center">
                  <img src={sub.image_url} alt="Waste" loading="lazy" className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="text-xs text-[#5f7a60] mb-1">{new Date(sub.created_at).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {sub.status === 'pending' && <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg"><Clock className="w-3 h-3"/>Pending</span>}
                      {sub.status === 'approved' && <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg"><CheckCircle2 className="w-3 h-3"/>Approved</span>}
                      {sub.status === 'rejected' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg"><XCircle className="w-3 h-3"/>Rejected</span>}
                    </div>
                    {sub.status === 'approved' && (
                      <p className="text-sm font-black text-[#2e7d32] mt-1.5 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#ffb300] text-[#ffb300]" />+{sub.points_awarded} Points
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REDEEM TAB */}
      {activeTab === 'redeem' && (
        <div className="fade-in space-y-12">
          
          {/* Voucher Store */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Tag className="text-[#ffb300]" /> Voucher Store</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {vouchers.map(v => (
                <div key={v.id} className="glass-panel p-6 flex flex-col relative overflow-hidden group hover:border-[#ffb300] transition-colors cursor-pointer">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                  <h3 className="font-bold text-xl text-[#1a3d1f] relative z-10">{v.brand_name}</h3>
                  <p className="text-[#2e7d32] font-black text-2xl mt-1 mb-3 relative z-10">{v.title}</p>
                  <p className="text-[#5f7a60] text-sm flex-grow relative z-10">{v.description}</p>
                  
                  <div className="mt-6 pt-4 border-t border-[rgba(46,125,50,0.1)] flex items-center justify-between relative z-10">
                    <span className="font-bold text-[#ffb300] flex items-center gap-1"><Star className="w-4 h-4 fill-[#ffb300]" /> {v.points_cost} pts</span>
                    <button 
                      onClick={() => buyVoucher(v)}
                      disabled={buying || totalPoints < v.points_cost}
                      className="bg-[#2e7d32] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1b5e20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {totalPoints >= v.points_cost ? 'Buy Voucher' : 'Not enough pts'}
                    </button>
                  </div>
                </div>
              ))}
              {vouchers.length === 0 && (
                <div className="col-span-3 text-center py-10 text-gray-500">No vouchers available in the store right now.</div>
              )}
            </div>
          </div>

          {/* My Vouchers */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a3d1f] mb-6 flex items-center gap-2"><Gift className="text-[#2e7d32]" /> My Vouchers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {myVouchers.map(uv => (
                <div key={uv.id} className="bg-gradient-to-r from-[#1a3d1f] to-[#2e7d32] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 h-full w-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10">
                    <p className="text-amber-300 font-bold text-sm uppercase tracking-wider mb-1">{uv.vouchers.brand_name}</p>
                    <h3 className="font-black text-2xl mb-2">{uv.vouchers.title}</h3>
                    <p className="text-green-100 text-sm mb-6">{uv.vouchers.description}</p>
                    
                    <div className="bg-white/10 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm border border-white/20 mb-3">
                      <span className="text-sm text-green-50 font-medium">Promo Code</span>
                      <span className="font-mono font-black text-lg tracking-widest">{uv.vouchers.promo_code}</span>
                    </div>

                    <div className="bg-white rounded-lg p-3 flex justify-center items-center">
                      <QRCode value={uv.id} size={100} level="M" />
                    </div>
                  </div>
                </div>
              ))}
              {myVouchers.length === 0 && (
                <div className="col-span-2 glass-panel p-8 text-center">
                  <Gift className="w-10 h-10 text-[rgba(46,125,50,0.25)] mx-auto mb-2" />
                  <p className="text-[#5f7a60] font-medium">You haven't bought any vouchers yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
