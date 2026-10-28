import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  ArrowUpRight,
  Menu,
  X,
  MapPin,
  Clock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Building2,
  HardHat,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  id: string;
  badge?: string;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Servizi', href: '#servizi', id: 'servizi', description: 'Costruzioni, impianti e ristrutturazioni' },
  { name: 'Realizzazioni', href: '#cantieri', id: 'cantieri', badge: '20 Foto', description: 'Galleria cantieri e prima/dopo' },
  { name: 'Azienda', href: '#chi-siamo', id: 'chi-siamo', description: 'BMG Srl, certificazioni e conformità' },
  { name: 'Contatti', href: '#preventivo', id: 'preventivo', description: 'Sopralluogo gratuito e preventivo rapido' },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitora scroll progress e stato scrolled
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 25);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy: individua la sezione attiva visibile nella viewport
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Blocca lo scroll del body quando il menu mobile è aperto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const whatsappMessage = encodeURIComponent(
    'Buongiorno BMG Srl, vorrei richiedere informazioni per un lavoro di ristrutturazione/costruzione.'
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {/* 1. Barra Superiore Informativa (Top Utility Bar) - visibile prima dello scroll */}
        <div
          className={`bg-[#0f172a] text-gray-300 border-b border-white/10 transition-all duration-300 overflow-hidden ${
            scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-12 py-2 opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] sm:text-xs">
            {/* Status & Ubicazione */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operativi e reperibili</span>
              </span>

              <span className="hidden md:inline-flex items-center gap-1 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>Caponago (MB) • Monza Brianza, Milano e Lombardia</span>
              </span>
            </div>

            {/* Orari, Email e Sopralluogo */}
            <div className="flex items-center gap-4 text-gray-300">
              <span className="hidden lg:inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand-terracotta" />
                <span>Lun - Sab 8:00 - 19:00</span>
              </span>

              <a
                href="mailto:info@bmg-costruzioni.it"
                className="hidden sm:inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-3 h-3 text-brand-terracotta" />
                <span>info@bmg-costruzioni.it</span>
              </a>

              <span className="text-brand-terracotta font-semibold hidden sm:inline">
                Sopralluoghi & Preventivi Gratuiti
              </span>
            </div>
          </div>
        </div>

        {/* 2. Barra di Navigazione Principale (Main Sticky Bar) */}
        <div
          className={`transition-all duration-300 backdrop-blur-xl ${
            scrolled
              ? 'bg-white/95 shadow-md py-2.5 border-b border-gray-200/80'
              : 'bg-white/90 shadow-sm py-3.5 border-b border-gray-200/40'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo con badge descrittivo */}
            <a
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40 rounded-lg p-0.5"
              aria-label="BMG Costruzioni Home"
            >
              <img
                src="/logo.png"
                alt="BMG Costruzioni"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
              />
              <div className="hidden xl:flex flex-col border-l border-gray-200 pl-3">
                <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider font-display">
                  Costruzioni & Ristrutturazioni
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  Civili & Industriali • Caponago (MB)
                </span>
              </div>
            </a>

            {/* Desktop Navigation con Scrollspy ed evidenziazione attiva */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-gray-100/80 border border-gray-200/60 shadow-inner">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white bg-brand-terracotta shadow-xs'
                        : 'text-gray-700 hover:text-brand-terracotta hover:bg-white/80'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-tight ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-brand-terracotta/10 text-brand-terracotta'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Quick Actions (Telefono, WhatsApp e CTA Preventivo) */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* WhatsApp Rapido */}
              <a
                href={`https://wa.me/393485696125?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Scrivici direttamente su WhatsApp"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all hover:scale-102 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>

              {/* Chiamata Diretta */}
              <a
                href="tel:+393485696125"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-brand-terracotta transition-all bg-gray-50 hover:bg-gray-100 px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-2xs hover:scale-102"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
                <span className="font-mono text-xs">+39 348 569 6125</span>
              </a>

              {/* Bottone Primario Preventivo */}
              <motion.a
                href="#preventivo"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative group overflow-hidden inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-terracotta via-[#b3672d] to-[#9c5724] text-white font-bold text-xs tracking-wider uppercase shadow-glow-terracotta hover:shadow-lg transition-all"
              >
                {/* Effetto Shimmer luminoso */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform" />
                <span className="relative z-10">Richiedi Preventivo</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>

            {/* Mobile Actions: WhatsApp rapido + Hamburger button */}
            <div className="flex sm:hidden items-center gap-2">
              <a
                href={`https://wa.me/393485696125?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp BMG"
                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-600/20" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu di navigazione"
                className="p-2 rounded-lg bg-gray-100 text-gray-800 hover:text-brand-terracotta focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Indicatore di Progresso Lettura (Scroll Progress Bar) */}
        <div className="h-[2.5px] w-full bg-transparent overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-terracotta via-amber-500 to-brand-terracotta transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* 4. Menu Mobile a Schermo Intero (Modern Drawer Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden flex flex-col justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white rounded-t-3xl max-h-[92vh] overflow-y-auto w-full p-6 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Menu Mobile */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <img src="/logo.png" alt="BMG Costruzioni" className="h-9 w-auto object-contain" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Elenco Voci di Navigazione Mobile */}
              <div className="py-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-brand-terracotta/10 text-brand-terracotta font-bold border border-brand-terracotta/20'
                          : 'hover:bg-gray-50 text-gray-800 font-semibold'
                      }`}
                    >
                      <div>
                        <div className="text-base flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-terracotta text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 font-normal mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </a>
                  );
                })}
              </div>

              {/* Call-to-action e Contatti Rapidi */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <a
                  href="#preventivo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-sm uppercase tracking-wider shadow-glow-terracotta transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Richiedi Sopralluogo Gratuito</span>
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="tel:+393485696125"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs"
                  >
                    <Phone className="w-4 h-4 text-brand-terracotta" />
                    <span>Chiama Ora</span>
                  </a>

                  <a
                    href={`https://wa.me/393485696125?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Sede e recapiti footer nel drawer */}
                <div className="pt-3 text-center text-xs text-gray-400 space-y-1">
                  <p>BMG S.r.l. • Via De Gasperi 19, Caponago (MB)</p>
                  <p className="text-[11px]">Monza Brianza, Milano e Lombardia • P.IVA Regolare</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
