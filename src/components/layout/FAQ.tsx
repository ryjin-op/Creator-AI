'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { question: "What AI tools are included?", answer: "CreatorAI includes the Thumbnail Generator, AI Face Sawp, Image-to-Video Generator, AI Image Enhancer, AI Background Remover, and Caption Generator." },
  { question: "Can I use it for YouTube thumbnails?", answer: "Yes! Our Thumbnail Generator is specifically trained to create high-CTR, vibrant YouTube thumbnails optimized for all devices." },
  { question: "Do you support commercial usage?", answer: "Yes, all exports on the Creator and Pro plans come with full commercial usage rights for YouTube, social media, and ad campaigns." },
  { question: "Can I cancel subscription anytime?", answer: "Absolutely. You can cancel your subscription at any time from your billing dashboard with zero hidden fees." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section className="py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold font-heading text-center mb-16"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-4"
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className={`glass-panel p-6 cursor-pointer border transition-all duration-300 ${
                openIndex === index 
                  ? 'border-primary bg-primary/5 shadow-2xl' 
                  : 'border-white/5 bg-white/2'
              }`} 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className={`text-lg font-bold font-heading transition-colors ${openIndex === index ? 'text-white' : 'text-text-muted hover:text-white'}`}>{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className={openIndex === index ? 'text-primary' : 'text-text-muted'} />
                </motion.div>
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden text-text-muted text-sm leading-relaxed antialiased"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
