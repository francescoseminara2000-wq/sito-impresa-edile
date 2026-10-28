import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { BeforeAfterContent } from '../../types/blocks';
import { CheckCircle2, Sparkles, Building, Home, Layers } from 'lucide-react';

interface Scenario {
  id: string;
  category: string;
  tabLabel: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  details: { label: string; value: string }[];
}

export const BeforeAfterBlock: React.FC<{ content?: BeforeAfterContent }> = ({ content }) => {
  // Scenari di confronto cantiere per BMG Srl
  const scenarios: Scenario[] = [
    {
      id: 'interni',
      category: 'Ristrutturazione & Interni',
      tabLabel: '1. Ristrutturazione Appartamento',
      icon: Home,
      title: 'Ristrutturazione Completa & Open-Space',
      subtitle: 'Dalla demolizione totale e macerie alla consegna chiavi in mano con finiture di alto livello.',
      description:
        'Intervento integrale di redistribuzione spaziale: demolizione tramezzature, realizzazione massetto alleggerito, rifacimento impianti idro-termo-sanitari certificati, controsoffitti in cartongesso con gole di luce LED e parquet levigato.',
      beforeImage: '/images/cantieri/cantiere-04.jpg',
      afterImage: '/images/cantieri/cantiere-06.jpg',
      beforeLabel: 'Cantiere & Demolizioni',
      afterLabel: 'Consegna Finita',
      details: [
        { label: 'Superficie d\'Intervento', value: '140 mq Residenziale' },
        { label: 'Impianti Eseguiti', value: 'Elettrico & Idraulico DM 37/08' },
        { label: 'Opere Architettoniche', value: 'Cartongesso a luce continua & Parquet' },
        { label: 'Tempi di Realizzazione', value: '65 Giorni Lavorativi (a contratto)' },
      ],
    },
    {
      id: 'cappotto',
      category: 'Facciate & Risparmio Energetico',
      tabLabel: '2. Cappotto & Facciata Condominiale',
      icon: Layers,
      title: 'Isolamento Termico a Cappotto & Risanamento Facciata',
      subtitle: 'Riqualificazione termica ed estetica esterna con eliminazione completa dei ponti termici.',
      description:
        'Applicazione cappotto termico con pannelli EPS con grafite ad alta densità (certificati CAM), doppia rasatura armata con rete in fibra di vetro antifessurazione e finitura silossanica idrorepellente autopulente.',
      beforeImage: '/images/cantieri/cantiere-11.jpg',
      afterImage: '/images/cantieri/cantiere-12.jpg',
      beforeLabel: 'Facciata Pre-Intervento',
      afterLabel: 'Cappotto Termico Finito',
      details: [
        { label: 'Estensione Facciata', value: '680 mq di Superficie' },
        { label: 'Tecnologia Isolante', value: 'Pannelli EPS Grafite 12cm CAM' },
        { label: 'Finitura Protettiva', value: 'Intonachino Silossanico Antimuffa' },
        { label: 'Salto di Classe Energetica', value: 'Da Classe E a Classe B certificata' },
      ],
    },
    {
      id: 'strutture',
      category: 'Costruzioni & Cemento Armato',
      tabLabel: '3. Opere Strutturali & Fondazioni',
      icon: Building,
      title: 'Nuova Costruzione Strutturale in Cemento Armato',
      subtitle: 'Dalla movimentazione terra e gettata di platea alle strutture portanti e solai antisismici.',
      description:
        'Esecuzione completa di carpenteria, posa armature in ferro B450C certificato di stabilimento, gettate di fondazione a platea continua e pilastri portanti per edificio residenziale con collaudo statico.',
      beforeImage: '/images/cantieri/cantiere-01.jpg',
      afterImage: '/images/cantieri/cantiere-10.jpg',
      beforeLabel: 'Scavi & Posa Fondazioni',
      afterLabel: 'Struttura C.A. Completata',
      details: [
        { label: 'Tipologia Strutturale', value: 'Cemento Armato Antisismico' },
        { label: 'Materiali Impiegati', value: 'Calcestruzzo Rck 30 e Ferro B450C' },
        { label: 'Conformità Tecnica', value: 'NTC 2018 con Collaudo Statico' },
        { label: 'Direzione Lavori', value: 'Ingegneria e Ufficio Tecnico BMG' },
      ],
    },
  ];

  const [activeScenarioId, setActiveScenarioId] = useState<string>('interni');
  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <section className="py-24 bg-white text-brand-dark overflow-hidden border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intestazione Sezione */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-stone/60 text-brand-terracotta text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prima & Dopo • Trasformazioni Reali di Cantiere</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-brand-dark">
            Guarda la Trasformazione dei Nostri Lavori
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Seleziona la tipologia di cantiere e fai scorrere il cursore orizzontale per confrontare lo stato iniziale dei lavori con il risultato finale consegnato a regola d'arte.
          </p>
        </div>

        {/* Tab di Selezione Scenari Interattivi */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = scenario.id === activeScenarioId;
            return (
              <button
                key={scenario.id}
                onClick={() => setActiveScenarioId(scenario.id)}
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm ${
                  isActive
                    ? 'bg-[#0f172a] text-white shadow-lg ring-2 ring-brand-terracotta/40 scale-105'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-500'}`} />
                <span>{scenario.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Contenuto Dinamico dello Scenario Selezionato */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Colonna Testuale & Specifiche Tecniche */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-brand-terracotta mb-2 block">
                  {currentScenario.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark mb-3">
                  {currentScenario.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {currentScenario.subtitle}
                </p>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  "{currentScenario.description}"
                </p>
              </div>

              {/* Checklist Specifiche Tecniche */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentScenario.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {detail.label}
                      </span>
                      <span className="text-xs font-bold text-brand-dark leading-tight block">
                        {detail.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href="#preventivo"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-terracotta hover:text-[#a85e2b] transition-colors"
                >
                  <span>Vuoi un risultato simile per il tuo immobile? Richiedi sopralluogo →</span>
                </a>
              </div>
            </div>

            {/* Colonna Slider Before & After Interattivo */}
            <div className="lg:col-span-7">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl border border-slate-700/60">
                <BeforeAfterSlider
                  beforeImage={currentScenario.beforeImage}
                  afterImage={currentScenario.afterImage}
                  beforeLabel={currentScenario.beforeLabel}
                  afterLabel={currentScenario.afterLabel}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2 font-medium">
                <span>◀</span> Trascina il cursore al centro per confrontare prima e dopo <span>▶</span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BeforeAfterBlock;
