import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageRenderer } from './components/PageRenderer';
import { FullPhotoGalleryModal } from './components/ui/FullPhotoGalleryModal';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PageSectionData } from './types/blocks';
import { Images } from 'lucide-react';
import { CustomCursor } from './components/ui/CustomCursor';
import { BackToTop } from './components/ui/BackToTop';
import { BMG_ALL_SERVICES } from './data/bmgServices';

export const App: React.FC = () => {
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Galleria completa di tutte le 20 foto
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Modalità Admin (attivabile via URL /admin o hash #admin o pulsante)
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(window.location.pathname === '/admin' || window.location.hash === '#admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Caricamento sezioni dal backend o fallback predefinito
    fetch('/api/pages/home')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const defaultSections = getBmgDefaultSections();
        if (data && data.sections && data.sections.length > 0) {
          // Verifica se la sezione SERVICES_GRID è presente nel DB
          const hasServices = data.sections.some((s: PageSectionData) => s.type === 'SERVICES_GRID');
          const hasProjects = data.sections.some((s: PageSectionData) => s.type === 'PROJECTS_SHOWCASE');

          let mergedSections = [...data.sections];

          if (!hasServices) {
            const defServices = defaultSections.find((s) => s.type === 'SERVICES_GRID');
            if (defServices) {
              mergedSections.splice(2, 0, defServices);
            }
          } else {
            // Aggiorna sempre la sezione con i 13 servizi completi di BMG
            const srvIdx = mergedSections.findIndex((s) => s.type === 'SERVICES_GRID');
            const defServices = defaultSections.find((s) => s.type === 'SERVICES_GRID');
            if (srvIdx !== -1 && defServices) {
              mergedSections[srvIdx] = defServices;
            }
          }

          if (!hasProjects) {
            const defProjects = defaultSections.find((s) => s.type === 'PROJECTS_SHOWCASE');
            if (defProjects) {
              const insertIdx = mergedSections.findIndex((s) => s.type === 'CTA_FORM');
              if (insertIdx !== -1) {
                mergedSections.splice(insertIdx, 0, defProjects);
              } else {
                mergedSections.push(defProjects);
              }
            }
          }

          setSections(mergedSections);
        } else {
          setSections(defaultSections);
        }
      })
      .catch(() => {
        setSections(getBmgDefaultSections());
      })
      .finally(() => setLoading(false));
  }, []);

  const openAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminView(true);
  };

  const closeAdmin = () => {
    window.location.hash = '';
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
  };

  // Se siamo nell'area admin, mostriamo la dashboard
  if (isAdminView) {
    return <AdminDashboard onBackToSite={closeAdmin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-light text-brand-dark selection:bg-brand-terracotta selection:text-white">
      {/* Cursore Architettonico Personalizzato */}
      <CustomCursor />

      <Header />
      
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <PageRenderer sections={sections} />

            {/* Banner Rapido Galleria Completa Snellito */}
            <div className="bg-[#0b0f19] py-8 px-6 border-t border-white/10 text-white">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white mb-0.5">
                    Portfolio Fotografico Completo
                  </h3>
                  <p className="text-xs text-gray-400">
                    Sfoglia tutte le 20 fotografie ad alta definizione dei cantieri BMG
                  </p>
                </div>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all shrink-0"
                >
                  <Images className="w-4 h-4" />
                  <span>Apri Galleria Completa</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* Pulsante Chat WhatsApp Moderno in Basso a Destra */}
      <WhatsAppButton />

      {/* Pulsante Torna Su con anello circolare di avanzamento */}
      <BackToTop />

      {/* Pulsante rapido Area Riservata in basso a sinistra */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={openAdmin}
          className="px-3 py-1.5 rounded-full bg-brand-dark/90 hover:bg-brand-dark border border-white/20 text-white text-[11px] font-semibold backdrop-blur-md shadow-lg transition-transform hover:scale-105"
        >
          🔒 Area Riservata
        </button>
      </div>

      {/* Modal Galleria a schermo intero */}
      <FullPhotoGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

// Sezioni su misura per BMG Srl
function getBmgDefaultSections(): PageSectionData[] {
  return [
    {
      id: 'sec-hero',
      pageId: 'home',
      type: 'HERO',
      order: 0,
      isVisible: true,
      content: {
        badge: 'BMG Srl • Impresa Edile Caponago (MB)',
        title: 'Costruzioni e Ristrutturazioni',
        highlightedWord: 'Civili ed Industriali',
        subtitle:
          'Dalla nuova costruzione alle ristrutturazioni complete, manutenzioni condominiali, cappotti termici e impianti certificati a Monza e Brianza, Milano e Lombardia.',
        primaryCtaText: 'Richiedi Preventivo e Sopralluogo',
        primaryCtaLink: '#preventivo',
        secondaryCtaText: 'I Nostri Servizi',
        secondaryCtaLink: '#servizi',
        backgroundImage: '/images/cantieri/cantiere-10.jpg',
        statsPreview: [
          { number: '100%', label: 'Lavori Certificati a Norma' },
          { number: '13+', label: 'Ambiti di Specializzazione' },
          { number: 'Chiavi in Mano', label: 'Unico Referente per Tutto' },
          { number: 'Caponago (MB)', label: 'Sede e Ufficio Tecnico' },
        ],
      },
    },
    {
      id: 'sec-stats',
      pageId: 'home',
      type: 'STATS',
      order: 1,
      isVisible: true,
      content: {
        stats: [
          { value: 'Civile & Industriale', label: 'Settori di Intervento', sublabel: 'Dall\'appartamento al capannone' },
          { value: 'Sicurezza', suffix: ' 100%', label: 'Conformità Cantieri', sublabel: 'DURC regolare e POS aggiornati' },
          { value: 'Chiavi in Mano', label: 'Gestione Integrale', sublabel: 'Opere murarie, impianti e finiture' },
          { value: 'Rapidità', label: 'Sopralluoghi Gratuiti', sublabel: 'Preventivi trasparenti e dettagliati' },
        ],
      },
    },
    {
      id: 'sec-services',
      pageId: 'home',
      type: 'SERVICES_GRID',
      order: 2,
      isVisible: true,
      content: {
        tagline: 'Competenza Globale in Cantiere',
        title: 'Tutti i Servizi Offerti da BMG Srl',
        description:
          'Gestiamo internamente ogni fase: opere strutturali, demolizioni, impianti elettrici ed idraulici, finiture di pregio e posa serramenti con un unico interlocutore responsabile.',
        services: BMG_ALL_SERVICES,
      },
    },
    {
      id: 'sec-before-after',
      pageId: 'home',
      type: 'BEFORE_AFTER',
      order: 3,
      isVisible: true,
      content: {
        title: 'Prima e Dopo: Ristrutturazione Completa',
        subtitle:
          'Dallo stato originario e di cantiere grezzo alla finitura chiavi in mano curata in ogni dettaglio.',
        description:
          'Demolizione pareti esistenti, nuovo impianto elettrico ed idraulico a pavimento, isolamento termoacustico, cartongesso ribassato e posa parquet levigato.',
        beforeImage: '/images/cantieri/cantiere-03.jpg',
        afterImage: '/images/cantieri/cantiere-04.jpg',
        beforeLabel: 'Prima dell\'Intervento',
        afterLabel: 'Consegna Lavori Finita',
        details: [
          { label: 'Ubicazione Lavori', value: 'Monza e Brianza / Milano' },
          { label: 'Opere Eseguite', value: 'Demolizione, Impianti, Cartongesso e Parquet' },
          { label: 'Tempi di Consegna', value: 'Rispettati rigorosamente a contratto' },
        ],
      },
    },
    {
      id: 'sec-projects',
      pageId: 'home',
      type: 'PROJECTS_SHOWCASE',
      order: 4,
      isVisible: true,
      content: {
        tagline: 'I Nostri Cantieri',
        title: 'Realizzazioni e Opere Eseguite da BMG Srl',
      },
    },
    {
      id: 'sec-cta',
      pageId: 'home',
      type: 'CTA_FORM',
      order: 5,
      isVisible: true,
      content: {
        title: 'Richiedi un Preventivo Gratuito a BMG Srl',
        subtitle:
          'Compila il modulo o contattaci direttamente al +39 348 569 6125. Effettuiamo sopralluoghi tecnici gratuiti e senza impegno a Caponago, Monza Brianza e Milano.',
        servicesOptions: [
          'Costruzione Civile / Industriale',
          'Ristrutturazione Completa',
          'Manutenzione Condominio',
          'Cappotto Termico / Facciate',
          'Impianti Elettrici / Idraulici',
          'Cartongesso / Imbiancature',
          'Fornitura e Posa Serramenti',
          'Posa e Levigatura Parquet',
          'Demolizioni / Interventi Strutturali',
          'Recinzioni',
        ],
        budgetOptions: [
          'Meno di 25.000€',
          '25.000€ - 50.000€',
          '50.000€ - 100.000€',
          'Oltre 100.000€',
        ],
      },
    },
  ];
}

export default App;
