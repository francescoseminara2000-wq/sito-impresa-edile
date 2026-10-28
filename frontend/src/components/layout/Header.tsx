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

  // Monitora scroll progress, stato scrolled e traccia dinamicamente la sezione attiva
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100)));
      }

      // Rilevamento continuo e affidabile della sezione attiva allo scroll
      const headerOffset = 220; // Offset visivo sotto l'header
      let activeId = '';

      // Controlla dall'ultimo al primo per selezionare la sezione visibile corretta
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            activeId = item.id;
            break;
          }
        }
      }

      // Se siamo nella Hero in cima alla pagina, nessuna voce è selezionata
      if (currentScrollY < 200) {
        activeId = '';
      }

      setActiveSection(activeId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Esegui anche un controllo iniziale e un ritardo per quando i componenti asincroni finiscono il render
    handleScroll();
    const timer = setTimeout(handleScroll, 400);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
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

            {/* Navigazione Desktop con Sliding Pill Indicator magnetico nello stesso blu scuro del tema (#0f172a) */}
            <nav
              className="hidden md:flex items-center gap-1.5 relative p-1 rounded-full bg-gray-100/80 border border-gray-200/50"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredNav === item.id;
                // La chip si illumina se il mouse è sopra, oppure sulla sezione attualmente in vista durante lo scroll
                const isHighlighted = isHovered || (isActive && !hoveredNav);

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    className={`relative z-10 rounded-full font-semibold tracking-wide transition-all duration-200 ${
                      scrolled ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-xs sm:text-sm'
                    } ${
                      isHighlighted
                        ? 'text-white font-bold'
                        : 'text-gray-700 hover:text-[#0f172a]'
                    }`}
                  >
                    {/* Chip animato nel blu scuro profondo del tema (#0f172a / #111827) */}
                    {isHighlighted && (
                      <motion.div
                        layoutId="navThemeDarkChip"
                        className="absolute inset-0 bg-[#0f172a] rounded-full -z-10 shadow-md shadow-slate-900/30"
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      />
                    )}

                    <span className="relative z-10">{item.name}</span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Actions su riga singola pulita ed elegante */}
            <div className="hidden sm:flex items-center gap-3.5 shrink-0">

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
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#0f172a] text-white font-bold shadow-md shadow-slate-900/25'
                        : 'text-gray-800 hover:bg-slate-100 hover:text-[#0f172a]'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  </a>
                );
              })}
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
