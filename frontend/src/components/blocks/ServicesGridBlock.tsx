import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Home, Building2, Paintbrush, Hammer, 
  Zap, Wrench, Layers, Maximize2, Flame, Sparkles, ShieldCheck, Sparkle 
} from 'lucide-react';
import { ServicesGridContent, ServiceItem } from '../../types/blocks';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ServiceDetailModal } from '../ui/ServiceDetailModal';
import { BMG_ALL_SERVICES, SERVICE_CATEGORIES, BmgFullService } from '../../data/bmgServices';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4 text-brand-terracotta" />,
  Building2: <Building2 className="w-4 h-4 text-brand-terracotta" />,
  Paintbrush: <Paintbrush className="w-4 h-4 text-brand-terracotta" />,
  Hammer: <Hammer className="w-4 h-4 text-brand-terracotta" />,
  Zap: <Zap className="w-4 h-4 text-brand-terracotta" />,
  Wrench: <Wrench className="w-4 h-4 text-brand-terracotta" />,
  Layers: <Layers className="w-4 h-4 text-brand-terracotta" />,
  Maximize2: <Maximize2 className="w-4 h-4 text-brand-terracotta" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-brand-terracotta" />,
  Flame: <Flame className="w-4 h-4 text-brand-terracotta" />,
  Sparkles: <Sparkles className="w-4 h-4 text-brand-terracotta" />,
};

export const ServicesGridBlock: React.FC<{ content?: ServicesGridContent }> = ({ content }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filtra i servizi in base alla categoria selezionata
  const filteredServices = activeCategory === 'all'
    ? BMG_ALL_SERVICES
    : BMG_ALL_SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section id="servizi" className="py-20 sm:py-28 bg-[#0b0f19] text-white scroll-mt-20 relative overflow-hidden">
      {/* Sfondo geometrico sottile e minimale */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Glow d'atmosfera */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-terracotta/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Intestazione Sezione Snella e Pulita */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-terracotta/15 border border-brand-terracotta/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkle className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>13 Ambiti di Specializzazione</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 font-display">
            {content?.title || 'I Nostri Servizi'}
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Tocca o clicca su una lavorazione per visualizzarne i dettagli completi, specifiche e capitolato.
          </p>
        </div>

        {/* Barra Filtri Categorie Swipeable e Minimale */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-10 scrollbar-none px-1">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-terracotta text-white shadow-glow-terracotta scale-102'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-black/30 text-amber-200' : 'bg-white/10 text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Griglia Schede Servizi Snellite: SOLO Foto + Titolo + Clicca per Dettagli */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onClick={() => setSelectedService(service)}
                className="group cursor-pointer h-full"
              >
                <SpotlightCard className="h-full bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 shadow-lg hover:shadow-2xl border border-white/10 hover:border-brand-terracotta/50 transition-all flex flex-col justify-between backdrop-blur-sm group-hover:-translate-y-1 duration-300">
                  <div>
                    {/* Immagine Simbolo Rappresentativa */}
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl relative bg-slate-950 mb-3.5">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />
                      
                      {/* Gradient overlay morbido */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />
                      
                      {/* Badge della Categoria */}
                      {service.badge && (
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-terracotta/90 text-white shadow-sm backdrop-blur-md">
                          {service.badge}
                        </span>
                      )}

                      {/* Icona in pillola semitrasparente */}
                      <div className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-lg bg-slate-950/85 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-md">
                        {iconMap[service.iconName] || <Building2 className="w-4 h-4 text-brand-terracotta" />}
                      </div>
                    </div>

                    {/* Titolo Essenziale del Servizio */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 mb-1">
                      {service.title}
                    </h3>
                  </div>

                  {/* Azione Pulita: Mostra Dettagli */}
                  <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">
                      {service.categoryLabel}
                    </span>
                    
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-terracotta group-hover:text-amber-300 transition-all text-xs">
                      <span>Mostra dettagli</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Scheda Modale con Dettagli Approfonditi, Foto Grande e Preventivo */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};

export default ServicesGridBlock;
