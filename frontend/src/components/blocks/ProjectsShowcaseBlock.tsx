import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year?: number;
  surface?: string;
  images: { url: string; isBefore?: boolean }[];
}

export const ProjectsShowcaseBlock: React.FC<{ content: any }> = ({ content }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [categories, setCategories] = useState<string[]>(['Tutti']);

  useEffect(() => {
    // Caricamento progetti reali dall'API o fallback di anteprima
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data);
          const uniqueCats = ['Tutti', ...Array.from(new Set(data.map((p: any) => p.category))) as string[]];
          setCategories(uniqueCats);
        } else {
          // Dati mock dimostrativi di altissimo profilo
          const demoProjects: ProjectItem[] = [
            {
              id: '1',
              slug: 'villa-orobica',
              title: 'Villa Orobica: Restauro e Nuova Ala Panoramica',
              category: 'Residenziale di Pregio',
              location: 'Bergamo Alta',
              year: 2024,
              surface: '520 mq',
              images: [
                { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
              ],
            },
            {
              id: '2',
              slug: 'attico-brera',
              title: 'Ristrutturazione Conservativa Attico Storico',
              category: 'Ristrutturazione',
              location: 'Milano Brera',
              year: 2024,
              surface: '310 mq',
              images: [
                { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
              ],
            },
            {
              id: '3',
              slug: 'headquarter-vetreria',
              title: 'Headquarters Direzionale & Showroom',
              category: 'Commerciale',
              location: 'Brescia',
              year: 2023,
              surface: '1200 mq',
              images: [
                { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
              ],
            },
          ];
          setProjects(demoProjects);
          setCategories(['Tutti', 'Residenziale di Pregio', 'Ristrutturazione', 'Commerciale']);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProjects =
    selectedCategory === 'Tutti'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="cantieri" className="py-24 bg-white text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intestazione e Filtri */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 block">
              {content.tagline || 'Il Nostro Portfolio'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark">
              {content.title || 'Opere e Cantieri Recenti'}
            </h2>
          </div>

          {/* Categorie Chip */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-brand-surface text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia Schede Cantieri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const mainImg = project.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
            return (
              <motion.article
                key={project.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-brand-surface border border-brand-stone/60 flex flex-col shadow-sm hover:shadow-soft-elevation transition-all"
              >
                {/* Immagine con Zoom Delicato al Passaggio del Mouse */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <motion.img
                    src={mainImg}
                    alt={project.title}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-brand-dark/85 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {project.category}
                  </div>
                </div>

                {/* Dettagli Progetto */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-terracotta" />
                        {project.location}
                      </span>
                      {project.year && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-terracotta" />
                          {project.year}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-terracotta transition-colors line-clamp-2 mb-3">
                      {project.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {project.surface ? `Superficie: ${project.surface}` : 'Progetto Completo'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-dark group-hover:text-brand-terracotta transition-colors">
                      Scopri Scheda
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
