import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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

  // Molla elastica ultra-reattiva per seguire il movimento con precisione assoluta
  const smoothPosition = useSpring(positionValue, {
    damping: 30,
    stiffness: 420,
    mass: 0.25,
  });

  const [displayPosition, setDisplayPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const hasUserDragged = useRef(false);

  // Tracciamento dello scroll per animare automaticamente lo slider quando arriva al centro
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 25%'],
  });

  useEffect(() => {
    const unsubscribe = smoothPosition.on('change', (latest) => {
      setDisplayPosition(latest);
    });
    return () => unsubscribe();
  }, [smoothPosition]);

  // Animazione di dimostrazione allo scroll finché l'utente non interagisce manualmente
  useEffect(() => {
    const unsubscribeScroll = scrollYProgress.on('change', (progress) => {
      if (!hasUserDragged.current && !isDragging) {
        if (progress >= 0.5) {
          positionValue.set(22);
        } else if (progress < 0.3) {
          positionValue.set(78);
        }
      }
    });

    return () => unsubscribeScroll();
  }, [scrollYProgress, positionValue, isDragging]);

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

  // Dragging universale ad altissima precisione con Pointer Capture
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
      className={`relative select-none overflow-hidden rounded-3xl shadow-2xl aspect-[16/10] bg-brand-dark cursor-ew-resize touch-none group ${className}`}
    >
      {/* 1. Immagine DOPO (Realizzazione Finale a pieno sfondo) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Immagine PRIMA (Ritaglio mascherato fluido e preciso) */}
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

      {/* 3. Lama di Luce Divisoria & Nuovo Picker di Trascinamento di Pregio */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/30 via-white to-white/30 pointer-events-none shadow-[0_0_16px_rgba(255,255,255,0.9)]"
        style={{ left: `${displayPosition}%` }}
      >
        {/* Nuovo Barilotto / Capsula di Precisione Architettonica da Cantiere */}
        <motion.div
          animate={{
            scale: isDragging ? 1.15 : 1,
            boxShadow: isDragging
              ? '0 0 35px rgba(194, 120, 59, 0.95), 0 0 15px rgba(255, 255, 255, 0.9)'
              : '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(194, 120, 59, 0.4)',
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 sm:w-12 h-20 sm:h-22 rounded-full flex flex-col items-center justify-between py-2.5 transition-all duration-200 backdrop-blur-xl border-2 ${
            isDragging
              ? 'bg-gradient-to-b from-slate-900 via-brand-dark to-slate-900 border-amber-400'
              : 'bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 border-amber-500/80 group-hover:border-amber-400 group-hover:scale-105'
          }`}
        >
          {/* Micro-vite superiore di calibrazione */}
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-slate-600 shadow-xs" />

          {/* Cuore del Picker: Frecce Direzionali e Costine di Grip Tattile */}
          <div className="flex items-center justify-center gap-0.5 w-full px-1">
            <ChevronLeft
              className={`w-4 h-4 transition-all ${
                isDragging ? 'text-white -translate-x-0.5' : 'text-amber-400 group-hover:-translate-x-0.5'
              }`}
            />

            {/* Scanalature zigrinate di grip (3 costine orizzontali) */}
            <div className="flex flex-col gap-1 items-center justify-center px-0.5">
              <span className={`w-2.5 h-[1.5px] rounded-full transition-colors ${isDragging ? 'bg-amber-300' : 'bg-slate-400'}`} />
              <span className={`w-3.5 h-[1.5px] rounded-full transition-colors ${isDragging ? 'bg-amber-300' : 'bg-slate-300'}`} />
              <span className={`w-2.5 h-[1.5px] rounded-full transition-colors ${isDragging ? 'bg-amber-300' : 'bg-slate-400'}`} />
            </div>

            <ChevronRight
              className={`w-4 h-4 transition-all ${
                isDragging ? 'text-white translate-x-0.5' : 'text-amber-400 group-hover:translate-x-0.5'
              }`}
            />
          </div>

          {/* Micro-vite inferiore */}
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-slate-600 shadow-xs" />
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
          className={`pointer-events-auto cursor-pointer transition-all duration-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${
            displayPosition > 50
              ? 'bg-brand-dark/95 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(194,120,59,0.4)] scale-105'
              : 'bg-black/60 text-slate-400 border-white/10 hover:bg-black/80 hover:text-white'
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
          className={`pointer-events-auto cursor-pointer transition-all duration-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${
            displayPosition <= 50
              ? 'bg-emerald-950/95 text-emerald-300 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105'
              : 'bg-black/60 text-slate-400 border-white/10 hover:bg-black/80 hover:text-white'
          }`}
        >
          <span>{afterLabel}</span>
        </div>
      </div>

      {/* 5. Micro-guida Tattile in Basso */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-md text-[10px] font-semibold transition-all duration-300 border ${
            isDragging
              ? 'bg-brand-terracotta text-white border-amber-300/50 shadow-lg scale-105'
              : 'bg-black/60 text-white/90 border-white/10'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{isDragging ? 'Rilascia per fissare la posizione' : 'Trascina la manopola centrale per confrontare'}</span>
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
