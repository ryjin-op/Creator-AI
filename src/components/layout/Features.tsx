'use client';

import { Type, Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const tools = [
  {
    title: 'AI Content Writing',
    description: 'Generate trending topic ideas and high-converting scripts for Long/Short videos.',
    icon: <Type size={24} />,
    color: 'var(--primary)',
    dashboardView: 'content'
  },
  {
    title: 'AI SEO & Meta Tools',
    description: 'Generate your video title, description, and tags with AI, optimized for maximum rank.',
    icon: <Search size={24} />,
    color: '#FF4500',
    dashboardView: 'seo'
  }
];

export default function Features() {
  const { user } = useAuth();
  const router = useRouter();

  const handleToolClick = (dashboardView: string) => {
    if (user) {
      router.push(`/dashboard?view=${dashboardView}`);
    } else {
      router.push('/signup');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <section id="tools" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Powerful AI Tools for Creators</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Everything you need to produce viral content 10x faster.</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {tools.map((tool, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                borderColor: tool.color,
                boxShadow: `0 20px 40px -15px rgba(0,0,0,0.5), 0 0 20px -5px ${tool.color}33`
              }}
              className="glass-panel p-8 cursor-pointer flex flex-col gap-4 border border-white/5 transition-all duration-300"
              onClick={() => handleToolClick(tool.dashboardView)}
            >
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
                style={{
                  background: `rgba(${tool.color === 'var(--primary)' ? '138, 43, 226' : '255, 69, 0'}, 0.1)`,
                  color: tool.color
                }}
              >
                {tool.icon}
              </motion.div>
              <h3 className="text-2xl font-bold font-heading">{tool.title}</h3>
              <p className="text-text-muted flex-1 leading-relaxed">{tool.description}</p>
              
              <motion.button 
                whileHover={{ x: 5 }}
                className="mt-4 flex items-center gap-2 font-bold text-sm tracking-wide uppercase transition-all"
                style={{ color: tool.color }}
              >
                {user ? 'Open Tool' : 'Try Tool'} <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
