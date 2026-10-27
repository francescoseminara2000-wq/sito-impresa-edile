import React from 'react';
import { motion } from 'framer-motion';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { BeforeAfterContent } from '../../types/blocks';
import { CheckCircle2 } from 'lucide-react';

export const BeforeAfterBlock: React.FC<{ content: BeforeAfterContent }> = ({ content }) => {
  return (
    <section className="py-24 bg-white text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Colonna Testuale / Specifiche Tecniche */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-3 block">
              Trasformazione & Restauro
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                {content.subtitle}
              </p>
            )}

            {content.description && (
              <div className="p-5 bg-brand-surface rounded-xl border border-brand-stone/60 mb-8">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{content.description}"
                </p>
              </div>
            )}

            {content.details && content.details.length > 0 && (
              <div className="space-y-3">
                {content.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                        {detail.label}
                      </span>
                      <span className="text-sm font-semibold text-brand-dark">
                        {detail.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Colonna Slider Before & After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <BeforeAfterSlider
              beforeImage={content.beforeImage}
              afterImage={content.afterImage}
              beforeLabel={content.beforeLabel}
              afterLabel={content.afterLabel}
            />
            <p className="text-center text-xs text-gray-500 mt-4">
              ← Trascina il cursore orizzontale per confrontare il cantiere prima e dopo i lavori →
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
