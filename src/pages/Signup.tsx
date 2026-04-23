import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Leaf, UserPlus, Mail, Lock } from 'lucide-react';

export default function Signup() {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      setSuccess('Account created! Check your email to confirm, then log in.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-12">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2e7d32] rounded-2xl mb-4 shadow-lg">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#1a3d1f]">Join TechzGreen</h1>
          <p className="text-[#5f7a60] mt-1 text-sm">Start your eco-rewards journey today</p>
        </div>

        <div className="glass-panel p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">{success}</div>
          )}

          <button
            onClick={signInWithGoogle}
            className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-gray-700 cursor-pointer"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-[#5f7a60] font-semibold uppercase tracking-wide">or with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-glass pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 !py-3">
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#5f7a60]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2e7d32] font-bold hover:underline cursor-pointer">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
