import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ArrowRight, Phone, ShieldCheck, 
  Home, Building2, Paintbrush, Hammer, Zap, Wrench, 
  Layers, Maximize2, Flame, Sparkles 
} from 'lucide-react';
import { ServiceItem } from '../../types/blocks';

const iconCatalog: Record<string, React.ReactNode> = {
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

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  // Chiusura con tasto Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
          {/* Backdrop con sfocatura scura */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Finestra Modale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-4 sm:my-8 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto di anteprima se disponibile */}
            {service.imageUrl && (
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-gray-900">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {service.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-brand-terracotta text-white shadow-md uppercase tracking-wider">
                    {service.badge}
                  </span>
                )}
              </div>
            )}

            {/* Pulsante Chiusura */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-lg transition-transform hover:scale-105"
              aria-label="Chiudi finestra"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 sm:p-8 overflow-y-auto flex-1 overscroll-contain">
              {/* Intestazione */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-brand-terracotta/20 flex items-center justify-center shrink-0">
                  {service.iconName && iconCatalog[service.iconName] ? (
                    iconCatalog[service.iconName]
                  ) : (
                    <Building2 className="w-6 h-6 text-brand-terracotta" />
                  )}
                </div>

                <div>
                  {!service.imageUrl && service.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-terracotta/10 text-brand-terracotta mb-2 uppercase tracking-wide">
                      {service.badge}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-brand-dark tracking-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Descrizione Principale */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Dettagli Approfonditi se presenti */}
              {service.fullDetails && (
                <div className="p-4 rounded-2xl bg-brand-surface border border-gray-100 text-gray-700 text-sm leading-relaxed mb-6">
                  {service.fullDetails}
                </div>
              )}

              {/* Punti di Forza / Specifiche */}
              {service.features && service.features.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Cosa include questo servizio:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rassicurazione Garanzie BMG */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
                <ShieldCheck className="w-4 h-4 text-brand-terracotta" />
                <span>
                  Lavori certificati a norma con rilascio dichiarazione di conformità e DURC regolare.
                </span>
              </div>

              {/* Bottoni di Azione */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('open-quote-modal', { detail: { service: service.title } }));
                    const el = document.getElementById('preventivo');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-sm tracking-wide text-center uppercase shadow-glow-terracotta transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Richiedi Preventivo per questo Servizio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="tel:+393485696125"
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-brand-terracotta" />
                  <span>Chiama +39 348 569 6125</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
