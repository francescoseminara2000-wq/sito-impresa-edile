import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useScroll, useSpring, useMotionValue } from 'framer-motion';

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

  // Valore continuo da 0 a 100
  const positionValue = useMotionValue(50);

  // Molla ultra-reattiva a bassissima latenza per sincronia perfetta
  const smoothPosition = useSpring(positionValue, {
    damping: 32,
    stiffness: 450,
    mass: 0.2,
  });

  const [displayPosition, setDisplayPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const hasUserDragged = useRef(false);

  // Sincronizzazione automatica con lo scroll
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

  useEffect(() => {
    const unsubscribeScroll = scrollYProgress.on('change', (progress) => {
      if (!hasUserDragged.current && !isDragging) {
        if (progress >= 0.5) {
          positionValue.set(20);
        } else if (progress < 0.3) {
          positionValue.set(80);
        }
      }
    });

    return () => unsubscribeScroll();
  }, [scrollYProgress, positionValue, isDragging]);

  // Calcolo matematico esatto della percentuale di taglio
  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      positionValue.set(percentage);
    },
    [positionValue]
  );

  // Dragging solido tramite Pointer Events (infallibile anche fuori dal riquadro)
  const handlePointerDown = (e: React.PointerEvent) => {
    hasUserDragged.current = true;
    setIsDragging(true);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        const target = e.currentTarget as HTMLElement;
        target.releasePointerCapture(e.pointerId);
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
      className={`relative select-none overflow-hidden rounded-3xl shadow-2xl aspect-[16/10] bg-brand-dark cursor-ew-resize touch-pan-y group ${className}`}
    >
      {/* 1. Immagine DOPO (Base a tutto schermo) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Immagine PRIMA (Taglio perfetto tramite clipPath nativo: MAI più disallineato!) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - displayPosition}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - displayPosition}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* 3. Linea di divisione e Manopola di Precisione perfettamente Centrata sull'asse */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none z-20 touch-none"
        style={{ left: `${displayPosition}%` }}
      >
        {/* Linea verticale passante perfettamente centrata */}
        <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]" />

        {/* Manopola Circolare Minimale di Precisione */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center transition-all duration-150 ${
            isDragging
              ? 'scale-115 shadow-[0_0_25px_rgba(255,255,255,0.9),0_4px_20px_rgba(0,0,0,0.7)] ring-2 ring-brand-terracotta'
              : 'shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:scale-105'
          } bg-white text-slate-800 border border-slate-300 pointer-events-auto cursor-ew-resize`}
        >
          {/* Frecce orizzontali minimali e separatore centrale */}
          <div className="flex items-center justify-center gap-1 text-slate-800">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <div className="w-[1.5px] h-3.5 bg-slate-300" />
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Etichette di Stato (sinistra e destra) con posizione e contrasto ottimali */}
      <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 flex items-center justify-between pointer-events-none z-10">
        {/* Badge PRIMA */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreset(100);
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-200 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${
            displayPosition > 50
              ? 'bg-slate-900/90 text-white border-white/30 scale-105'
              : 'bg-black/55 text-slate-300 border-white/10 hover:bg-black/80 hover:text-white'
          }`}
        >
          <span>{beforeLabel}</span>
        </button>

        {/* Badge DOPO */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreset(0);
          }}
          className={`pointer-events-auto cursor-pointer transition-all duration-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${
            displayPosition <= 50
              ? 'bg-emerald-700/90 text-white border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
              : 'bg-black/55 text-slate-300 border-white/10 hover:bg-black/80 hover:text-white'
          }`}
        >
          <span>{afterLabel}</span>
        </button>
      </div>

      {/* 5. Guida Tattile in Basso */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-md text-[10px] font-semibold transition-all duration-300 border ${
            isDragging
              ? 'bg-brand-terracotta text-white border-white/40 shadow-lg scale-105'
              : 'bg-black/60 text-white/90 border-white/10'
          }`}
        >
          <span>{isDragging ? 'Rilascia per fissare la quota' : 'Trascina il cursore o clicca sui badge'}</span>
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
