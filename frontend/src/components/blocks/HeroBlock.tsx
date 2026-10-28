import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Hammer, ChevronDown, Sparkles } from 'lucide-react';
import { HeroContent } from '../../types/blocks';
import { CountUp } from '../ui/CountUp';

export const HeroBlock: React.FC<{ content: HeroContent }> = ({ content }) => {
  // Varianti per animazione testo con reveal progressivo
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const textItemVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-[94vh] flex flex-col justify-center overflow-hidden bg-brand-dark text-white pt-24 pb-14">
      {/* Sfondo Fotografico con Effetto Ken Burns fluido e continuo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.14 }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          className="w-full h-full"
        >
          <img
            src={content.backgroundImage || '/images/cantieri/cantiere-10.jpg'}
            alt="Costruzioni BMG"
            className="w-full h-full object-cover opacity-30 filter brightness-95 contrast-105"
          />
        </motion.div>

        {/* Reticolo Architettonico Geometrico d'Atmosfera */}
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* Luci e Bagliori Radiali Ambientali Caldi */}
        <motion.div
          animate={{
            opacity: [0.15, 0.28, 0.15],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-brand-terracotta/25 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.22, 0.1],
            scale: [1.05, 1, 1.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px]"
        />

        {/* Gradienti di Profondità & Vignettatura Morbida */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/75 to-brand-dark/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full my-auto">
        <div className="max-w-3xl">
          {/* Badge Territoriale con Micro-bagliore Animato */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-semibold text-amber-200 mb-6 shadow-sm hover:border-brand-terracotta/40 transition-colors group cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <ShieldCheck className="w-4 h-4 text-brand-terracotta shrink-0 group-hover:scale-110 transition-transform" />
            <span>{content.badge || 'BMG S.r.l. • Impresa Edile Caponago (MB)'}</span>
          </motion.div>

          {/* Titolo Principale ad Altissimo Impatto Tipografico */}
          <motion.div
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            className="overflow-hidden mb-6"
          >
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] font-display">
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

          {/* Sottotitolo Fluido e Chiaro */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-9"
          >
            {content.subtitle}
          </motion.p>

          {/* Pulsanti Call to Action con Micro-Interazioni di Pregio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <motion.a
              href={content.primaryCtaLink || '#preventivo'}
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(194,120,59,0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-terracotta via-[#b3672d] to-[#9c5724] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-glow-terracotta transition-all"
            >
              {/* Shimmer di luce animato al passaggio del mouse */}
              <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[280%] transition-transform duration-1000 ease-out" />
              
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform duration-300 shrink-0" />
              <span className="relative z-10">{content.primaryCtaText || 'Richiedi Preventivo'}</span>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </motion.a>

            {content.secondaryCtaText && (
              <motion.a
                href={content.secondaryCtaLink || '#servizi'}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.16)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/20 text-white font-semibold text-sm sm:text-base tracking-wide transition-all hover:border-white/35 group"
              >
                <Hammer className="w-4 h-4 text-amber-300 group-hover:rotate-[-15deg] transition-transform duration-300" />
                <span>{content.secondaryCtaText}</span>
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Barra Metriche di Performance Elegante e Sospesa */}
        {content.statsPreview && content.statsPreview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-14 p-6 sm:p-7 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden"
          >
            {/* Sottile riflesso orizzontale in testata */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {content.statsPreview.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col group transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-display group-hover:text-amber-300 transition-colors">
                  <CountUp value={item.number} />
                </span>
                <span className="text-xs sm:text-sm text-slate-400 mt-1 font-medium leading-snug">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Indicatore Visivo di Scorrimento Morbido */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 text-[10px] text-slate-400 uppercase tracking-widest pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-brand-terracotta" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroBlock;
