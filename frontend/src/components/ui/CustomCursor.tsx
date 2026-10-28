import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Coordinate del mouse a latenza zero
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Inseguimento elastico e morbido per il mirino ottico
  const smoothX = useSpring(mouseX, { damping: 24, stiffness: 360, mass: 0.3 });
  const smoothY = useSpring(mouseY, { damping: 24, stiffness: 360, mass: 0.3 });

  useEffect(() => {
    // Disabilita completamente su dispositivi touch (smartphone, tablet)
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Impulso onda laser ad espansione al click
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
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

  // Rimozione automatica delle onde d'urto finite
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Onde d'urto laser generate al click */}
      {ripples.map((rip) => (
        <motion.div
          key={rip.id}
          initial={{ scale: 0.3, opacity: 0.95 }}
          animate={{ scale: 3.8, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            left: rip.x,
            top: rip.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          className={`fixed w-10 h-10 rounded-full border-2 ${
            isPointer
              ? 'border-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]'
              : 'border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.8)]'
          }`}
        />
      ))}

      {/* 1. Mirino Esterno Ottico (Crosshair ad alta visibilità con fisica a molla) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isPointer ? 1.4 : 1,
          rotate: isPointer ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
      >
        {/* Cerchio del reticolo con spessore e bagliore evidente */}
        <div
          className={`relative w-9 h-9 rounded-full border-[1.5px] transition-colors duration-200 flex items-center justify-center ${
            isPointer
              ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_16px_rgba(16,185,129,0.7)]'
              : 'border-red-500/90 bg-red-500/10 shadow-[0_0_14px_rgba(239,68,68,0.5)]'
          }`}
        >
          {/* Tacche di collimazione evidenti sui 4 assi */}
          <div
            className={`absolute -top-1.5 w-[2px] h-2 rounded-full transition-colors ${
              isPointer ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
            }`}
          />
          <div
            className={`absolute -bottom-1.5 w-[2px] h-2 rounded-full transition-colors ${
              isPointer ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
            }`}
          />
          <div
            className={`absolute -left-1.5 h-[2px] w-2 rounded-full transition-colors ${
              isPointer ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
            }`}
          />
          <div
            className={`absolute -right-1.5 h-[2px] w-2 rounded-full transition-colors ${
              isPointer ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
            }`}
          />
        </div>
      </motion.div>

      {/* 2. Diodo Laser Centrale a Latenza Zero (Punto focale ad alta visibilità) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.6 : isPointer ? 1.3 : 1,
        }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center"
      >
        {/* Punto Laser Centrale con Bagliore Brillante e Hot-Spot Bianco Interno */}
        <div
          className={`relative w-2.5 h-2.5 rounded-full transition-colors duration-200 flex items-center justify-center ${
            isPointer
              ? 'bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_24px_rgba(52,211,153,0.9)]'
              : 'bg-red-500 shadow-[0_0_12px_#ef4444,0_0_24px_rgba(239,68,68,0.9)]'
          }`}
        >
          {/* Micro nucleo bianco focale al centro per massima evidenza e nitidezza */}
          <div className="w-1 h-1 rounded-full bg-white shadow-sm" />
        </div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
