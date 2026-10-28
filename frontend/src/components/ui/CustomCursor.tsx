import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Coordinate del mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fisica a molla per l'anello fluido esterno (trailing ring)
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

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

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Rileva elementi interattivi al passaggio del mouse
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
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Anello Fluido Architettonico (insegue con inerzia morbida) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.75 : isPointer ? 1.6 : 1,
          borderColor: isPointer ? '#C2783B' : 'rgba(194, 120, 59, 0.45)',
          backgroundColor: isPointer ? 'rgba(194, 120, 59, 0.12)' : 'transparent',
          borderWidth: isPointer ? '1.5px' : '1px',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-9 h-9 rounded-full border fixed top-0 left-0 flex items-center justify-center backdrop-blur-[0.5px]"
      >
        {/* Micro-mirino a croce da architetto quando è sopra un pulsante */}
        {isPointer && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-brand-terracotta opacity-60" />
            <span className="h-1.5 w-[1px] bg-brand-terracotta opacity-60" />
          </div>
        )}
      </motion.div>

      {/* Puntino Centrale di Precisione (posizione esatta e istantanea) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.4 : isPointer ? 0.5 : 1,
          backgroundColor: isPointer ? '#C2783B' : '#C2783B',
        }}
        transition={{ duration: 0.1 }}
        className="w-1.5 h-1.5 rounded-full fixed top-0 left-0 shadow-[0_0_8px_rgba(194,120,59,0.8)]"
      />
    </div>
  );
};
