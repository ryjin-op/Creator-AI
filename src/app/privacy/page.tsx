'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Privacy <span className="text-primary">Policy</span></h1>
            <p className="text-sm font-black text-text-muted uppercase tracking-[0.3em] opacity-50">Last Updated: April 5, 2026</p>
          </section>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 md:p-16 bg-white/2 border border-white/5 rounded-[3rem] space-y-10 prose prose-invert max-w-none shadow-3xl"
          >
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">1. Data Encryption</h2>
              <p className="text-text-muted leading-relaxed font-medium">All user data transmitted to our neural core is encrypted using RSA-4096 protocols. Your mission-critical data remains your property and is shielded from unauthorised access.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">2. AI Tracking</h2>
              <p className="text-text-muted leading-relaxed font-medium">We use anonymised system telemetry data to refine our underlying neural networks. This ensures the Platform remains at the peak of creative and technical performance.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">3. Third Party Links</h2>
              <p className="text-text-muted leading-relaxed font-medium">We may use APIs from partners like Google or Supabase to facilitate platform operations. Their privacy policies are independent of Creator AI's signal integrity standards.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">4. Your Control</h2>
              <p className="text-text-muted leading-relaxed font-medium">You have the power to initiate a data purge at any time using your Command Dashboard. All associated mission files and profile nodes will be permanently zeroed upon request.</p>
            </section>

            <section className="space-y-4 pt-10 border-t border-white/5 italic">
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest text-center">Creator AI Admin OS &copy; 2026. Secure transmission guaranteed by end-to-end mission encryption.</p>
            </section>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
