import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      navigate('/dashboard');
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
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2e7d32] rounded-2xl mb-4 shadow-lg">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#1a3d1f]">Welcome Back</h1>
          <p className="text-[#5f7a60] mt-1 text-sm">Sign in to continue earning rewards</p>
        </div>

        <div className="glass-panel p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-gray-700 cursor-pointer"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-[#5f7a60] font-semibold uppercase tracking-wide">or with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2d4a30] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f7a60]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-glass pl-10"
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
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 !py-3">
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5f7a60]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#2e7d32] font-bold hover:underline cursor-pointer">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
