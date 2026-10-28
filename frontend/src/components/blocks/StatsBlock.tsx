import React from 'react';
import { motion } from 'framer-motion';
import { StatsContent } from '../../types/blocks';
import { CountUp } from '../ui/CountUp';

export const StatsBlock: React.FC<{ content: StatsContent }> = ({ content }) => {
  return (
    <section id="chi-siamo" className="py-20 bg-brand-dark text-white border-y border-white/10 relative overflow-hidden scroll-mt-20">
      {/* Texture e bagliori luminosi ambientali */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {content.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center group p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
            >
              <div className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white mb-2 transition-transform duration-300 group-hover:scale-105">
                <CountUp value={stat.value} />
                {stat.suffix && <span className="text-brand-terracotta ml-0.5">{stat.suffix}</span>}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-brand-terracotta group-hover:text-amber-400 transition-colors">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="text-xs text-gray-400 mt-1 max-w-[200px] leading-relaxed">{stat.sublabel}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
