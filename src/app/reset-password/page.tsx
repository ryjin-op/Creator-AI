'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Loader2, Save, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Pass-key recalibrated successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      toast.error(err.message || 'Calibration failure: Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-[#0B0B0F]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-8 md:p-12 relative z-10 border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-main mb-6 shadow-lg shadow-primary/20">
            <Lock size={32} color="#fff" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">Recalibrate Access</h2>
          <p className="text-text-muted">Enter your new security pass-key</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1">New Pass-Key</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent transition-all font-body text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 ml-1">Confirm Protocol</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-accent transition-all font-body text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Recalibrating...</>
            ) : (
              <>Update Security Code <Save size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-sm text-text-muted font-medium">
          Abort mission? <button onClick={() => router.push('/login')} className="text-red-500 font-bold hover:underline underline-offset-4 flex items-center justify-center gap-1 mx-auto mt-2"><XCircle size={14} /> Cancel Protocol</button>
        </p>
      </motion.div>
    </div>
  );
}
