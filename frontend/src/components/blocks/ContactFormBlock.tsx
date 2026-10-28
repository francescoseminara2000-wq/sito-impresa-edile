import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PhoneCall, Clock, ShieldCheck, FileCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CtaFormContent } from '../../types/blocks';
import { QuoteModal } from '../ui/QuoteModal';

export const ContactFormBlock: React.FC<{ content: CtaFormContent }> = ({ content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ascolta l'evento personalizzato 'open-quote-modal' se scatenato da altri pulsanti del sito
  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-quote-modal', handleOpenModal);

    // Controlla se la pagina è stata caricata con hash #preventivo-modal
    if (window.location.hash === '#preventivo-modal') {
      setIsModalOpen(true);
    }

    return () => {
      window.removeEventListener('open-quote-modal', handleOpenModal);
    };
  }, []);

  return (
    <section id="preventivo" className="py-20 sm:py-28 bg-[#0b0f19] text-white relative overflow-hidden scroll-mt-20">
      {/* Sfondo geometrico discreto ed elegante con texture architettonica */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Glow d'atmosfera sottile alle estremità */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-terracotta/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Card Principale Call-to-Action Premium */}
        <div className="relative bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-14 lg:p-16 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Linea luminosa superiore ad accento terracotta */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-terracotta to-transparent opacity-80" />

          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            {/* Tag Kicker Minimalista */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-terracotta/15 border border-brand-terracotta/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta animate-pulse" />
              <span>Sopralluogo Tecnico & Preventivo Gratuito</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight font-display">
              {content.title || 'Diamo Forma al Tuo Progetto'}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {content.subtitle ||
                'Pianifichiamo il tuo cantiere con rigore ingegneristico, computo metrico dettagliato e prezzi bloccati a contratto. Richiedi una stima preliminare in pochi clic.'}
            </p>

            {/* Pulsanti di Azione Diretti */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative group overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-gradient-to-r from-brand-terracotta via-[#b3672d] to-[#9c5724] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-glow-terracotta hover:shadow-2xl transition-all cursor-pointer"
              >
                {/* Animazione Shimmer continua */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[280%] transition-transform duration-1000 ease-out" />
                
                <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform shrink-0" />
                <span className="relative z-10">Compila Richiesta Preventivo</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
              </motion.button>

              <motion.a
                href="tel:+393485696125"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-semibold text-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span>Ufficio Tecnico: <strong className="text-white font-mono font-bold">+39 348 569 6125</strong></span>
              </motion.a>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Nessun impegno d'acquisto • Sopralluogo sul posto sempre gratuito in Lombardia
            </p>
          </div>

          {/* 3 Garanzie Chiave Strutturate in Griglia Pulita */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-brand-terracotta/20 border border-brand-terracotta/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Risposta Entro 24 Ore</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Un tecnico o geometra abilitato analizza i requisiti e ti contatta per concordare l'eventuale visita.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-brand-terracotta/20 border border-brand-terracotta/30 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Computo a Prezzo Bloccato</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Preventivazione dettagliata voce per voce. Prezzo garantito a contratto senza costi imprevisti.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-brand-terracotta/20 border border-brand-terracotta/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Garanzie & Assicurazioni</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Polizza decennale postuma, DURC regolare e maestranze interne regolarmente inquadrate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dedicata con il Configuratore Guidato e il Modulo Rapido */}
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default ContactFormBlock;
