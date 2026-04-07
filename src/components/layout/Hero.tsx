'use client';

import { Play, Sparkles, Type, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const previewVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 20, delay: 0.8 }
    }
  };

  return (
    <section className="relative overflow-hidden pt-[160px] pb-[100px]">
      <motion.div 
        className="max-w-7xl mx-auto px-6 text-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-secondary mb-6 text-sm font-medium"
        >
          <Sparkles size={16} />
          <span>CreatorAI v2.0 is now live</span>
        </motion.div>

        {/* Headlines */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold font-heading mb-6 max-w-4xl mx-auto leading-[1.1]"
        >
          Create Viral Content with <span className="text-gradient">AI</span> in Seconds
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Generate trending topics, viral scripts, and automate your YouTube SEO with powerful AI tools designed for modern creators.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link href="/signup" className="btn btn-primary w-full px-8 py-4 text-lg">
              Start Creating Free
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link href="#how-it-works" className="btn btn-outline w-full px-8 py-4 text-lg flex items-center justify-center gap-2">
              <Play size={20} /> Watch Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D UI Preview */}
        <motion.div 
          variants={previewVariants}
          className="relative max-w-5xl mx-auto"
        >
          <style dangerouslySetInnerHTML={{
            __html: `
            .animate-progress-viral { width: 0%; animation: loadViral 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 0.5s; }
            .animate-progress-seo { width: 0%; animation: loadSeo 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 0.8s; }
            @keyframes loadViral { to { width: 98%; } }
            @keyframes loadSeo { to { width: 92%; } }
            .animate-tag { opacity: 0; transform: translateY(10px); animation: popIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            @keyframes popIn { to { opacity: 1; transform: translateY(0); } }
            .typing-cursor { animation: blink 1s step-end infinite; }
            @keyframes blink { 50% { opacity: 0; } }
            .fade-in-text { opacity: 0; animation: fadeIn 0.5s ease-out forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
          `}} />

          <div className="glass-panel border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8),0_0_40px_rgba(138,43,226,0.15)] relative overflow-hidden flex flex-col text-left h-[500px] bg-[#0a0a0c] rounded-3xl">
            {/* Mock Window Top Bar */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="text-xs text-text-muted font-bold flex items-center gap-2">
                <Sparkles size={14} className="text-secondary" /> Project: 10 AI Tools (Viral Script)
              </div>
              <div className="w-16"></div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="hidden md:block w-[280px] border-r border-white/5 p-6 bg-black/30 relative">
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Viral Prediction</span>
                    <span className="fade-in-text text-xs font-bold text-[#00FA9A]" style={{ animationDelay: '1s' }}>98%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="animate-progress-viral h-full bg-[#00FA9A] rounded-full shadow-[0_0_10px_#00FA9A]"></div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">SEO Optimization</span>
                    <span className="fade-in-text text-xs font-bold text-secondary" style={{ animationDelay: '1.2s' }}>Excellent</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="animate-progress-seo h-full bg-secondary rounded-full shadow-[0_0_10px_var(--secondary)]"></div>
                  </div>
                </div>

                <div className="fade-in-text text-xs font-bold text-text-muted mb-4" style={{ animationDelay: '1.5s' }}>Auto-Generated Tags</div>
                <div className="flex flex-wrap gap-2">
                  {['#AI', '#Tech2026', '#Productivity', '#ChatGPT', '#Future'].map((tag, i) => (
                    <span key={i} className="animate-tag px-3 py-1 bg-primary/15 text-white rounded-lg text-[10px] font-bold border border-primary/30" style={{ animationDelay: `${1.8 + (i * 0.15)}s` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 p-8 relative overflow-y-auto font-mono text-sm leading-relaxed text-[#e2e8f0]">
                <div className="fade-in-text" style={{ animationDelay: '2.5s' }}>
                  <span className="text-secondary font-bold">[HOOK] </span>
                  Stop scrolling! If you aren&apos;t using these 10 AI tools right now, you are falling way behind in 2026.
                </div>
                <br />
                <div className="fade-in-text" style={{ animationDelay: '3.2s' }}>
                  <span className="text-primary font-bold">[INTRO] </span>
                  Welcome back to the channel. Today we&apos;re diving into the absolute best platforms that are completely changing how we work.
                </div>
                <br />
                <div className="fade-in-text" style={{ animationDelay: '4s' }}>
                  <span className="text-[#00FA9A] font-bold">[BODY] </span>
                  Let&apos;s start with Tool #1... <span className="typing-cursor bg-primary w-2 h-4 inline-block align-middle"></span>
                </div>

                {/* Ambient glow */}
                <div className="absolute right-[-150px] bottom-[-150px] w-[400px] h-[400px] bg-primary blur-[150px] opacity-15 pointer-events-none rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Floating UI cards */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:flex glass-panel !bg-[#13131A]/80 absolute top-[-30px] left-[-40px] p-4 items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-main flex items-center justify-center">
              <Type size={20} color="#fff" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">Script Generated</div>
              <div className="text-xs text-text-muted">Optimized for Shorts</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden md:flex glass-panel !bg-[#13131A]/80 absolute bottom-20 right-[-50px] p-4 items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Search size={20} color="#fff" />
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">SEO Pack Ready</div>
              <div className="text-xs text-text-muted">Ranked #1 for &quot;AI Tools&quot;</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
