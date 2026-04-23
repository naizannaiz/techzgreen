import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, AlertTriangle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      // Verify the user is actually an admin by checking their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user!.id)
        .single();

      if (profileError || !profile) throw new Error('Could not fetch profile.');

      if (profile.role !== 'admin') {
        // Sign them out immediately — they are not an admin
        await supabase.auth.signOut();
        throw new Error('Access denied. This portal is for administrators only.');
      }

      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="w-full max-w-md">

        {/* Brand Mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl relative"
            style={{background: 'linear-gradient(135deg, #1b5e20, #2e7d32)'}}>
            <ShieldCheck className="w-8 h-8 text-white" />
            {/* Admin badge */}
            <span className="absolute -top-2 -right-2 bg-[#ffb300] text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow">
              ADMIN
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#1a3d1f]">Admin Portal</h1>
          <p className="text-[#5f7a60] mt-1 text-sm">Restricted access — administrators only</p>
        </div>

        {/* Warning Banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
          <p>This login is exclusively for <strong>admin accounts</strong>. Regular users will be denied access.</p>
        </div>

        <div className="glass-panel p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techzgreen.com"
                  className="input-glass pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-glass pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-black py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg"
              style={{background: loading ? '#388e3c' : 'linear-gradient(135deg, #1b5e20, #2e7d32)'}}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Verifying Access...</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> Sign In as Admin</>
              )}
            </button>
          </form>

          <div className="border-t border-[rgba(46,125,50,0.1)] pt-4 text-center">
            <p className="text-xs text-[#5f7a60]">
              Not an admin?{' '}
              <Link to="/login" className="text-[#2e7d32] font-bold hover:underline cursor-pointer">
                User Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
