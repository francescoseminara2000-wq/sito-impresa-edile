import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Eye, Grid } from 'lucide-react';

interface PhotoItem {
  id: number;
  url: string;
  title: string;
  category: string;
}

// Tutte le 20 foto caricate da BMG Srl
export const allBmgPhotos: PhotoItem[] = [
  { id: 1, url: '/images/cantieri/cantiere-01.jpg', title: 'Fondazioni e Muri di Contenimento', category: 'Costruzioni' },
  { id: 2, url: '/images/cantieri/cantiere-02.jpg', title: 'Recinzioni e Sistemazioni Esterne', category: 'Costruzioni' },
  { id: 3, url: '/images/cantieri/cantiere-03.jpg', title: 'Fase di Cantiere e Demolizioni', category: 'Ristrutturazioni' },
  { id: 4, url: '/images/cantieri/cantiere-04.jpg', title: 'Lavori di Ristrutturazione Chiavi in Mano', category: 'Ristrutturazioni' },
  { id: 5, url: '/images/cantieri/cantiere-05.jpg', title: 'Posa Impianti e Sottofondi', category: 'Impianti' },
  { id: 6, url: '/images/cantieri/cantiere-06.jpg', title: 'Opere Murarie e Finiture Interne', category: 'Ristrutturazioni' },
  { id: 7, url: '/images/cantieri/cantiere-07.jpg', title: 'Rifacimento Ambienti Bagno e Cucina', category: 'Ristrutturazioni' },
  { id: 8, url: '/images/cantieri/cantiere-08.jpg', title: 'Manutenzione Stabili e Condomini', category: 'Condomini' },
  { id: 9, url: '/images/cantieri/cantiere-09.jpg', title: 'Carpenteria e Cemento Armato', category: 'Costruzioni' },
  { id: 10, url: '/images/cantieri/cantiere-10.jpg', title: 'Strutture Portanti e Cantiere Edile', category: 'Costruzioni' },
  { id: 11, url: '/images/cantieri/cantiere-11.jpg', title: 'Preparazione Facciata per Cappotto', category: 'Cappotto' },
  { id: 12, url: '/images/cantieri/cantiere-12.jpg', title: 'Isolamento Termico a Cappotto Finito', category: 'Cappotto' },
  { id: 13, url: '/images/cantieri/cantiere-13.jpg', title: 'Risanamento Balconi e Frontalini', category: 'Condomini' },
  { id: 14, url: '/images/cantieri/cantiere-14.jpg', title: 'Posa Serramenti e Tinteggiature', category: 'Finiture' },
  { id: 15, url: '/images/cantieri/cantiere-15.jpg', title: 'Controsoffitti in Cartongesso', category: 'Finiture' },
  { id: 16, url: '/images/cantieri/cantiere-16.jpg', title: 'Velette di Design e Cartongesso', category: 'Finiture' },
  { id: 17, url: '/images/cantieri/cantiere-17.jpg', title: 'Impianti Elettrici e Tracce a Parete', category: 'Impianti' },
  { id: 18, url: '/images/cantieri/cantiere-18.jpg', title: 'Posa e Levigatura Pavimento Parquet', category: 'Parquet' },
  { id: 19, url: '/images/cantieri/cantiere-19.jpg', title: 'Finitura Parquet Trattato a Regola d\'Arte', category: 'Parquet' },
  { id: 20, url: '/images/cantieri/cantiere-20.jpg', title: 'Imbiancatura Finale e Consegna Cantiere', category: 'Finiture' },
];

export const FullPhotoGalleryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Tutti');

  const categories = ['Tutti', 'Costruzioni', 'Ristrutturazioni', 'Cappotto', 'Finiture', 'Parquet', 'Impianti', 'Condomini'];

  const filteredPhotos =
    activeFilter === 'Tutti'
      ? allBmgPhotos
      : allBmgPhotos.filter((p) => p.category === activeFilter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === 0 ? filteredPhotos.length - 1 : selectedPhotoIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === filteredPhotos.length - 1 ? 0 : selectedPhotoIndex + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-between">
      {/* Intestazione Modal */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase font-bold text-brand-terracotta tracking-widest block">
            Archivio Fotografico Lavori
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Tutte le 20 Foto dei Cantieri BMG Srl
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Filtri con swipe orizzontale su mobile */}
      <div className="max-w-7xl mx-auto w-full py-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveFilter(cat);
              setSelectedPhotoIndex(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeFilter === cat
                ? 'bg-brand-terracotta text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Griglia delle Foto */}
      <div className="max-w-7xl mx-auto w-full flex-1 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-800 border border-white/10 hover:border-brand-terracotta transition-all"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                <span className="text-[10px] text-amber-200 font-semibold uppercase">{photo.category}</span>
                <span className="text-xs text-white font-medium line-clamp-1">{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Zoom Schermo Intero */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={filteredPhotos[selectedPhotoIndex].url}
                alt={filteredPhotos[selectedPhotoIndex].title}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-white/15"
              />
              <div className="text-center mt-3">
                <span className="text-xs text-brand-terracotta uppercase font-bold tracking-wider">
                  Foto {selectedPhotoIndex + 1} di {filteredPhotos.length} • {filteredPhotos[selectedPhotoIndex].category}
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5">
                  {filteredPhotos[selectedPhotoIndex].title}
                </h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
