import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Calendar, CheckCircle2, ArrowUpRight, 
  ChevronLeft, ChevronRight, HardHat, Building, Maximize2 
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

export interface ProjectDetailData {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year?: number;
  client?: string;
  surface?: string;
  description: string;
  highlights?: string[];
  isFeatured?: boolean;
  images: {
    id?: string;
    url: string;
    caption?: string;
    isBefore?: boolean;
    isAfter?: boolean;
    compareGroup?: string | null;
  }[];
}

export const ProjectDetailModal: React.FC<{
  project: ProjectDetailData | null;
  onClose: () => void;
  onSelectServiceForQuote?: (service: string) => void;
}> = ({ project, onClose, onSelectServiceForQuote }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  // Cerca se ci sono foto abbinate Prima / Dopo
  const beforeImg = project.images.find((img) => img.isBefore)?.url;
  const afterImg = project.images.find((img) => img.isAfter)?.url || project.images[0]?.url;
  const hasBeforeAfter = Boolean(beforeImg && afterImg);

  const imagesList = project.images && project.images.length > 0
    ? project.images
    : [{ url: '/images/cantieri/cantiere-10.jpg', caption: 'Lavori eseguiti' }];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col text-brand-dark relative"
      >
        {/* Intestazione Modal */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-brand-terracotta text-white">
                {project.category}
              </span>
              {project.isFeatured && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  ★ In Evidenza
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-brand-dark transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Modal con Scroll */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Slider Prima/Dopo se disponibile, oppure Galleria Fotografica */}
          {hasBeforeAfter && beforeImg ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-terracotta flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4" />
                  <span>Confronto Prima & Dopo di questo cantiere</span>
                </span>
                <span className="text-xs text-gray-400">Trascina il cursore</span>
              </div>
              <BeforeAfterSlider
                beforeImage={beforeImg}
                afterImage={afterImg}
                beforeLabel="Prima dei Lavori"
                afterLabel="Opera Completata"
              />
            </div>
          ) : (
            <div>
              {/* Immagine Principale Ingrandita */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-900 shadow-md">
                <img
                  src={imagesList[activeImageIndex]?.url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {imagesList[activeImageIndex]?.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm p-3 text-xs text-white">
                    {imagesList[activeImageIndex].caption}
                  </div>
                )}
              </div>

              {/* Miniature Galleria */}
              {imagesList.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pt-3 pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-brand-terracotta scale-102 shadow-sm'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="miniatura" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dati Tecnici & Scheda Descrittiva */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonna Descrittiva (7 Colonne) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-bold text-brand-dark">Descrizione dell'Intervento</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">
                    Opere e Caratteristiche Principali:
                  </h4>
                  <ul className="space-y-2">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-terracotta shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Colonna Scheda Dati Cantiere (5 Colonne) */}
            <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-5 border border-gray-200/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">
                Specifiche del Cantiere
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-terracotta" /> Località:
                  </span>
                  <span className="font-bold text-brand-dark">{project.location}</span>
                </div>

                {project.year && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-terracotta" /> Anno:
                    </span>
                    <span className="font-bold text-brand-dark">{project.year}</span>
                  </div>
                )}

                {project.surface && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-brand-terracotta" /> Superficie:
                    </span>
                    <span className="font-bold text-brand-dark">{project.surface}</span>
                  </div>
                )}

                {project.client && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Committenza:</span>
                    <span className="font-bold text-brand-dark">{project.client}</span>
                  </div>
                )}
              </div>

              {/* Call to action per preventivo */}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href="#preventivo"
                  onClick={() => {
                    onClose();
                    if (onSelectServiceForQuote) {
                      onSelectServiceForQuote(project.category);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Richiedi Lavoro Simile</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
};
