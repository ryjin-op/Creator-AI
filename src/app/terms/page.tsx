'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Terms of <span className="text-primary">Service</span></h1>
            <p className="text-sm font-black text-text-muted uppercase tracking-[0.3em] opacity-50">Last Updated: April 5, 2026</p>
          </section>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 md:p-16 bg-white/2 border border-white/5 rounded-[3rem] space-y-10 prose prose-invert max-w-none shadow-3xl"
          >
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">1. Acceptance of Terms</h2>
              <p className="text-text-muted leading-relaxed font-medium">By accessing and using Creator AI (the "Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">2. Use of AI Services</h2>
              <p className="text-text-muted leading-relaxed font-medium">Under our neural orchestration protocols, you are granted a non-exclusive license to use our content generation tools. You are responsible for any content produced using our services and must ensure it complies with local laws and ethical standards.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">3. Subscription and Credits</h2>
              <p className="text-text-muted leading-relaxed font-medium">Credits are required for system operations. Paid plans offer various credit allocations. Credits are non-refundable and expire based on your plan's configuration.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">4. Prohibited Content</h2>
              <p className="text-text-muted leading-relaxed font-medium">You may not use our AI to generate illegal, harmful, or deceptive content. Violation of this protocol will lead to an immediate system lock-out and termination of your account.</p>
            </section>

            <section className="space-y-4 pt-10 border-t border-white/5 italic">
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest text-center">Creator AI Admin OS &copy; 2026. All operations monitored by encrypted mission protocols.</p>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
