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
      setScrolled(currentScrollY > 40);

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
      {/* Wrapper fisso in alto con animazione di posizione */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center px-3 sm:px-6 pt-3 sm:pt-4"
      >
        {/* Floating Island: si allarga all'inizio e si restringe/compatta allo scroll */}
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 28,
            mass: 0.8,
          }}
          className={`pointer-events-auto relative w-full transition-all duration-300 overflow-hidden ${
            scrolled
              ? 'max-w-4xl rounded-full bg-white/92 backdrop-blur-2xl shadow-[0_18px_50px_-10px_rgba(0,0,0,0.22)] border border-gray-200/90 py-2 sm:py-2.5 px-4 sm:px-6'
              : 'max-w-7xl rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] border border-white/90 py-3.5 sm:py-5 px-5 sm:px-9'
          }`}
        >
          {/* Riflesso luminoso superiore (vetro satinato premium) */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

          <div className="flex items-center justify-between gap-4">
            {/* Logo BMG con animazione di ridimensionamento fluido */}
            <a
              href="/"
              className="flex items-center shrink-0 group focus:outline-none"
              aria-label="BMG Costruzioni Home"
            >
              <motion.img
                layout
                src="/logo.png"
                alt="BMG Costruzioni"
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-103 ${
                  scrolled ? 'h-7 sm:h-8' : 'h-9 sm:h-12'
                }`}
              />
            </a>

            {/* Navigazione Desktop con Sliding Pill Indicator */}
            <nav
              className="hidden md:flex items-center gap-1 sm:gap-1.5 relative p-1 rounded-full bg-gray-100/70 border border-gray-200/40"
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
                    className={`relative z-10 px-4 py-1.5 rounded-full font-semibold transition-colors duration-200 ${
                      scrolled ? 'text-xs' : 'text-xs sm:text-sm'
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

            {/* Quick Actions (Telefono con animazione live + CTA Shimmer) */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Telefono con punto verde pulsante */}
              <motion.a
                layout
                href="tel:+393485696125"
                whileHover={{ scale: 1.03 }}
                className={`flex items-center gap-2 rounded-full font-semibold text-gray-700 hover:text-brand-terracotta hover:bg-gray-100/80 transition-all ${
                  scrolled
                    ? 'px-2.5 py-1 text-xs'
                    : 'px-3.5 py-1.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200/60 shadow-2xs'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Phone className={scrolled ? 'w-3 h-3 text-brand-terracotta' : 'w-3.5 h-3.5 text-brand-terracotta'} />
                <span className="font-mono tracking-tight">+39 348 569 6125</span>
              </motion.a>

              {/* Pulsante CTA con Shimmer luminoso e gradiente dinamico */}
              <motion.a
                layout
                href="#preventivo"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`relative group overflow-hidden inline-flex items-center gap-1.5 rounded-full text-white font-bold tracking-wide uppercase transition-all shadow-glow-terracotta bg-gradient-to-r from-brand-terracotta via-[#b3672d] to-[#9c5724] ${
                  scrolled
                    ? 'px-4 py-1.5 text-[11px]'
                    : 'px-6 py-2.5 text-xs shadow-md'
                }`}
              >
                {/* Animazione Shimmer continua ad onda di luce */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
                
                <Sparkles className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative z-10">Richiedi Preventivo</span>
                <ArrowUpRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

          {/* Sottile indicatore di scroll (Hairline Progress) integrato sul bordo inferiore della capsula */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-terracotta via-amber-500 to-brand-terracotta"
              style={{ width: `${scrollProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
        </motion.div>
      </motion.header>

      {/* Menu Mobile con animazione morbida di comparsa */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-20 left-4 right-4 z-40 sm:hidden bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/80 p-5 overflow-hidden"
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
