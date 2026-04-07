'use client';

import Link from 'next/link';
import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function CTA() {
  const { user } = useAuth();

  return (
    <section className="py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
          className="glass-panel p-16 md:p-24 text-center relative overflow-hidden border border-white/10 hover:border-primary/50 hover:shadow-[0_40px_100px_-20px_rgba(138,43,226,0.3)] transition-all duration-500"
        >
          {/* Background Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-main blur-[100px] z-[-1] pointer-events-none"
          ></motion.div>

          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-heading mb-8 leading-tight max-w-3xl mx-auto"
          >
            Ready to Start Creating <span className="text-gradient">Viral Content?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of modern creators leveraging AI to scale their output and quality.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link href="/dashboard" className="btn btn-primary w-full px-10 py-5 text-xl flex items-center justify-center gap-3">
                  <LayoutDashboard size={24} />
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link href="/signup" className="btn btn-primary w-full px-10 py-5 text-xl flex items-center justify-center gap-2">
                  Sign Up Free <ArrowRight size={22} />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
