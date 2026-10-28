import React from 'react';
import { motion } from 'framer-motion';
import { StatsContent } from '../../types/blocks';

export const StatsBlock: React.FC<{ content: StatsContent }> = ({ content }) => {
  return (
    <section id="chi-siamo" className="py-20 bg-brand-dark text-white border-y border-white/10 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {content.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white mb-2">
                <span>{stat.value}</span>
                {stat.suffix && <span className="text-brand-terracotta">{stat.suffix}</span>}
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-brand-terracotta">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="text-xs text-gray-400 mt-1">{stat.sublabel}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
