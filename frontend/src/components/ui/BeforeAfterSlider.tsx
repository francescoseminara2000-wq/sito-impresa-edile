import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { MoveHorizontal, Sparkles } from 'lucide-react';

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

  // Posizione percentuale del divisore (da 0 a 100)
  const positionValue = useMotionValue(50);

  // Molla elastica ultra-reattiva a bassissima latenza per il movimento
  const smoothPosition = useSpring(positionValue, {
    damping: 28,
    stiffness: 400,
    mass: 0.3,
  });

  const [displayPosition, setDisplayPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const hasUserDragged = useRef(false);

  // Tracciamento dello scroll per animare automaticamente lo slider quando arriva al centro
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 25%'],
  });

  // Aggiorna lo stato visivo della maschera quando cambia il motion value
  useEffect(() => {
    const unsubscribe = smoothPosition.on('change', (latest) => {
      setDisplayPosition(latest);
    });
    return () => unsubscribe();
  }, [smoothPosition]);

  // Animazione automatica all'arrivo al centro dello schermo (solo se l'utente non ha ancora interagito manualmente)
  useEffect(() => {
    const unsubscribeScroll = scrollYProgress.on('change', (progress) => {
      if (!hasUserDragged.current && !isDragging) {
        if (progress >= 0.5) {
          // Quando arriva al centro, scivola fluidamente rivelando il lavoro completato
          positionValue.set(20);
        } else if (progress < 0.3) {
          // Quando torna sopra, ritorna verso lo stato prima
          positionValue.set(80);
        }
      }
    });

    return () => unsubscribeScroll();
  }, [scrollYProgress, positionValue, isDragging]);

  // Calcolo della percentuale rispetto alla larghezza del contenitore
  const updatePositionFromClientX = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      positionValue.set(percentage);
    },
    [positionValue]
  );

  // Gestione avanzata del Drag con Pointer Events globali (non perde mai la presa anche uscendo dai bordi)
  const handlePointerDown = (e: React.PointerEvent) => {
    hasUserDragged.current = true;
    setIsDragging(true);

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.setPointerCapture(e.pointerId);

    updatePositionFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePositionFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        const targetElement = e.currentTarget as HTMLElement;
        targetElement.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Fallback silenzioso
      }
    }
  };

  // Preset rapidi con transizione fluida
  const setPreset = (target: number) => {
    hasUserDragged.current = true;
    positionValue.set(target);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative select-none overflow-hidden rounded-2xl shadow-2xl aspect-[16/10] bg-brand-dark cursor-ew-resize touch-none group ${className}`}
    >
      {/* 1. Immagine DOPO (Realizzazione Finale a pieno sfondo) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Immagine PRIMA (Ritaglio mascherato fluido e preciso al pixel) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${displayPosition}%` }}
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

      {/* 3. Linea divisoria con Lama di Luce e Cursore Ergonomico di Trascinamento */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.9)]"
        style={{ left: `${displayPosition}%` }}
      >
        {/* Manopola di trascinamento tattile 3D */}
        <motion.div
          animate={{
            scale: isDragging ? 1.25 : 1,
            boxShadow: isDragging
              ? '0 0 30px rgba(194, 120, 59, 0.9), 0 0 10px rgba(255, 255, 255, 0.8)'
              : '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isDragging
              ? 'bg-brand-terracotta text-white border-2 border-white'
              : 'bg-white text-brand-dark border-2 border-brand-terracotta group-hover:scale-108'
          }`}
        >
          <MoveHorizontal className={`w-5 h-5 ${isDragging ? 'text-white' : 'text-brand-terracotta'}`} />
        </motion.div>
      </div>

      {/* 4. Etichette di Stato Flottanti (sinistra e destra) */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
        {/* Badge PRIMA */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setPreset(100);
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
            displayPosition > 50
              ? 'bg-brand-terracotta text-white border-white/30 scale-105'
              : 'bg-black/60 text-slate-300 border-white/10 hover:bg-black/80'
          }`}
        >
          <span>{beforeLabel}</span>
        </div>

        {/* Badge DOPO */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setPreset(0);
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md border ${
            displayPosition <= 50
              ? 'bg-emerald-600 text-white border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
              : 'bg-black/60 text-slate-300 border-white/10 hover:bg-black/80'
          }`}
        >
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* 5. Guida Tattile in Basso */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-md text-[10px] font-semibold transition-all duration-300 border ${
            isDragging
              ? 'bg-brand-terracotta text-white border-white/40 shadow-lg scale-105'
              : 'bg-black/60 text-white/90 border-white/10'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{isDragging ? 'Rilascia per fissare la quota' : 'Trascina la rotella o clicca per confrontare'}</span>
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
