import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageRenderer } from './components/PageRenderer';
import { PageSectionData } from './types/blocks';

export const App: React.FC = () => {
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Caricamento sezioni della homepage da API
    fetch('/api/pages/home')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.sections && data.sections.length > 0) {
          setSections(data.sections);
        } else {
          // Dataset di default di altissimo impatto estetico per la prima installazione
          setSections(getDefaultSections());
        }
      })
      .catch(() => {
        setSections(getDefaultSections());
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-light text-brand-dark selection:bg-brand-terracotta selection:text-white">
      <Header />
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <PageRenderer sections={sections} />
        )}
      </main>
      <Footer />
    </div>
  );
};

// Sezioni predefinite di altissimo livello
function getDefaultSections(): PageSectionData[] {
  return [
    {
      id: 'sec-hero',
      pageId: 'home',
      type: 'HERO',
      order: 0,
      isVisible: true,
      content: {
        badge: 'Costruzioni di Pregio & Restauro Architettonico',
        title: 'Architettura d\'Autore e',
        highlightedWord: 'Precisione Costruttiva',
        subtitle:
          'Dalla ristrutturazione conservativa di dimore storiche alla realizzazione di ville moderne a impatto zero: trasformiamo ogni progetto in un\'opera d\'arte duratura.',
        primaryCtaText: 'Richiedi un Sopralluogo',
        primaryCtaLink: '#preventivo',
        secondaryCtaText: 'Esplora i Cantieri',
        secondaryCtaLink: '#cantieri',
        backgroundImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85',
        statsPreview: [
          { number: '35+', label: 'Anni di Esperienza' },
          { number: '280+', label: 'Cantieri Portati a Termine' },
          { number: '100%', label: 'Rispetto Cronoprogramma' },
          { number: '10 Anni', label: 'Garanzia Postuma Decennale' },
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
          { value: '45.000', suffix: ' mq', label: 'Superficie Ristrutturata', sublabel: 'Standard energetici classe A4' },
          { value: '100', suffix: '%', label: 'Consegna nei Tempi', sublabel: 'Penali garantite a contratto' },
          { value: '42', suffix: ' Professionisti', label: 'Team Tecnico Diretto', sublabel: 'Ingegneri, architetti e maestranze' },
          { value: '250', suffix: 'k€', label: 'Capitale Sociale i.v.', sublabel: 'Solidità finanziaria certificata' },
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
        tagline: 'Soluzioni Edili a 360°',
        title: 'Servizi di Costruzione e Ristrutturazione ad Alto Profilo',
        description:
          'Seguiamo l\'intero ciclo di vita dell\'opera, dalla progettazione esecutiva e gestione pratiche comunali fino alla finitura chiavi in mano con materiali pregiati.',
        services: [
          {
            iconName: 'Home',
            title: 'Ristrutturazioni di Lusso "Chiavi in Mano"',
            description:
              'Riqualificazione completa di appartamenti, attici e ville con un unico interlocutore dedicato, contabilità trasparente e finiture su misura.',
            features: [
              'Impianti domotici e VMC integrata',
              'Isolamento acustico certificato',
              'Posa parquet a spina e marmi pregiati',
            ],
          },
          {
            iconName: 'Building2',
            title: 'Nuove Costruzioni & Ville Moderne',
            description:
              'Edifici ad altissima efficienza energetica (NZEB / CasaPassiva) in cemento armato o bioedilizia con strutture antisismiche all\'avanguardia.',
            features: [
              'Progettazione BIM esecutiva',
              'Geotermia e fotovoltaico integrato',
              'Certificazione energetica A4+',
            ],
          },
          {
            iconName: 'Paintbrush',
            title: 'Restauro Conservativo & Facciate',
            description:
              'Interventi su immobili vincolati e stabili d\'epoca, ripristino stucchi d\'epoca, consolidamento strutturale e cappotto termico con materiali traspiranti.',
            features: [
              'Interventi approvati Sovrintendenza',
              'Consolidamenti con fibre di carbonio',
              'Tinteggiature minerali e intonaci di calce',
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
        title: 'Prima e Dopo: La Rinascita di una Dimora Storica',
        subtitle:
          'Guarda il confronto visivo tra lo stato originario e la completa riqualificazione conservativa eseguita nel centro storico di Milano.',
        description:
          'Consolidamento dei solai in legno originari, inserimento di riscaldamento a pavimento a basso spessore, recupero filologico delle modanature e nuova illuminazione architetturale incassata.',
        beforeImage:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        afterImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        beforeLabel: 'Prima: Stato di Degrado',
        afterLabel: 'Dopo: Attico di Pregio Concluso',
        details: [
          { label: 'Tempo di Esecuzione', value: '7 Mesi (anticipo di 2 settimane)' },
          { label: 'Efficientamento Energetico', value: 'Passaggio da Classe G a Classe A2' },
          { label: 'Superficie Totale', value: '260 mq interni + 45 mq terrazzo' },
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
        tagline: 'Portfolio Realizzazioni',
        title: 'Opere Recenti e Cantieri Selezionati',
      },
    },
    {
      id: 'sec-cta',
      pageId: 'home',
      type: 'CTA_FORM',
      order: 5,
      isVisible: true,
      content: {
        title: 'Richiedi una Consulenza e Sopralluogo Gratuito',
        subtitle:
          'Compila il modulo specificando la tipologia di cantiere. Un nostro ingegnere o project manager ti ricontatterà entro 24 ore con un piano preliminare.',
      },
    },
  ];
}
export default App;
