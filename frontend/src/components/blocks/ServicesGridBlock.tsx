import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ArrowRight, Home, Building2, Paintbrush, Hammer, 
  Zap, Wrench, Layers, Maximize2, Flame, Sparkles, Info, ShieldCheck, Sparkle 
} from 'lucide-react';
import { ServicesGridContent, ServiceItem } from '../../types/blocks';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ServiceDetailModal } from '../ui/ServiceDetailModal';
import { BMG_ALL_SERVICES, SERVICE_CATEGORIES, BmgFullService } from '../../data/bmgServices';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5 text-brand-terracotta" />,
  Building2: <Building2 className="w-5 h-5 text-brand-terracotta" />,
  Paintbrush: <Paintbrush className="w-5 h-5 text-brand-terracotta" />,
  Hammer: <Hammer className="w-5 h-5 text-brand-terracotta" />,
  Zap: <Zap className="w-5 h-5 text-brand-terracotta" />,
  Wrench: <Wrench className="w-5 h-5 text-brand-terracotta" />,
  Layers: <Layers className="w-5 h-5 text-brand-terracotta" />,
  Maximize2: <Maximize2 className="w-5 h-5 text-brand-terracotta" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-brand-terracotta" />,
  Flame: <Flame className="w-5 h-5 text-brand-terracotta" />,
  Sparkles: <Sparkles className="w-5 h-5 text-brand-terracotta" />,
};

export const ServicesGridBlock: React.FC<{ content?: ServicesGridContent }> = ({ content }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filtra i servizi in base alla categoria attiva
  const filteredServices = activeCategory === 'all'
    ? BMG_ALL_SERVICES
    : BMG_ALL_SERVICES.filter((s) => s.category === activeCategory);

  const handleOpenQuote = (serviceTitle: string) => {
    // Invia evento personalizzato per aprire direttamente la QuoteModal con il servizio selezionato
    window.dispatchEvent(new CustomEvent('open-quote-modal', { detail: { service: serviceTitle } }));
    
    // Scorri fluidamente verso la sezione preventivo se necessario
    const preventivoSection = document.getElementById('preventivo');
    if (preventivoSection) {
      preventivoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servizi" className="py-24 bg-[#0d131f] text-white scroll-mt-20 relative overflow-hidden">
      {/* Texture geometrica di sfondo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Glow ambientale caldo */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-terracotta/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-terracotta/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Intestazione Sezione */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-terracotta/15 border border-brand-terracotta/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkle className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>13 Ambiti di Specializzazione Diretta</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-5 font-display leading-tight">
            {content?.title || 'Tutti i Servizi & Lavori di BMG Srl'}
          </h2>
          
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {content?.description ||
              'Dalle grandi opere strutturali alle finiture d\'interni più ricercate: operiamo con maestranze interne qualificate, macchinari all\'avanguardia e garanzia totale su ogni lavorazione a Monza Brianza e Milano.'}
          </p>
        </div>

        {/* Barra Filtri Categorie Dinamica */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-terracotta to-[#a85e2b] text-white shadow-glow-terracotta scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-black/25 text-amber-200' : 'bg-white/10 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Griglia delle 13 Schede Servizi con Immagine Simbolo Generata */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="h-full"
              >
                <SpotlightCard className="h-full bg-slate-900/80 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl border border-white/10 hover:border-brand-terracotta/40 transition-all flex flex-col justify-between group backdrop-blur-sm">
                  <div>
                    {/* Immagine Simbolo Rappresentativa Generata ad Alta Risoluzione */}
                    <div className="h-48 -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 overflow-hidden rounded-t-3xl relative bg-slate-950">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      {/* Gradient overlay per leggibilità */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                      
                      {/* Badge Categoria / Caratteristica */}
                      {service.badge && (
                        <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-terracotta text-white shadow-lg backdrop-blur-md">
                          {service.badge}
                        </span>
                      )}

                      {/* Icona in sovraimpressione elegante */}
                      <div className="absolute bottom-3 left-4 w-11 h-11 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-md">
                        {iconMap[service.iconName] || <Building2 className="w-5 h-5 text-brand-terracotta" />}
                      </div>
                    </div>

                    {/* Titolo del Servizio */}
                    <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors mb-2.5 leading-snug">
                      {service.title}
                    </h3>

                    {/* Descrizione Breve e Chiara */}
                    <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed line-clamp-3 font-normal">
                      {service.description}
                    </p>

                    {/* 3 Caratteristiche Tecniche con Spunta */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-6 border-t border-white/10 pt-4">
                        {service.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Azioni Scheda: Dettagli Modale + Preventivo Veloce */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors py-2 cursor-pointer"
                    >
                      <Info className="w-4 h-4 text-brand-terracotta" />
                      <span>Scheda Tecnica</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenQuote(service.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-terracotta/20 hover:bg-brand-terracotta text-amber-200 hover:text-white border border-brand-terracotta/40 hover:border-transparent font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-glow-terracotta"
                    >
                      <span>Preventivo</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modale con Scheda Tecnica e Dettagli Approfonditi del Servizio */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};

export default ServicesGridBlock;
