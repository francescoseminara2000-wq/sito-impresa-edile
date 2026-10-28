import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [distanceDisplay, setDistanceDisplay] = useState('0.00 m');
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Coordinate del mouse a latenza zero
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inseguimento elastico e morbido per il reticolo del distanziometro
  const smoothX = useSpring(mouseX, { damping: 26, stiffness: 340, mass: 0.35 });
  const smoothY = useSpring(mouseY, { damping: 26, stiffness: 340, mass: 0.35 });

  const accumulatedDistance = useRef(0);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Disabilita completamente su dispositivi touch (smartphone, tablet)
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      mouseX.set(currentX);
      mouseY.set(currentY);

      if (!isVisible) setIsVisible(true);

      // Calcolo distanza metrica percorsa (scala architettonica: ~100px = 1.00m)
      if (lastMousePos.current) {
        const dx = currentX - lastMousePos.current.x;
        const dy = currentY - lastMousePos.current.y;
        const stepDist = Math.sqrt(dx * dx + dy * dy);
        accumulatedDistance.current += stepDist;

        const meters = (accumulatedDistance.current / 120).toFixed(2);
        setDistanceDisplay(`${meters} m`);
      }

      lastMousePos.current = { x: currentX, y: currentY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Genera un impulso d'onda laser al punto di rilievo
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);

      // Ricalibra la misurazione a ogni click (rilievo del punto)
      accumulatedDistance.current = 0;
      setDistanceDisplay('0.00 m');
    };

    const handleMouseUp = () => setIsClicking(false);
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

  // Rimozione automatica delle onde d'urto laser finite
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Onde d'urto a impulso laser emesse al click di rilievo */}
      {ripples.map((rip) => (
        <motion.div
          key={rip.id}
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            left: rip.x,
            top: rip.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className="fixed w-8 h-8 rounded-full border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.7)]"
        />
      ))}

      {/* 1. Mirino Esterno Ottico con Assi di Puntamento (Segue morbidamente con molla) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.75 : isPointer ? 1.35 : 1,
          rotate: isPointer ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
      >
        {/* Cerchio del reticolo ottico */}
        <div
          className={`w-7 h-7 rounded-full border transition-colors duration-200 flex items-center justify-center ${
            isPointer
              ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'border-red-500/60 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
          }`}
        >
          {/* Micro tacche sui 4 quadranti */}
          <div className="absolute top-0 w-[1px] h-1.5 bg-red-400/90" />
          <div className="absolute bottom-0 w-[1px] h-1.5 bg-red-400/90" />
          <div className="absolute left-0 h-[1px] w-1.5 bg-red-400/90" />
          <div className="absolute right-0 h-[1px] w-1.5 bg-red-400/90" />
        </div>
      </motion.div>

      {/* 2. Fascio di Luce Laser e Punto di Puntamento Reale (Coordinate esatte a latenza 0) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.8 : isPointer ? 1.4 : 1,
        }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 pointer-events-none"
      >
        {/* Diodo Laser Rosso ad Altissima Luminosità */}
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            isPointer
              ? 'bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_24px_rgba(52,211,153,0.8)]'
              : 'bg-red-500 shadow-[0_0_10px_#ef4444,0_0_20px_rgba(239,68,68,0.9)]'
          }`}
        />
      </motion.div>

      {/* 3. Display Digitale LCD del Distanziometro (Micro-HUD Tecnico Leica) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          x: 18,
          y: -24,
          scale: isClicking ? 0.95 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="fixed top-0 left-0 pointer-events-none flex flex-col items-start"
      >
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-[9px] font-mono leading-none tracking-wider">
          {/* Indicatore Stato Laser */}
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${
              isPointer ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
            }`}
          />

          {/* Valore Digitale o Target Lock */}
          {isPointer ? (
            <span className="font-bold text-emerald-400 font-sans tracking-widest text-[8.5px]">
              TARGET LOCK
            </span>
          ) : (
            <span className="font-semibold text-slate-200">
              {distanceDisplay}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
