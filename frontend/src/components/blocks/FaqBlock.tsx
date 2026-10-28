import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { FaqContent } from '../../types/blocks';

export const FaqBlock: React.FC<{ content: FaqContent }> = ({ content }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const defaultItems = [
    {
      question: 'Come si richiede un sopralluogo e quanto costa?',
      answer: 'Il sopralluogo tecnico effettuato da BMG S.r.l. è completamente gratuito e senza impegno su tutto il territorio di Caponago, Monza Brianza, Milano e comuni limitrofi. Durante la visita rileviamo le misure, valutiamo lo stato di fatto e ti forniamo un computo metrico dettagliato entro 48 ore.',
    },
    {
      question: 'I prezzi indicati nel preventivo sono bloccati o possono aumentare in corso d\'opera?',
      answer: 'I prezzi concordati a contratto sono rigorosamente fissi e bloccati. Qualora il committente desideri modifiche o lavorazioni extra durante il cantiere, ogni eventuale variazione viene sempre quantificata, spiegata e approvata per iscritto prima di essere eseguita.',
    },
    {
      question: 'Gestite anche le pratiche edilizie (CILA, SCIA, sicurezza D.Lgs 81/08)?',
      answer: 'Sì, offriamo un servizio chiavi in mano completo: il nostro ufficio tecnico si occupa di tutte le comunicazioni agli enti comunali (CILA, SCIA, permessi di costruire), stesura del Piano Operativo di Sicurezza (POS) e verifica del DURC in regola al 100%.',
    },
    {
      question: 'Quali garanzie e certificazioni vengono rilasciate a fine cantiere?',
      answer: 'A consegna avvenuta rilasciamo le dichiarazioni di conformità degli impianti a regola d\'arte (DM 37/08 per idraulico, riscaldamento ed elettrico), i certificati dei materiali posati e la garanzia decennale sulle opere strutturali.',
    },
  ];

  const items = content.items && content.items.length > 0 ? content.items : defaultItems;

  return (
    <section className="py-24 bg-brand-surface text-brand-dark border-t border-brand-stone/60">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Intestazione */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-stone/60 text-brand-terracotta text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{content.tagline || 'Chiarezza & Garanzie di Cantiere'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark">
            {content.title || 'Domande Frequenti su Preventivi e Lavori'}
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
            Tutto quello che c'è da sapere prima di iniziare una nuova costruzione o ristrutturazione con BMG S.r.l.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const indexStr = (idx + 1).toString().padStart(2, '0');

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-brand-terracotta/60 shadow-md ring-1 ring-brand-terracotta/20'
                    : 'border-brand-stone/60 hover:border-gray-300 shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-base text-brand-dark hover:text-brand-terracotta transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-xs font-mono font-bold text-brand-terracotta bg-brand-surface px-2 py-1 rounded-md">
                      {indexStr}
                    </span>
                    <span className="text-sm sm:text-base">{item.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-terracotta transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100/80">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Banner Diretto Helpliner FAQ */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div>
            <h4 className="text-base font-bold text-white mb-1">
              Hai una domanda specifica sul tuo cantiere o immobile?
            </h4>
            <p className="text-xs text-slate-300">
              Parla subito con il nostro direttore lavori per una consulenza rapida e senza impegno.
            </p>
          </div>

          <a
            href="tel:+393485696125"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-glow-terracotta transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Chiama Ora (+39 348 569 6125)</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqBlock;
