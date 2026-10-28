import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isStriking, setIsStriking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Coordinate mouse istantanee
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inerzia fluida a molla per il martello
  const springConfig = { damping: 28, stiffness: 450, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disabilita su dispositivi touch (smartphone, tablet)
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const triggerStrike = () => {
      setIsStriking(true);

      // Genera 4 scintille all'impatto della testa del martello
      const newSparks: Spark[] = [0, 60, 120, 180, 240, 300].map((angle, idx) => ({
        id: Date.now() + idx,
        x: mouseX.get(),
        y: mouseY.get(),
        angle,
      }));
      setSparks(newSparks);

      setTimeout(() => {
        setSparks([]);
      }, 350);
    };

    const handleMouseDown = () => triggerStrike();
    const handleMouseUp = () => setIsStriking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      );

      setIsPointer(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Puntino di precisione (Punto esatto di mira sul colpo) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isStriking ? 1.6 : isPointer ? 1.2 : 1,
          backgroundColor: isPointer ? '#D97706' : '#C2783B',
        }}
        transition={{ duration: 0.1 }}
        className="w-1.5 h-1.5 rounded-full fixed top-0 left-0 shadow-[0_0_8px_rgba(194,120,59,0.9)]"
      />

      {/* 2. Martello Animato da Costruzione / Carpentiere */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          transformOrigin: '4px 4px', // Punto di rotazione sulla testa di battuta del martello
        }}
        animate={{
          // Al click il martello "batte" con una rotazione verso il basso e rimbalzo elastico
          rotate: isStriking ? -32 : isPointer ? -8 : 12,
          scale: isStriking ? 1.15 : isPointer ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: isStriking ? 700 : 350,
          damping: isStriking ? 15 : 22,
        }}
        className="fixed top-0 left-0 -translate-x-1 -translate-y-1 filter drop-shadow-md"
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Manico del martello (Legno / Terracotta materica) */}
          <path
            d="M8 8 L26 26"
            stroke="url(#woodGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Dettaglio impugnatura antiscivolo */}
          <path
            d="M18 18 L26 26"
            stroke="#5c381c"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1.5 2"
          />

          {/* Testa in Acciaio Forgiato del Martello */}
          <rect
            x="2"
            y="2"
            width="12"
            height="7"
            rx="1.5"
            fill="url(#steelGradient)"
            stroke="#0f172a"
            strokeWidth="1"
          />

          {/* Penna / Battente posteriore smussato */}
          <path
            d="M3 3.5 L0.5 5 L3 6.5 Z"
            fill="#334155"
            stroke="#0f172a"
            strokeWidth="0.8"
          />

          {/* Fronte di battuta piatto (dove avviene il colpo) */}
          <rect
            x="13"
            y="1.5"
            width="2"
            height="8"
            rx="0.8"
            fill="#cbd5e1"
            stroke="#0f172a"
            strokeWidth="0.8"
          />

          {/* Riflesso metallico luminoso */}
          <line
            x1="4"
            y1="3.5"
            x2="12"
            y2="3.5"
            stroke="white"
            strokeWidth="0.8"
            strokeOpacity="0.7"
          />

          {/* Gradienti SVG */}
          <defs>
            <linearGradient id="woodGradient" x1="8" y1="8" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C2783B" />
              <stop offset="0.5" stopColor="#a35d27" />
              <stop offset="1" stopColor="#783e15" />
            </linearGradient>
            <linearGradient id="steelGradient" x1="2" y1="2" x2="14" y2="9" gradientUnits="userSpaceOnUse">
              <stop stopColor="#64748b" />
              <stop offset="0.5" stopColor="#334155" />
              <stop offset="1" stopColor="#1e293b" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 3. Scintille d'Impatto al Colpo del Martello */}
      <AnimatePresence>
        {sparks.map((spark) => {
          const rad = (spark.angle * Math.PI) / 180;
          const dist = 18;
          const deltaX = Math.cos(rad) * dist;
          const deltaY = Math.sin(rad) * dist;

          return (
            <motion.div
              key={spark.id}
              initial={{
                x: spark.x,
                y: spark.y,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: spark.x + deltaX,
                y: spark.y + deltaY,
                scale: 0,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]"
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;
