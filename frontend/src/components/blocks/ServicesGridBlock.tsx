import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, ArrowRight, Home, Building2, Paintbrush, Hammer, 
  Zap, Wrench, Layers, Maximize2, Flame, Sparkles, Info 
} from 'lucide-react';
import { ServicesGridContent, ServiceItem } from '../../types/blocks';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ServiceDetailModal } from '../ui/ServiceDetailModal';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6 text-brand-terracotta" />,
  Building2: <Building2 className="w-6 h-6 text-brand-terracotta" />,
  Paintbrush: <Paintbrush className="w-6 h-6 text-brand-terracotta" />,
  Hammer: <Hammer className="w-6 h-6 text-brand-terracotta" />,
  Zap: <Zap className="w-6 h-6 text-brand-terracotta" />,
  Wrench: <Wrench className="w-6 h-6 text-brand-terracotta" />,
  Layers: <Layers className="w-6 h-6 text-brand-terracotta" />,
  Maximize2: <Maximize2 className="w-6 h-6 text-brand-terracotta" />,
  Flame: <Flame className="w-6 h-6 text-brand-terracotta" />,
  Sparkles: <Sparkles className="w-6 h-6 text-brand-terracotta" />,
};

const fallbackServices: ServiceItem[] = [
  {
    iconName: 'Building2',
    badge: 'Civile & Industriale',
    imageUrl: '/images/cantieri/cantiere-10.jpg',
    title: 'Costruzioni Civili ed Industriali',
    description: 'Realizzazione di nuovi fabbricati, ampliamenti, capannoni industriali e ville con strutture in cemento armato, muratura o acciaio.',
    fullDetails: 'Dalla progettazione esecutiva e scavi di fondazione fino al grezzo avanzato e alle opere di finitura. Gestiamo commesse sia per privati sia per aziende con collaudi statici e conformità sismica.',
    features: ['Nuove costruzioni residenziali e produttive', 'Interventi strutturali, sottomurazioni e consolidamenti', 'Scavi, fondazioni in c.a. e recinzioni perimetrali'],
  },
  {
    iconName: 'Home',
    badge: 'Chiavi in Mano',
    imageUrl: '/images/cantieri/cantiere-04.jpg',
    title: 'Ristrutturazioni Complete (Civili & Industriali)',
    description: 'Riqualificazione completa di appartamenti, uffici, negozi e complessi industriali: demolizioni, impianti e finiture.',
    fullDetails: 'Affidandoti a BMG Srl hai un unico interlocutore responsabile per l\'intero cantiere: dalla demolizione controllata alla posa pavimenti e certificazioni.',
    features: ['Demolizioni controllate e smaltimento a norma', 'Rifacimento completo bagni, cucine e ambienti', 'Opere in cartongesso e pareti termiche'],
  },
  {
    iconName: 'Layers',
    badge: 'Detrazione Fiscale',
    imageUrl: '/images/cantieri/cantiere-06.jpg',
    title: 'Manutenzione Condomini & Facciate',
    description: 'Interventi di manutenzione ordinaria e straordinaria per condomini e stabili: ripristino frontalini, balconi, tetti e cappotti termici certificati.',
    fullDetails: 'Collaboriamo con amministratori di condominio in tutta la provincia di Monza Brianza e Milano per cappotti termici certificati e risanamento facciate.',
    features: ['Isolamento a cappotto termico certificato', 'Manutenzione programmata per stabili', 'Ripristino intonaci e impermeabilizzazioni'],
  },
  {
    iconName: 'Zap',
    badge: 'Certificato Di.Co.',
    imageUrl: '/images/cantieri/cantiere-03.jpg',
    title: 'Impianti Elettrici ed Idraulici',
    description: 'Progettazione, posa e collaudo di impianti tecnologici civili ed industriali con rilascio di dichiarazione di conformità a regola d\'arte.',
    fullDetails: 'Impianti radianti a pavimento, pompe di calore, canalizzazioni climatizzazione, quadri elettrici industriali e domotica residenziale.',
    features: ['Impianti elettrici completi e quadri', 'Impianti idrosanitari, riscaldamento e condizionamento', 'Adeguamento normativo e rilascio Di.Co.'],
  },
  {
    iconName: 'Maximize2',
    badge: 'Isolamento Termico',
    imageUrl: '/images/cantieri/cantiere-07.jpg',
    title: 'Fornitura e Posa Serramenti & Recinzioni',
    description: 'Installazione di serramenti ad alto isolamento termoacustico (PVC, alluminio, legno) e realizzazione di recinzioni civili ed industriali.',
    fullDetails: 'Sostituzione infissi con certificazione termica per detrazioni fiscali. Fornitura e posa di finestre scorrevoli, persiane blindate e recinzioni.',
    features: ['Posa certificata serramenti termoisolanti', 'Recinzioni perimetrali e cancelli carrai', 'Abbattimento termoacustico garantito'],
  },
  {
    iconName: 'Paintbrush',
    badge: 'Finiture di Pregio',
    imageUrl: '/images/cantieri/cantiere-05.jpg',
    title: 'Finiture: Cartongesso, Imbiancature & Parquet',
    description: 'Cura meticolosa delle finiture interne: controsoffitti, velette di design, tinteggiature professionali, posa e levigatura parquet.',
    fullDetails: 'Maestri artigiani per la posa di parquet in rovere massello o prefinito, velette LED a gola, tinteggiature lavabili e resine decorative.',
    features: ['Posa e levigatura parquet tradizionale e prefinito', 'Imbiancature civili ed industriali', 'Opere in cartongesso fonoassorbenti e REI'],
  },
];

