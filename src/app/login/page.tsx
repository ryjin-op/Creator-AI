'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message || 'Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success('Welcome back! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-[#0B0B0F]">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 md:p-12 relative z-10 border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-main mb-6 shadow-lg shadow-primary/20">
            <Sparkles size={32} color="#fff" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">Welcome Back</h2>
          <p className="text-text-muted">Sign in to continue to CreatorAI</p>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-white text-[#1a1a1a] font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl mb-8 group"
        >
          {googleLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 18 18" className="group-hover:scale-110 transition-transform">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-text-muted uppercase tracking-widest font-bold">or use email</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-text-muted mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-sm font-bold text-text-muted">Password</label>
              <Link href="/forgot-password" title="Click to recover your password" className="text-xs font-bold text-primary hover:text-secondary transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-body text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-primary/20"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Signing in...</>
            ) : (
              <>Sign In <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-sm text-text-muted font-medium">
          Don&apos;t have an account? <Link href="/signup" title="Create a new account" className="text-secondary font-bold hover:underline transition-all underline-offset-4">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
