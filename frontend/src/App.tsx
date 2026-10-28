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
        services: [
          {
            iconName: 'Building2',
            badge: 'Civile & Industriale',
            imageUrl: '/images/cantieri/cantiere-10.jpg',
            title: 'Costruzioni Civili ed Industriali',
            description:
              'Realizzazione di nuovi fabbricati, ampliamenti, capannoni industriali e ville con strutture in cemento armato, muratura portante o acciaio.',
            fullDetails:
              'Dalla progettazione esecutiva e scavi di fondazione fino al grezzo avanzato e alle opere di finitura. Gestiamo commesse sia per privati (ville singole e bifamiliari ad alta efficienza energetica) sia per aziende (capannoni, magazzini logistici e sedi direzionali) con collaudi statici e conformità sismica.',
            features: [
              'Nuove costruzioni residenziali e produttive',
              'Interventi strutturali, sottomurazioni e consolidamenti',
              'Scavi, fondazioni in c.a. e recinzioni perimetrali',
            ],
          },
          {
            iconName: 'Home',
            badge: 'Chiavi in Mano',
            imageUrl: '/images/cantieri/cantiere-04.jpg',
            title: 'Ristrutturazioni Complete (Civili & Industriali)',
            description:
              'Riqualificazione completa di appartamenti, uffici, negozi e complessi industriali: demolizioni, ridistribuzione spazi interni e rifacimento totale.',
            fullDetails:
              'Affidandoti a BMG Srl hai un unico interlocutore responsabile per l\'intero cantiere: dalla demolizione controllata alla rimozione amianto certificata, dal rifacimento impianti a norma fino alla posa di rivestimenti e tinteggiature. Tempi certi e costi bloccati a contratto.',
            features: [
              'Demolizioni controllate e smaltimento macerie a norma',
              'Rifacimento completo bagni, cucine e ambienti operativi',
              'Opere in cartongesso, contropareti termiche e pareti divisorie',
            ],
          },
          {
            iconName: 'Layers',
            badge: 'Detrazione Fiscale',
            imageUrl: '/images/cantieri/cantiere-06.jpg',
            title: 'Manutenzione Condomini & Facciate',
            description:
              'Interventi di manutenzione ordinaria e straordinaria per condomini e stabili: ripristino frontalini, balconi, tetti e cappotti termici certificati.',
            fullDetails:
              'Collaboriamo continuativamente con amministratori di condominio in tutta la provincia di Monza Brianza e Milano. Realizziamo cappotti termici certificati con pannelli EPS o lana di roccia ad alte prestazioni, ripristino calcestruzzo ammalorato, impermeabilizzazioni tetti e terrazzi.',
            features: [
              'Isolamento a cappotto termico con certificazione energetica',
              'Manutenzione programmata per stabili e parti comuni',
              'Ripristino intonaci, frontalini e impermeabilizzazioni',
            ],
          },
          {
            iconName: 'Zap',
            badge: 'Certificato Di.Co.',
            imageUrl: '/images/cantieri/cantiere-03.jpg',
            title: 'Impianti Elettrici ed Idraulici',
            description:
              'Progettazione, posa e collaudo di impianti tecnologici civili ed industriali con rilascio di dichiarazione di conformità a regola d\'arte.',
            fullDetails:
              'Impiantistica di ultima generazione: impianti radianti a pavimento, pompe di calore, canalizzazioni climatizzazione, quadri elettrici industriali e domotica residenziale. Ogni intervento è seguito dai nostri tecnici abilitati e certificato secondo il DM 37/08.',
            features: [
              'Impianti elettrici completi, illuminazione LED e quadri',
              'Impianti idrosanitari, riscaldamento e condizionamento',
              'Adeguamento normativo e rilascio Dichiarazione di Conformità',
            ],
          },
          {
            iconName: 'Maximize2',
            badge: 'Isolamento Termico',
            imageUrl: '/images/cantieri/cantiere-07.jpg',
            title: 'Fornitura e Posa Serramenti & Recinzioni',
            description:
              'Installazione di serramenti ad alto isolamento termoacustico (PVC, alluminio, legno) e realizzazione di recinzioni civili ed industriali.',
            fullDetails:
              'Sostituzione infissi con certificazione termica per detrazioni fiscali. Fornitura e posa di finestre scorrevoli, persiane blindate, portoncini d\'ingresso antieffrazione e recinzioni in ferro zincato, grigliati industriali e muretti di cinta.',
            features: [
              'Fornitura e posa certificata serramenti termoisolanti',
              'Recinzioni perimetrali, cancelli carrai e muretti di cinta',
              'Riqualificazione energetica dell\'immobile e abbattimento acustico',
            ],
          },
          {
            iconName: 'Paintbrush',
            badge: 'Finiture di Pregio',
            imageUrl: '/images/cantieri/cantiere-05.jpg',
            title: 'Finiture: Cartongesso, Imbiancature & Parquet',
            description:
              'Cura meticolosa delle finiture interne: controsoffitti, velette di design, tinteggiature professionali, posa e levigatura parquet.',
            fullDetails:
              'I dettagli fanno la differenza: maestri artigiani per la posa di parquet in rovere massello o prefinito, controsoffitti con gole di luce LED integrate, tinteggiature lavabili, smalti ecologici e resine decorative per pavimenti e pareti.',
            features: [
              'Posa e levigatura parquet tradizionale e prefinito',
              'Imbiancature civili, industriali e decorativi materici',
              'Opere in cartongesso fonoassorbenti, botole a scomparsa e pareti REI',
            ],
          },
        ],
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
