'use client';

import { UploadCloud, Cpu, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: 1,
    title: 'Upload Media',
    description: 'Upload your image or video securely to our platform.',
    icon: <UploadCloud size={32} />
  },
  {
    num: 2,
    title: 'Choose AI Tool',
    description: 'Select from our wide range of powerful AI transformations.',
    icon: <Cpu size={32} />
  },
  {
    num: 3,
    title: 'Download & Share',
    description: 'Download your viral-ready content instantly.',
    icon: <Download size={32} />
  }
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <section id="how-it-works" className="py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">How It Works</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">A simple 3-step workflow to supercharge your creativity.</p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={stepVariants}
              whileHover={{ y: -5 }}
              className="glass-panel p-10 text-center relative z-10 bg-black/40 border border-white/5 transition-all duration-300"
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)'
                }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary border border-white/10 bg-[#13131A] shadow-xl"
              >
                {step.icon}
              </motion.div>
              <div className="text-sm font-bold text-primary mb-2 tracking-widest uppercase">Step {step.num}</div>
              <h3 className="text-2xl font-bold font-heading mb-4">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
