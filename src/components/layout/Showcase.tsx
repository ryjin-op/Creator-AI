'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const showcaseItems = [
  { img: '/showcase_thumbnail.png', tag: 'AI Thumbnail' },
  { img: '/showcase_video.png', tag: 'Image to Video' },
  { img: '/showcase_faceswap.png', tag: 'Face Swap' },
  { img: '/showcase_enhancement.png', tag: 'AI Enhancement' },
];

export default function Showcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <section id="showcase" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">See What Creators Are Making</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto mb-8">Join thousands of creators generating viral content every day.</p>
          <div className="text-center">
            <span className="text-gradient font-bold text-sm tracking-widest uppercase opacity-60">Coming Soon</span>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {showcaseItems.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-panel relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-white/5 shadow-2xl transition-all group"
            >
              {/* Using a placeholder-like image if real ones are missing, but aiming for compatibility */}
              <div className="w-full h-full bg-white/5 relative">
                <img 
                  src={item.img} 
                  alt={item.tag} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 z-10 transition-transform group-hover:scale-110">
                {item.tag}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
