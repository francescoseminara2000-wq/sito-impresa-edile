import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PageRenderer } from './components/PageRenderer';
import { PageSectionData } from './types/blocks';

export const App: React.FC = () => {
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Caricamento sezioni dal backend o fallback predefinito
    fetch('/api/pages/home')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.sections && data.sections.length > 0) {
          setSections(data.sections);
        } else {
          setSections(getBmgDefaultSections());
        }
      })
      .catch(() => {
        setSections(getBmgDefaultSections());
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
        backgroundImage:
          'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=2200&q=85',
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
            title: 'Costruzioni Civili ed Industriali',
            description:
              'Realizzazione di nuovi fabbricati, ampliamenti, capannoni industriali e ville con strutture in cemento armato, muratura portante o acciaio.',
            features: [
              'Nuove costruzioni residenziali e produttive',
              'Interventi strutturali e consolidamenti',
              'Scavi, fondazioni e recinzioni perimetrali',
            ],
          },
          {
            iconName: 'Home',
            title: 'Ristrutturazioni Complete (Civili & Industriali)',
            description:
              'Riqualificazione completa di appartamenti, uffici, negozi e complessi industriali: demolizioni, ridistribuzione spazi interni e rifacimento totale.',
            features: [
              'Demolizioni controllate e smaltimento macerie',
              'Rifacimento bagni, cucine e ambienti di lavoro',
              'Opere in cartongesso e pareti divisorie isolanti',
            ],
          },
          {
            iconName: 'Building2',
            title: 'Manutenzione Condomini & Facciate',
            description:
              'Interventi di manutenzione ordinaria e straordinaria per condomini e stabili: ripristino frontalini, balconi, tetti e parti comuni.',
            features: [
              'Isolamento a cappotto termico certificato',
              'Manutenzione programmata per amministratori',
              'Ripristino intonaci e impermeabilizzazioni',
            ],
          },
          {
            iconName: 'Hammer',
            title: 'Impianti Elettrici ed Idraulici',
            description:
              'Progettazione, posa e collaudo di impianti tecnologici civili ed industriali con rilascio di dichiarazione di conformità a regola d\'arte.',
            features: [
              'Impianti elettrici completi, illuminazione e quadri',
              'Impianti idrosanitari, riscaldamento e condizionamento',
              'Adeguamento normativo e certificazioni',
            ],
          },
          {
            iconName: 'Paintbrush',
            title: 'Fornitura e Posa Serramenti & Recinzioni',
            description:
              'Installazione di serramenti ad alto isolamento termoacustico (PVC, alluminio, legno) e realizzazione di recinzioni civili ed industriali.',
            features: [
              'Fornitura e posa serramenti certificati',
              'Recinzioni perimetrali, cancellate e muretti',
              'Miglioramento classe energetica dell\'immobile',
            ],
          },
          {
            iconName: 'Paintbrush',
            title: 'Finiture: Cartongesso, Imbiancature & Parquet',
            description:
              'Cura meticolosa delle finiture interne: controsoffitti, velette di design, tinteggiature professionali, posa e levigatura parquet.',
            features: [
              'Posa e levigatura parquet tradizionale e prefinito',
              'Imbiancature civili, industriali e decorativi',
              'Opere in cartongesso fonoassorbenti e REI',
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
        beforeImage:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        afterImage:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
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
