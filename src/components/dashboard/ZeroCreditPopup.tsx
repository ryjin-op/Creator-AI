'use client';

import { X, Zap, Gift, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZeroCreditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'generate' | 'login';
  onNavigate: (target: 'earn' | 'buy') => void;
}

export default function ZeroCreditPopup({ isOpen, onClose, context, onNavigate }: ZeroCreditPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass-panel w-full max-w-md p-10 rounded-3xl border border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(138,43,226,0.15)] relative text-center bg-[#121214] overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-text-muted hover:text-white transition-all border border-white/10"
            >
              <X size={18} />
            </button>

            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(138,43,226,0.2)] border border-primary/30"
            >
              <Zap size={40} className="text-primary drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]" />
            </motion.div>

            <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
              You&apos;re out of credits ⚡
            </h2>
            
            <p className={`text-lg font-medium mb-10 px-4 ${context === 'generate' ? 'text-red-400' : 'text-text-muted'}`}>
              {context === 'generate' 
                ? "You need credits to continue generating AI content." 
                : "Get credits to continue using our powerful AI tools."}
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => onNavigate('earn')}
                className="w-full py-4 bg-[#00fa9a]/10 border border-[#00fa9a]/30 rounded-2xl text-[#00fa9a] font-bold text-lg flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(0,250,154,0.15)] transition-all duration-300"
              >
                <Gift size={22} className="animate-bounce" /> Get Credits for Free
              </button>

              <button 
                onClick={() => onNavigate('buy')}
                className="btn btn-primary w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-xl transform active:scale-95 transition-all"
              >
                <CreditCard size={22} /> Buy Credits
              </button>
            </div>

            <button 
              onClick={onClose}
              className="mt-8 text-sm text-text-muted font-bold hover:text-white hover:underline underline-offset-4 transition-all"
            >
              Maybe Later
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
