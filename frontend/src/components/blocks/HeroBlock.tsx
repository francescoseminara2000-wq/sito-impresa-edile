import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Hammer, Phone, MapPin, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
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
    <section className="relative min-h-[94vh] flex flex-col justify-center overflow-hidden bg-brand-dark text-white pt-28 pb-16">
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
            alt="Architettura ed Edilizia di Pregio"
            className="w-full h-full object-cover opacity-30 filter brightness-90 contrast-105"
          />
        </motion.div>

        {/* Gradienti di profondità e vignettatura morbida */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-brand-dark/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Colonna Sinistra: Headline & CTA Principali */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Badge di Certificazione & Territorio */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-semibold text-amber-200 mb-6 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-brand-terracotta shrink-0" />
              <span>{content.badge || 'BMG S.r.l. • Impresa Edile Caponago (MB)'}</span>
            </motion.div>

            {/* Titolo Principale con Reveal Mascherato */}
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

            {/* Sottotitolo descrittivo ad alta leggibilità */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8"
            >
              {content.subtitle}
            </motion.p>

            {/* 3 Checkmark di Fiducia & Garanzia */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-300 font-medium mb-10"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sopralluogo e Computo Metrico Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prezzi Bloccati a Contratto</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unico Referente Tecnico per Tutto</span>
              </div>
            </motion.div>

            {/* Pulsanti Call To Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <motion.a
                href={content.primaryCtaLink || '#preventivo'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-terracotta to-[#d4894c] text-white font-bold text-sm sm:text-base uppercase tracking-wider shadow-glow-terracotta transition-all hover:brightness-110"
              >
                <span>{content.primaryCtaText || 'Richiedi Preventivo Gratuito'}</span>
                <ArrowUpRight className="w-5 h-5" />
              </motion.a>

              {content.secondaryCtaText && (
                <motion.a
                  href={content.secondaryCtaLink || '#servizi'}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm sm:text-base tracking-wide transition-colors hover:bg-white/20"
                >
                  <Hammer className="w-4 h-4 text-amber-300" />
                  <span>{content.secondaryCtaText}</span>
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Colonna Destra: Scheda Flottante di Affidabilità Aziendale (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.4 }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Bagliore d'atmosfera interno */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-terracotta/15 rounded-full blur-2xl pointer-events-none" />

              {/* Stato di Disponibilità Cantieri con Aura Verde */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Disponibili per Nuovi Cantieri
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">2026/Q4</span>
              </div>

              {/* Recapiti Rapidi e Ufficio Tecnico */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Linea Diretta Sopralluoghi
                </span>
                <a
                  href="tel:+393485696125"
                  className="flex items-center gap-3 text-2xl font-extrabold text-white hover:text-amber-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-terracotta/20 border border-brand-terracotta/40 flex items-center justify-center text-brand-terracotta shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>+39 348 569 6125</span>
                </a>
              </div>

              {/* Riferimento Territoriale */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <MapPin className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-snug">
                  <strong className="text-white block font-semibold">Sede Operativa: Caponago (MB)</strong>
                  Interventi in tutta la provincia di Monza Brianza, Milano e territorio lombardo.
                </div>
              </div>

              {/* Garanzia Decennale & Conformità */}
              <div className="pt-1 flex items-center gap-2.5 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Garanzia Decennale Postuma & DURC Costantemente Aggiornato</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Anteprima Indicatori di Performance */}
        {content.statsPreview && content.statsPreview.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6"
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

      {/* Indicatore Visivo di Scorrimento in Basso */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[10px] text-slate-400 uppercase tracking-widest pointer-events-none"
      >
        <span>Esplora</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-brand-terracotta" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroBlock;
