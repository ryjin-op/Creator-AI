'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "CreatorAI saved me 15 hours a week on thumbnail design alone. The Face Swap tool is incredibly accurate.",
    name: "Alex Johnson",
    role: "YouTuber (1.2M Subs)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
  },
  {
    quote: "The image-to-video generator completely transformed our marketing campaigns. It feels like magic.",
    name: "Sarah Chen",
    role: "Social Media Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
  },
  {
    quote: "As an indie creator, this platform is my entire production team combined into one simple interface.",
    name: "Marcus Williams",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
  }
];

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <section className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">Loved by Creators</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Don&apos;t just take our word for it.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((test, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -10, borderColor: 'var(--primary)' }}
              className="glass-panel p-10 flex flex-col border border-white/5 shadow-2xl transition-all duration-300 relative group"
            >
              <div className="text-primary text-5xl font-serif mb-6 leading-none opacity-40 group-hover:opacity-100 transition-opacity duration-300">&ldquo;</div>
              <p className="text-lg mb-10 italic leading-relaxed text-[#e2e8f0] flex-1">
                {test.quote}
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#13131A] shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-transform group-hover:scale-110"
                />
                <div>
                  <div className="font-bold text-white group-hover:text-primary transition-colors">{test.name}</div>
                  <div className="text-text-muted text-sm">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
