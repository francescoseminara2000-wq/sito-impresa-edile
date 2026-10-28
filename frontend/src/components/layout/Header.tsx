import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X, Phone, Sparkles } from 'lucide-react';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100)));
      }
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
      rootMargin: '-25% 0px -60% 0px',
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
      {/* Header fisso con larghezza stabile, e altezza che si assottiglia fluidamente allo scroll */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 sm:px-8 transition-all duration-300 ${
          scrolled ? 'pt-2 sm:pt-2.5' : 'pt-4 sm:pt-5'
        }`}
      >
        <div
          className={`pointer-events-auto relative w-full max-w-7xl rounded-full bg-white/95 backdrop-blur-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 ease-out ${
            scrolled
              ? 'py-2 sm:py-2.5 px-5 sm:px-7 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.18)]'
              : 'py-4 sm:py-5 px-6 sm:px-9 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.10)]'
          }`}
        >
          {/* Riflesso luminoso superiore */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

          <div className="flex items-center justify-between gap-6">
            {/* Logo BMG: si assottiglia dolcemente in altezza quando si scorre in basso */}
            <a
              href="/"
              className="flex items-center shrink-0 group focus:outline-none"
              aria-label="BMG Costruzioni Home"
            >
              <img
                src="/logo.png"
                alt="BMG Costruzioni"
                className={`w-auto object-contain transition-all duration-300 ease-out group-hover:scale-103 ${
                  scrolled ? 'h-8 sm:h-9' : 'h-10 sm:h-12'
                }`}
              />
            </a>

            {/* Navigazione Desktop con Sliding Pill Indicator magnetico */}
            <nav
              className="hidden md:flex items-center gap-1.5 relative p-1 rounded-full bg-gray-100/80 border border-gray-200/50"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredNav === item.id;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    className={`relative z-10 rounded-full font-semibold tracking-wide transition-all duration-200 ${
                      scrolled ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-xs sm:text-sm'
                    } ${
                      isActive
                        ? 'text-white'
                        : isHovered
                        ? 'text-brand-dark'
                        : 'text-gray-600'
                    }`}
                  >
                    {/* Pillola animata per l'hover che scivola da un link all'altro */}
                    {isHovered && (
                      <motion.div
                        layoutId="navHoverPill"
                        className="absolute inset-0 bg-white shadow-xs rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}

                    {/* Pillola scura per la sezione attualmente attiva */}
                    {isActive && !isHovered && (
                      <motion.div
                        layoutId="navActivePill"
                        className="absolute inset-0 bg-brand-dark rounded-full -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}

                    <span className="relative z-10">{item.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Actions su riga singola senza compressioni */}
            <div className="hidden sm:flex items-center gap-3.5 shrink-0">
              {/* Telefono con punto verde pulsante */}
              <motion.a
                href="tel:+393485696125"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 rounded-full font-semibold text-gray-800 bg-gray-50/90 hover:bg-gray-100 border border-gray-200/80 shadow-2xs transition-all whitespace-nowrap ${
                  scrolled ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Phone className="w-3.5 h-3.5 text-brand-terracotta shrink-0" />
                <span className="font-mono tracking-tight font-bold">+39 348 569 6125</span>
              </motion.a>

              {/* Pulsante CTA con Shimmer luminoso e gradiente dinamico */}
              <motion.a
                href="#preventivo"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative group overflow-hidden inline-flex items-center gap-2 rounded-full text-white font-bold tracking-wider uppercase transition-all shadow-glow-terracotta bg-gradient-to-r from-brand-terracotta via-[#b3672d] to-[#9c5724] hover:shadow-lg whitespace-nowrap ${
                  scrolled ? 'px-5 py-2 text-xs' : 'px-6 py-2.5 text-xs'
                }`}
              >
                {/* Animazione Shimmer continua ad onda di luce */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
                
                <Sparkles className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:rotate-12 shrink-0" />
                <span className="relative z-10">Richiedi Preventivo</span>
                <ArrowUpRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </motion.a>
            </div>

            {/* Pulsanti Mobile Rapidi */}
            <div className="flex sm:hidden items-center gap-2">
              <a
                href="tel:+393485696125"
                className="p-2 rounded-full text-brand-terracotta bg-brand-terracotta/10 hover:bg-brand-terracotta/20 transition-colors"
                aria-label="Chiama"
              >
                <Phone className="w-4 h-4" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Apri Menu"
                className="p-2 rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Sottile indicatore di scroll (Hairline Progress) integrato sul fondo */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gray-100/60 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-terracotta via-amber-500 to-brand-terracotta"
              style={{ width: `${scrollProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
        </div>
      </motion.header>

      {/* Menu Mobile con animazione morbida di comparsa */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-20 left-4 right-4 z-40 sm:hidden bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 p-5 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-semibold text-gray-800 hover:bg-brand-terracotta/10 hover:text-brand-terracotta transition-colors flex items-center justify-between"
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
                className="w-full text-center py-3 rounded-2xl bg-brand-terracotta text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta"
              >
                Richiedi Preventivo
              </a>
              <a
                href="tel:+393485696125"
                className="w-full text-center py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>+39 348 569 6125</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
