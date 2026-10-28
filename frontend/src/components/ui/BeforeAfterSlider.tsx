import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Prima dell\'Intervento',
  afterLabel = 'Realizzazione Finale',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Stato corrente: 'before' (100% prima) o 'after' (100% dopo)
  const [activeState, setActiveState] = useState<'before' | 'after'>('before');

  // Posizione percentuale della maschera: 100 = tutto Prima, 0 = tutto Dopo
  const targetPercent = useMotionValue(100);

  // Molla elastica ultra-fluida per l'animazione di transizione completa a spazzata (wipe)
  const smoothSweep = useSpring(targetPercent, {
    damping: 24,
    stiffness: 140,
    mass: 0.6,
  });

  const [renderedPercent, setRenderedPercent] = useState(100);
  const userManuallyToggled = useRef(false);

  // Tracciamento dello scroll: quando la sezione arriva al centro dello schermo
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 35%'],
  });

  useEffect(() => {
    const unsubscribeSpring = smoothSweep.on('change', (v) => {
      setRenderedPercent(v);
    });

    const unsubscribeScroll = scrollYProgress.on('change', (progress) => {
      // Quando il blocco arriva al centro dello schermo (progress >= 0.5)
      // scatta la transizione fluida e totale da Prima a Dopo
      if (!userManuallyToggled.current) {
        if (progress >= 0.5 && activeState !== 'after') {
          setActiveState('after');
          targetPercent.set(0); // Spazza completamente rivelando il Dopo al 100%
        } else if (progress < 0.4 && activeState !== 'before') {
          setActiveState('before');
          targetPercent.set(100); // Ritorna fluidamente al Prima al 100%
        }
      }
    });

    return () => {
      unsubscribeSpring();
      unsubscribeScroll();
    };
  }, [scrollYProgress, smoothSweep, targetPercent, activeState]);

  // Possibilità di invertire/scattare la transizione anche cliccando sull'immagine o sui pulsanti
  const toggleState = () => {
    userManuallyToggled.current = true;
    if (activeState === 'before') {
      setActiveState('after');
      targetPercent.set(0);
    } else {
      setActiveState('before');
      targetPercent.set(100);
    }

    // Dopo 2 secondi riabilita dolcemente la sincronizzazione con lo scroll
    setTimeout(() => {
      userManuallyToggled.current = false;
    }, 2000);
  };

  // La linea di luce a spazzata è visibile solo mentre l'animazione sta attraversando l'immagine
  const isSweeping = renderedPercent > 1 && renderedPercent < 99;

  return (
    <div
      ref={containerRef}
      onClick={toggleState}
      className={`relative select-none overflow-hidden rounded-2xl shadow-2xl aspect-[16/10] bg-brand-dark cursor-pointer group ${className}`}
    >
      {/* 1. Immagine DOPO (Realizzazione Finale a pieno schermo) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Immagine PRIMA (Ritaglio mascherato che spazza via fluidamente fino al 100%) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${renderedPercent}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            height: '100%',
          }}
        />
      </div>

      {/* 3. Lama di Luce / Laser a Spazzata (Sweep Bar) che attraversa lo schermo durante la transizione */}
      {isSweeping && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-white pointer-events-none shadow-[0_0_20px_#C2783B,0_0_35px_rgba(255,255,255,0.9)]"
          style={{ left: `${renderedPercent}%` }}
        >
          {/* Bagliore centrale della lama di transizione */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/90 border border-brand-terracotta shadow-[0_0_15px_#C2783B] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-terracotta animate-spin" />
          </div>
        </div>
      )}

      {/* 4. Barra di Stato Superiore con Pillola Dinamica "Prima" / "Dopo" */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
        {/* Badge Stato Attuale */}
        <motion.div
          key={activeState}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${
            activeState === 'after'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-brand-dark/90 text-amber-200 border-white/20'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              activeState === 'after' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-brand-terracotta'
            }`}
          />
          <span>{activeState === 'after' ? afterLabel : beforeLabel}</span>
        </motion.div>

        {/* Pulsante rapido cliccabile "Inverti / Rivela" */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15 shadow-md group-hover:bg-brand-terracotta transition-colors pointer-events-auto">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{activeState === 'before' ? 'Clicca per vedere il Dopo' : 'Clicca per vedere il Prima'}</span>
        </div>
      </div>

      {/* 5. Micro-indicatore in basso al centro */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-white/80 border border-white/10">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Arriva al centro o clicca per la trasformazione totale</span>
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
