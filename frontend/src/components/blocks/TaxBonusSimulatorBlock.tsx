import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Calculator, FileCheck, ArrowRight, ShieldCheck, Euro, Clock, Sparkles } from 'lucide-react';

interface BonusOption {
  id: string;
  name: string;
  percentage: number;
  maxCap: number;
  badge: string;
  description: string;
  includedServices: string[];
}

export const TaxBonusSimulatorBlock: React.FC<{ content?: any }> = () => {
  const bonusOptions: BonusOption[] = [
    {
      id: 'bonus-casa',
      name: 'Bonus Ristrutturazioni Casa',
      percentage: 50,
      maxCap: 96000,
      badge: 'Detrazione 50% IRPEF',
      description: 'Per interventi di manutenzione straordinaria, restauro, risanamento conservativo e ristrutturazione edilizia su appartamenti e ville.',
      includedServices: [
        'Rifacimento completo impianti idrici ed elettrici',
        'Demolizioni, tramezzature e ridistribuzione spazi',
        'Sostituzione pavimenti, rivestimenti e sanitari',
        'Opere in cartongesso, isolamento interno e finiture',
      ],
    },
    {
      id: 'ecobonus',
      name: 'Ecobonus Risparmio Energetico',
      percentage: 65,
      maxCap: 100000,
      badge: 'Detrazione 65% IRPEF',
      description: 'Per interventi ad alta efficienza energetica: isolamento a cappotto termico esterno, coibentazione coperture e sostituzione infissi termoisolanti.',
      includedServices: [
        'Cappotto termico certificato con pannelli CAM',
        'Isolamento e impermeabilizzazione tetti e solai',
        'Sostituzione serramenti con certificazione energetica',
        'Trasmissione asseverazione tecnica ENEA inclusa',
      ],
    },
    {
      id: 'condomini',
      name: 'Manutenzione Condomini & Facciate',
      percentage: 50,
      maxCap: 96000,
      badge: 'Detrazione 50% Parti Comuni',
      description: 'Per interventi sulle parti comuni condominiali: ripristino intonaci esterni, rifacimento balconi, frontalini e impermeabilizzazioni.',
      includedServices: [
        'Risanamento calcestruzzo ammalorato e frontalini',
        'Rifacimento pavimentazioni terrazzi e coperture',
        'Impalcature e sicurezza di cantiere a norma',
        'Gestione e supporto per assemblee condominiali',
      ],
    },
  ];

  const [selectedBonusId, setSelectedBonusId] = useState<string>('bonus-casa');
  const [budget, setBudget] = useState<number>(60000);

  const currentBonus = bonusOptions.find((b) => b.id === selectedBonusId) || bonusOptions[0];

  // Calcolo detrazione e recupero
  const eligibleAmount = Math.min(budget, currentBonus.maxCap);
  const totalDeduction = (eligibleAmount * currentBonus.percentage) / 100;
  const netEffectiveCost = budget - totalDeduction;
  const annualSavings = totalDeduction / 10;

  return (
    <section id="detrazioni" className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
      {/* Texture geometrica di sfondo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C2783B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intestazione */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-terracotta/20 border border-brand-terracotta/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Percent className="w-3.5 h-3.5" />
            <span>Agevolazioni Fiscali Edilizie 2026</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Calcola il Tuo Risparmio Fiscale Reale
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            BMG S.r.l. gestisce internamente tutte le pratiche edilizie (CILA, SCIA, fatturazione per bonifico parlante e asseverazione ENEA) per garantirti la massima detrazione senza pensieri.
          </p>
        </div>

        {/* 1. Selezione Tipologia di Bonus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {bonusOptions.map((opt) => {
            const isSelected = opt.id === selectedBonusId;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedBonusId(opt.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-brand-terracotta shadow-[0_0_25px_rgba(194,120,59,0.3)] ring-1 ring-brand-terracotta'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    {opt.badge}
                  </span>
                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{opt.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* 2. Box Interattivo Simulazione con Slider & Risultati Finanziari */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Colonna Sinistra: Slider Interattivo Budget */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Budget o Spesa Stimata dei Lavori
                </span>
                <div className="flex items-baseline justify-between gap-4">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    € {budget.toLocaleString('it-IT')}
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                    {currentBonus.percentage}% Recuperabile
                  </span>
                </div>
              </div>

              {/* Slider Range */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={15000}
                  max={150000}
                  step={5000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-terracotta"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>€ 15.000</span>
                  <span>€ 80.000</span>
                  <span>€ 150.000</span>
                </div>
              </div>

              {/* Servizi Inclusi nella Detrazione */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  Lavorazioni Coperte da BMG S.r.l.:
                </span>
                <div className="space-y-2">
                  {currentBonus.includedServices.map((srv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonna Destra: Riquadro Riepilogo Fiscale ad Alta Evidenza */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider block mb-1">
                  Riepilogo Fiscale Certificato
                </span>
                <div className="text-sm text-slate-300">
                  Massimale detraibile per legge: <strong>€ {currentBonus.maxCap.toLocaleString('it-IT')}</strong>
                </div>
              </div>

              {/* Metriche Finanziarie Chiave */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[11px] text-slate-400 block mb-1">Detrazione Totale IRPEF</span>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
                    - € {Math.round(totalDeduction).toLocaleString('it-IT')}
                  </div>
                  <span className="text-[10px] text-emerald-300/80">Recuperata al 100%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <span className="text-[11px] text-slate-400 block mb-1">Rata Annuale (10 Anni)</span>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-300 font-mono">
                    + € {Math.round(annualSavings).toLocaleString('it-IT')}<span className="text-xs font-normal">/anno</span>
                  </div>
                  <span className="text-[10px] text-slate-400">In dichiarazione 730 / Redditi</span>
                </div>
              </div>

              {/* Costo Netto Effettivo */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-terracotta/20 to-amber-950/30 border border-brand-terracotta/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block">
                    Costo Effettivo Finale per Te
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Al netto del rimborso fiscale statale
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  € {Math.round(netEffectiveCost).toLocaleString('it-IT')}
                </div>
              </div>

              {/* Pratiche Incluse e CTA */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-4 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Pratiche ENEA, asseverazione e CILA predisposte da BMG Srl
                  </span>
                </div>

                <a
                  href="#preventivo"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-terracotta to-[#d4894c] hover:brightness-110 text-white font-bold text-sm tracking-wider uppercase shadow-glow-terracotta transition-all"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Richiedi Preventivo con questa Detrazione</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxBonusSimulatorBlock;
