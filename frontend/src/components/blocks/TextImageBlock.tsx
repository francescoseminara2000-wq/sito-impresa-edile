import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';

export interface TextImageContent {
  tagline?: string;
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
  imageUrl: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaLink?: string;
}

export const TextImageBlock: React.FC<{ content: TextImageContent }> = ({ content }) => {
  const isImageLeft = content.imagePosition === 'left';

  return (
    <section className="py-24 bg-white text-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Colonna Testo */}
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-6 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {content.tagline && (
              <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 block">
                {content.tagline}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-brand-dark">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="text-base font-semibold text-gray-700 mb-4">
                {content.subtitle}
              </p>
            )}
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
              {content.description}
            </p>

            {content.bullets && content.bullets.length > 0 && (
              <ul className="space-y-2.5 mb-8">
                {content.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 text-brand-terracotta flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {content.ctaText && (
              <a
                href={content.ctaLink || '#preventivo'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-terracotta text-white font-bold text-xs uppercase tracking-wider hover:bg-[#a85e2b] transition-all shadow-glow-terracotta"
              >
                <span>{content.ctaText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </motion.div>

          {/* Colonna Immagine */}
          <motion.div
            initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-6 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-soft-elevation border border-gray-100 aspect-[4/3] bg-gray-100">
              <img
                src={content.imageUrl || '/images/cantieri/cantiere-06.jpg'}
                alt={content.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
