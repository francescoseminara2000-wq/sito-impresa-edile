import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight, Hammer } from 'lucide-react';

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
  const [categories, setCategories] = useState<string[]>([
    'Tutti',
    'Costruzioni & Strutture',
    'Ristrutturazioni & Interni',
    'Facciate & Cappotti',
    'Finiture, Cartongesso & Parquet',
  ]);

  useEffect(() => {
    // Foto reali dei cantieri di BMG Srl
    const realProjects: ProjectItem[] = [
      {
        id: '1',
        slug: 'costruzione-strutturale-monza',
        title: 'Nuova Costruzione e Interventi Strutturali in Cemento Armato',
        category: 'Costruzioni & Strutture',
        location: 'Monza e Brianza',
        year: 2024,
        surface: 'Intervento Strutturale',
        images: [{ url: '/images/cantieri/cantiere-10.jpg' }],
      },
      {
        id: '2',
        slug: 'ristrutturazione-interni-chiavi-in-mano',
        title: 'Ristrutturazione Completa con Demolizioni e Nuova Distribuzione',
        category: 'Ristrutturazioni & Interni',
        location: 'Milano e Provincia',
        year: 2024,
        surface: '160 mq',
        images: [{ url: '/images/cantieri/cantiere-06.jpg' }],
      },
      {
        id: '3',
        slug: 'cappotto-termico-facciata',
        title: 'Isolamento a Cappotto Termico e Risanamento Facciate Esterne',
        category: 'Facciate & Cappotti',
        location: 'Caponago (MB)',
        year: 2024,
        surface: 'Efficientamento Energetico',
        images: [{ url: '/images/cantieri/cantiere-12.jpg' }],
      },
      {
        id: '4',
        slug: 'cartongesso-design-velette',
        title: 'Opere in Cartongesso, Controsoffitti e Illuminotecnica Integrata',
        category: 'Finiture, Cartongesso & Parquet',
        location: 'Monza e Brianza',
        year: 2024,
        surface: 'Design d\'Interni',
        images: [{ url: '/images/cantieri/cantiere-16.jpg' }],
      },
      {
        id: '5',
        slug: 'posa-levigatura-parquet',
        title: 'Posa, Trattamento e Levigatura Professionale Pavimentazioni in Parquet',
        category: 'Finiture, Cartongesso & Parquet',
        location: 'Lombardia',
        year: 2023,
        surface: 'Pavimentazione di Pregio',
        images: [{ url: '/images/cantieri/cantiere-18.jpg' }],
      },
      {
        id: '6',
        slug: 'recinzioni-opere-esterne',
        title: 'Realizzazione Muri di Cinta, Recinzioni Perimetrali e Pavimentazioni',
        category: 'Costruzioni & Strutture',
        location: 'Caponago e limitrofi',
        year: 2023,
        surface: 'Opere Esterne',
        images: [{ url: '/images/cantieri/cantiere-02.jpg' }],
      },
      {
        id: '7',
        slug: 'impianti-tecnologici-condominio',
        title: 'Manutenzione Condominiale e Rifacimento Impianti Tecnologici',
        category: 'Ristrutturazioni & Interni',
        location: 'Monza Brianza',
        year: 2024,
        surface: 'Opere Condominiali',
        images: [{ url: '/images/cantieri/cantiere-08.jpg' }],
      },
      {
        id: '8',
        slug: 'serramenti-imbiancature',
        title: 'Fornitura e Posa Serramenti ad Alto Isolamento & Imbiancature',
        category: 'Finiture, Cartongesso & Parquet',
        location: 'Milano',
        year: 2024,
        surface: 'Finiture Chiavi in Mano',
        images: [{ url: '/images/cantieri/cantiere-14.jpg' }],
      },
    ];

    setProjects(realProjects);
  }, []);

  const filteredProjects =
    selectedCategory === 'Tutti'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="cantieri" className="py-24 bg-white text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Intestazione e Categorie */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 block">
              Foto dei Nostri Lavori Reali
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark">
              Cantieri e Realizzazioni BMG Srl
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Una selezione di opere eseguite direttamente dalle nostre squadre di operai e tecnici specializzati a Caponago, Monza Brianza e Milano.
            </p>
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

        {/* Griglia Schede Cantieri con foto reali */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => {
            const mainImg = project.images?.[0]?.url;
            return (
              <motion.article
                key={project.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative rounded-2xl overflow-hidden bg-brand-surface border border-brand-stone/60 flex flex-col shadow-sm hover:shadow-soft-elevation transition-all"
              >
                {/* Immagine Cantiere Reale */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <motion.img
                    src={mainImg}
                    alt={project.title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-brand-dark/85 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {project.category}
                  </div>
                </div>

                {/* Dettagli Progetto */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
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
                    <h3 className="text-sm font-bold text-brand-dark group-hover:text-brand-terracotta transition-colors line-clamp-2 mb-2 leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-3">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {project.surface}
                    </span>
                    <a
                      href="#preventivo"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-terracotta hover:underline"
                    >
                      <span>Richiedi simile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
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
