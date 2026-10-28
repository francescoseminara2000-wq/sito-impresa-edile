import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
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
  const [isManualDragging, setIsManualDragging] = useState(false);
  const manualSliderPos = useMotionValue(50);

  // Tracciamento dello scroll per animare automaticamente lo slider durante la discesa
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 15%'],
  });

  // Mappa lo scroll progress (da 0 a 1) allo spostamento della levetta (da 12% a 88%)
  const scrollMappedPos = useTransform(scrollYProgress, [0, 1], [12, 88]);

  // Molla elastica ultra-fluida per il movimento automatico guidato dallo scroll
  const smoothScrollPos = useSpring(scrollMappedPos, {
    damping: 26,
    stiffness: 110,
    mass: 0.5,
  });

  // Posizione effettiva renderizzata (spring dello slider)
  const [currentPosition, setCurrentPosition] = useState(50);
  const isInteracting = useRef(false);

  useEffect(() => {
    // Sincronizza la posizione guidata dallo scroll solo quando l'utente non sta trascinando manualmente
    const unsubscribeScroll = smoothScrollPos.on('change', (latest) => {
      if (!isInteracting.current) {
        setCurrentPosition(latest);
      }
    });

    const unsubscribeManual = manualSliderPos.on('change', (latest) => {
      if (isInteracting.current) {
        setCurrentPosition(latest);
      }
    });

    return () => {
      unsubscribeScroll();
      unsubscribeManual();
    };
  }, [smoothScrollPos, manualSliderPos]);

  // Gestione trascinamento manuale tramite Mouse o Touch
  const handleManualMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
      manualSliderPos.set(percentage);
      setCurrentPosition(percentage);
    },
    [manualSliderPos]
  );

  const handleStartDrag = (clientX: number) => {
    isInteracting.current = true;
    setIsManualDragging(true);
    handleManualMove(clientX);
  };

  const handleStopDrag = () => {
    setIsManualDragging(false);
    // Dopo 1.5 secondi di inattività riabilita dolcemente la sincronizzazione con lo scroll
    setTimeout(() => {
      isInteracting.current = false;
    }, 1500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isManualDragging) return;
    handleManualMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isManualDragging) return;
    handleManualMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl shadow-soft-elevation cursor-ew-resize aspect-[16/10] bg-brand-dark group ${className}`}
      onMouseDown={(e) => handleStartDrag(e.clientX)}
      onMouseUp={handleStopDrag}
      onMouseLeave={handleStopDrag}
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => handleStartDrag(e.touches[0].clientX)}
      onTouchEnd={handleStopDrag}
      onTouchMove={handleTouchMove}
    >
      {/* Immagine DOPO (Sfondo completo) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-4 right-4 bg-brand-dark/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow-md">
        {afterLabel}
      </div>

      {/* Immagine PRIMA (Ritaglio mascherato fluido) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${currentPosition}%` }}
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
        <div className="absolute top-4 left-4 bg-brand-terracotta/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
          {beforeLabel}
        </div>
      </div>

      {/* Linea divisoria ad alta precisione con cursore animato */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${currentPosition}%` }}
      >
        <motion.div
          animate={{
            scale: isManualDragging ? 1.2 : 1,
            boxShadow: isManualDragging
              ? '0 0 25px rgba(194, 120, 59, 0.8)'
              : '0 0 15px rgba(0, 0, 0, 0.4)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-brand-dark shadow-2xl flex items-center justify-center border-2 border-brand-terracotta"
        >
          <MoveHorizontal className="w-5 h-5 text-brand-terracotta" />
        </motion.div>
      </div>

      {/* Indicatore discreto "Scroll Sync" in basso a destra */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-white/10 shadow-lg">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Animato dallo scroll • Trascina per fermare</span>
        </span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
