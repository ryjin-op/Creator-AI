'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Sparkles, Loader2, ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success('Recovery link dispatched!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send recovery link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-[#0B0B0F]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 md:p-12 relative z-10 border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-main mb-6 shadow-lg shadow-primary/20">
            <Mail size={32} color="#fff" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">Recover Access</h2>
          <p className="text-text-muted">Enter your email to receive a recovery link</p>
        </div>

        {sent ? (
          <div className="text-center space-y-8">
            <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-2xl">
              <p className="text-white font-medium">A transmission has been sent to <span className="text-secondary font-black">{email}</span>. Please check your inbox (and spam) to reset your pass-key.</p>
            </div>
            <button 
              onClick={() => setSent(false)}
              className="text-sm font-bold text-text-muted hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} /> Use a different email
            </button>
          </div>
        ) : (
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
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-secondary transition-all font-body text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-secondary w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 group shadow-lg shadow-secondary/20"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Dispatching...</>
              ) : (
                <>Send Protocol <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        )}

        <p className="text-center mt-10 text-sm text-text-muted font-medium">
          Remembered your password? <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
