import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUpRight, Menu, X } from 'lucide-react';

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
          ? 'bg-brand-dark/95 backdrop-blur-md shadow-lg py-3 border-b border-white/10'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Reale MGM Costruzioni */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-white/20 group-hover:scale-102 transition-transform">
            <img
              src="/logo.png"
              alt="MGM Costruzioni"
              className="h-8 sm:h-10 w-auto object-contain"
            />
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
          <a href="#chi-siamo" className="hover:text-brand-terracotta transition-colors">
            Azienda
          </a>
          <a href="#preventivo" className="hover:text-brand-terracotta transition-colors">
            Contatti
          </a>
        </nav>

        {/* CTA & Telefono Diretto Reale */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="tel:+393485696125"
            className="flex items-center gap-2 text-xs font-semibold text-gray-200 hover:text-white transition-colors bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
          >
            <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
            <span className="font-mono">+39 348 569 6125</span>
          </a>

          <motion.a
            href="#preventivo"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-terracotta text-white font-semibold text-xs tracking-wider uppercase shadow-glow-terracotta hover:bg-[#a85e2b] transition-colors"
          >
            <span>Richiedi Preventivo</span>
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
            className="md:hidden bg-brand-dark/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6"
          >
            <div className="flex flex-col gap-4 text-base font-semibold text-white">
              <a
                href="#servizi"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-terracotta py-2 border-b border-white/5"
              >
                Servizi & Opere
              </a>
              <a
                href="#cantieri"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-terracotta py-2 border-b border-white/5"
              >
                Realizzazioni & Cantieri
              </a>
              <a
                href="#preventivo"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-brand-terracotta py-2 border-b border-white/5"
              >
                Richiesta Sopralluogo Gratuito
              </a>
              <a
                href="tel:+393485696125"
                className="flex items-center gap-2 text-brand-terracotta py-2 font-mono text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>+39 348 569 6125</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
