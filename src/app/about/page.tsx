'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { motion } from 'framer-motion';
import { Target, Users, Zap, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { label: 'Innovation', icon: Zap, desc: 'Pushing the boundaries of AI-driven content creation.', color: 'text-primary' },
    { label: 'Community', icon: Users, desc: 'Empowering creators worldwide to share their stories.', color: 'text-secondary' },
    { label: 'Integrity', icon: ShieldCheck, desc: 'Prioritizing ethical AI and brand authenticity.', color: 'text-accent' },
    { label: 'Passion', icon: Heart, desc: 'Fueling creativity with advanced system protocols.', color: 'text-red-400' },
  ];

  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
            >
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">The Creator AI Mission</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none"
            >
              Redefining <span className="text-primary">Engagement</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto italic font-medium leading-relaxed"
            >
              We are building the future of content creation. Our platform leverages neural orchestration to help creators produce viral results with unprecedented efficiency.
            </motion.p>
          </section>

          {/* Grid Layout */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, idx) => (
              <motion.div 
                key={v.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white/2 border border-white/5 rounded-[3rem] group hover:border-white/10 transition-all shadow-3xl"
              >
                <v.icon size={32} className={`${v.color} mb-6`} />
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-3">{v.label}</h3>
                <p className="text-sm font-bold text-text-muted italic opacity-70 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* Vision Section */}
          <section className="p-12 md:p-20 bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 rounded-[4rem] text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-5 pointer-events-none" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center backdrop-blur-3xl border border-white/10"
            >
              <Target size={32} className="text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Our Master Plan</h2>
            <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto italic font-medium">
              To consolidate the global creator economy under a single intellectual hub, providing every unit with the neural tools they need to achieve maximum throughput and reach.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
