import React from 'react';
import { motion } from 'framer-motion';
import { StatsContent } from '../../types/blocks';
import { CountUp } from '../ui/CountUp';
import { Building2, ShieldCheck, KeyRound, Clock, Sparkles } from 'lucide-react';

export const StatsBlock: React.FC<{ content: StatsContent }> = ({ content }) => {
  const statIcons = [Building2, ShieldCheck, KeyRound, Clock];

  return (
    <section id="chi-siamo" className="py-24 bg-gradient-to-b from-[#0b0f19] to-brand-dark text-white border-y border-white/10 relative overflow-hidden scroll-mt-20">
      {/* Texture e bagliori luminosi ambientali */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-terracotta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Intestazione Sezione */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Chi Siamo • I Nostri Standard di Cantiere</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Soluzioni Edili Certificate, Senza Compromessi
          </h2>
        </div>

        {/* Griglia Metriche di Pregio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.stats.map((stat, idx) => {
            const Icon = statIcons[idx % statIcons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 relative group"
              >
                {/* Icona Identificativa */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-terracotta/20 to-amber-500/10 border border-brand-terracotta/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 group-hover:border-brand-terracotta/60 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Valore / Statistica */}
                <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-1.5">
                  <CountUp value={stat.value} />
                  {stat.suffix && <span className="text-brand-terracotta ml-0.5">{stat.suffix}</span>}
                </div>

                {/* Titolo Metrica */}
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 mb-1.5">
                  {stat.label}
                </div>

                {/* Descrizione Sottotitolo */}
                {stat.sublabel && (
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {stat.sublabel}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsBlock;