export const ServicesGridBlock: React.FC<{ content: ServicesGridContent }> = ({ content }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const servicesList = (content?.services && content.services.length > 0)
    ? content.services
    : fallbackServices;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="servizi" className="py-24 bg-brand-surface text-brand-dark scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intestazione Sezione */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 block">
            {content?.tagline || 'Competenza Globale in Cantiere'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-brand-dark font-display">
            {content?.title || 'I Nostri Servizi'}
          </h2>
          {content?.description && (
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {content.description}
            </p>
          )}
        </div>

        {/* Griglia Servizi con Stagger e 3D Tilt */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesList.map((service, index) => (
            <motion.div
              key={service.id || index}
              variants={itemVariants}
            >
              <SpotlightCard className="h-full bg-white rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-2xl border border-brand-stone/70 transition-all flex flex-col justify-between group">
                <div>
                  {/* Foto anteprima opzionale */}
                  {service.imageUrl && (
                    <div className="h-44 -mx-7 -mt-7 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden rounded-t-3xl relative">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {service.badge && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-terracotta text-white shadow-md">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Header Card (Icona e Badge se non c'è foto) */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-brand-terracotta/20 flex items-center justify-center group-hover:bg-brand-terracotta/15 group-hover:scale-110 transition-all duration-300">
                      {service.iconName && iconMap[service.iconName] ? (
                        iconMap[service.iconName]
                      ) : (
                        <Building2 className="w-6 h-6 text-brand-terracotta" />
                      )}
                    </div>

                    {!service.imageUrl && service.badge && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Titolo e Descrizione Breve */}
                  <h3 className="text-xl font-bold mb-3 text-brand-dark group-hover:text-brand-terracotta transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Punti di Forza (Features) */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-8 border-t border-gray-100 pt-4">
                      {service.features.slice(0, 3).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check className="w-4 h-4 text-brand-terracotta shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Pulsanti Azione: Dettagli Modale + Preventivo Rapido */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-brand-terracotta transition-colors py-1.5"
                  >
                    <Info className="w-4 h-4 text-brand-terracotta" />
                    <span>Dettagli</span>
                  </button>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-terracotta/10 hover:bg-brand-terracotta text-brand-terracotta hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Preventivo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scheda Modale con Dettagli Approfonditi del Servizio */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};
