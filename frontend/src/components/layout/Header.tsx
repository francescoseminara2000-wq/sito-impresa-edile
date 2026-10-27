import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUpRight, Menu, X, Hammer } from 'lucide-react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-dark/90 backdrop-blur-md shadow-lg py-3.5 border-b border-white/10'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-brand-terracotta flex items-center justify-center text-white shadow-glow-terracotta group-hover:scale-105 transition-transform">
            <Hammer className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white font-display uppercase leading-tight">
              Edil<span className="text-brand-terracotta">Pregio</span>
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Costruzioni & Restauri
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
          <a href="#servizi" className="hover:text-brand-terracotta transition-colors">
            Servizi
          </a>
          <a href="#cantieri" className="hover:text-brand-terracotta transition-colors">
            Realizzazioni
          </a>
          <a href="#metodo" className="hover:text-brand-terracotta transition-colors">
            Metodo Costruttivo
          </a>
          <a href="#preventivo" className="hover:text-brand-terracotta transition-colors">
            Contatti
          </a>
        </nav>

        {/* CTA & Telefono Diretto */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:+390289001234"
            className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>02 8900 1234</span>
          </a>

          <motion.a
            href="#preventivo"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-terracotta text-white font-semibold text-xs tracking-wider uppercase shadow-glow-terracotta hover:bg-[#a85e2b] transition-colors"
          >
            <span>Richiedi Sopralluogo</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Hamburger Mobile */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-brand-terracotta focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 px-6 py-6"
          >
            <div className="flex flex-col gap-4 text-base font-semibold text-white">
              <a
                href="#servizi"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-terracotta py-2"
              >
                Servizi
              </a>
              <a
                href="#cantieri"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-terracotta py-2"
              >
                Realizzazioni & Cantieri
              </a>
              <a
                href="#preventivo"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-terracotta py-2"
              >
                Richiesta Sopralluogo
              </a>
              <a
                href="tel:+390289001234"
                className="flex items-center gap-2 text-brand-terracotta py-2"
              >
                <Phone className="w-4 h-4" />
                <span>+39 02 8900 1234</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
