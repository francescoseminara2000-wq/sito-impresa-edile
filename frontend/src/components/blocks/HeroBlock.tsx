import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Hammer } from 'lucide-react';
import { HeroContent } from '../../types/blocks';

export const HeroBlock: React.FC<{ content: HeroContent }> = ({ content }) => {
  // Varianti per animazione a comparsa mascherata (mask/reveal)
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textItemVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-brand-dark text-white pt-24 pb-16">
      {/* Sfondo con Effetto Ken Burns continuo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.12 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          className="w-full h-full"
        >
          <img
            src={content.backgroundImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80'}
            alt="Architettura ed Edilizia di Pregio"
            className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-105"
          />
        </motion.div>
        
        {/* Gradienti di profondità e vignettatura */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-transparent to-brand-dark/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Badge di Certificazione / Categoria */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sm font-medium text-amber-200 mb-8"
          >
            <ShieldCheck className="w-4 h-4 text-brand-terracotta" />
            <span>{content.badge || 'Impresa Edile d\'Eccellenza • Garanzia Decennale'}</span>
          </motion.div>

          {/* Titolo Principale con Reveal Mascherato */}
          <motion.div
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden mb-6"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
              <span className="block overflow-hidden py-1">
                <motion.span variants={textItemVariants} className="block">
                  {content.title}
                </motion.span>
              </span>
              {content.highlightedWord && (
                <span className="block overflow-hidden py-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-terracotta to-amber-200">
                  <motion.span variants={textItemVariants} className="block">
                    {content.highlightedWord}
                  </motion.span>
                </span>
              )}
            </h1>
          </motion.div>

          {/* Sottotitolo descrittivo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-brand-subtle max-w-2xl font-normal leading-relaxed mb-10"
          >
            {content.subtitle}
          </motion.p>

          {/* Call to Actions con Micro-interazioni */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
          >
            <motion.a
              href={content.primaryCtaLink || '#preventivo'}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px -10px rgba(194, 120, 59, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-terracotta text-white font-semibold text-base transition-colors hover:bg-[#a85e2b]"
            >
              <span>{content.primaryCtaText || 'Richiedi Sopralluogo Gratuito'}</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>

            {content.secondaryCtaText && (
              <motion.a
                href={content.secondaryCtaLink || '#cantieri'}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base transition-colors"
              >
                <Hammer className="w-4 h-4 text-brand-terracotta" />
                <span>{content.secondaryCtaText}</span>
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Anteprima Numeri / Indicatori di Performance */}
        {content.statsPreview && content.statsPreview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {content.statsPreview.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
                  {item.number}
                </span>
                <span className="text-xs sm:text-sm text-brand-subtle mt-1 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
