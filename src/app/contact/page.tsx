'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="relative min-h-screen bg-[#0B0B0F]">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <section className="text-center space-y-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
            >
              <Mail size={16} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Communication Uplink</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none"
            >
              Connect with <span className="text-primary">Command</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-text-muted max-w-xl mx-auto italic font-medium"
            >
              Have a mission proposal or need technical support? Send a signal to the neural core.
            </motion.p>
          </section>

          {/* Contact Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="p-10 bg-white/2 border border-white/5 rounded-[3rem] space-y-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Support Terminal</h3>
                <p className="text-sm font-bold text-text-muted italic opacity-70">
                  Our neural agents are standing by to assist with any system issues or resource allocation queries.
                </p>
                <div className="space-y-3 font-mono text-xs text-primary font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Uptime: 24/7/365
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Response latency: &lt; 2ms
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-8 bg-white/2 border border-white/5 rounded-3xl text-center flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">Status</span>
                  <span className="text-xs font-black text-green-400 uppercase tracking-tighter">Fully Operational</span>
                </div>
                <div className="p-8 bg-white/2 border border-white/5 rounded-3xl text-center flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">Region</span>
                  <span className="text-xs font-black text-white uppercase tracking-tighter">Global Hub</span>
                </div>
              </div>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-10 bg-[#121214] border border-white/5 rounded-[3.5rem] relative overflow-hidden group shadow-3xl"
            >
              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 z-20 bg-[#121214]/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 space-y-4"
                  >
                    <CheckCircle2 size={64} className="text-green-400" />
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Signal Recieved</h2>
                    <p className="text-sm font-bold text-text-muted italic">Processing your request into the queue. Commander will respond shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2 mb-2 block leading-none">Identification Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full p-6 bg-white/2 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2 mb-2 block leading-none">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full p-6 bg-white/2 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2 mb-2 block leading-none">Your Mission Signal</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Type your message here..."
                    className="w-full p-6 bg-white/2 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full p-6 bg-gradient-main rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.5em] text-white shadow-glow-primary shadow-primary/10 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Send size={18} /> Transmit Signal
                </button>
              </div>
            </motion.form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
