import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X, Phone } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Servizi', href: '#servizi', id: 'servizi' },
  { name: 'Realizzazioni', href: '#cantieri', id: 'cantieri' },
  { name: 'Azienda', href: '#chi-siamo', id: 'chi-siamo' },
  { name: 'Contatti', href: '#preventivo', id: 'preventivo' },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy per rilevare la sezione visibile
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0,
    });

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Floating Island Header Container */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 pointer-events-none flex justify-center px-3 sm:px-6">
        <div
          className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-full flex items-center justify-between px-4 sm:px-6 py-2.5 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12)] border border-gray-200/80 py-2'
              : 'bg-white/85 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/80'
          }`}
        >
          {/* Logo BMG Costruzioni pulito senza testi a fianco */}
          <a href="/" className="flex items-center shrink-0 group focus:outline-none" aria-label="Home">
            <img
              src="/logo.png"
              alt="BMG Costruzioni"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-103"
            />
          </a>

          {/* Navigazione Desktop Minimale ed Elegante */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-white bg-brand-dark shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Quick Action Pulite: Telefono discreto + Unico CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+393485696125"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand-terracotta px-3 py-1.5 rounded-full hover:bg-gray-100/60 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
              <span>+39 348 569 6125</span>
            </a>

            <motion.a
              href="#preventivo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-terracotta hover:bg-[#a85e2b] text-white text-xs font-bold tracking-wide transition-all shadow-sm"
            >
              <span>Preventivo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>

          {/* Hamburger Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="tel:+393485696125"
              className="p-2 rounded-full text-brand-terracotta bg-brand-terracotta/10"
              aria-label="Chiama"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile Pulito & Compatto */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-18 left-3 right-3 z-40 sm:hidden bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-200/80 p-5 overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <a
                href="#preventivo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-terracotta text-white font-bold text-xs uppercase tracking-wider shadow-sm"
              >
                Richiedi Preventivo
              </a>
              <a
                href="tel:+393485696125"
                className="w-full text-center py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Tel. +39 348 569 6125
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
