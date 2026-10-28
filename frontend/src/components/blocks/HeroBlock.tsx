import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Hammer, ChevronDown } from 'lucide-react';
import { HeroContent } from '../../types/blocks';
import { CountUp } from '../ui/CountUp';

export const HeroBlock: React.FC<{ content: HeroContent }> = ({ content }) => {
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
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
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-brand-dark text-white pt-24 pb-16">
      {/* Sfondo con Effetto Ken Burns continuo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          className="w-full h-full"
        >
          <img
            src={content.backgroundImage || '/images/cantieri/cantiere-10.jpg'}
            alt="Costruzioni BMG"
            className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-105"
          />
        </motion.div>

        {/* Gradienti di profondità e vignettatura morbida */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full my-auto">
        <div className="max-w-3xl">
          {/* Badge Territoriale Essenziale */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-200 mb-6 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-terracotta shrink-0" />
            <span>{content.badge || 'BMG S.r.l. • Impresa Edile Caponago (MB)'}</span>
          </motion.div>

          {/* Titolo Principale ad Alto Impatto */}
          <motion.div
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden mb-6"
          >
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.06]">
              <span className="block overflow-hidden py-1">
                <motion.span variants={textItemVariants} className="block text-white">
                  {content.title}
                </motion.span>
              </span>
              {content.highlightedWord && (
                <span className="block overflow-hidden py-1 text-transparent bg-clip-text bg-gradient-to-r from-brand-terracotta via-amber-300 to-amber-100">
                  <motion.span variants={textItemVariants} className="block">
                    {content.highlightedWord}
                  </motion.span>
                </span>
              )}
            </h1>
          </motion.div>

          {/* Sottotitolo Diretto & Snellito */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8"
          >
            {content.subtitle}
          </motion.p>

          {/* Call to Action Pulite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <motion.a
              href={content.primaryCtaLink || '#preventivo'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-terracotta to-[#d4894c] text-white font-bold text-sm uppercase tracking-wider shadow-glow-terracotta transition-all hover:brightness-110"
            >
              <span>{content.primaryCtaText || 'Richiedi Preventivo'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.a>

            {content.secondaryCtaText && (
              <motion.a
                href={content.secondaryCtaLink || '#servizi'}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm tracking-wide transition-colors hover:bg-white/20"
              >
                <Hammer className="w-4 h-4 text-amber-300" />
                <span>{content.secondaryCtaText}</span>
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Anteprima Indicatori di Performance Snellita */}
        {content.statsPreview && content.statsPreview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {content.statsPreview.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
                  <CountUp value={item.number} />
                </span>
                <span className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Indicatore Visivo di Scorrimento */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 text-[10px] text-slate-400 uppercase tracking-widest pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-brand-terracotta" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroBlock;
