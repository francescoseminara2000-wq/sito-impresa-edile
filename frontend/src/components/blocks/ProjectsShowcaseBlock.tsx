import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight, Hammer, Eye, Sparkles } from 'lucide-react';
import { ProjectDetailModal, ProjectDetailData } from '../ui/ProjectDetailModal';

export const ProjectsShowcaseBlock: React.FC<{ content?: any }> = ({ content }) => {
  const [projects, setProjects] = useState<ProjectDetailData[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetailData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [categories, setCategories] = useState<string[]>([
    'Tutti',
    'Costruzioni & Strutture',
    'Ristrutturazioni & Interni',
    'Facciate & Cappotti',
    'Finiture, Cartongesso & Parquet',
  ]);

  // Lista progetti predefinita con set completo di foto reali cantieri BMG Srl
  const initialProjects: ProjectDetailData[] = [
    {
      id: '1',
      slug: 'costruzione-strutturale-monza',
      title: 'Nuova Costruzione e Interventi Strutturali in Cemento Armato',
      category: 'Costruzioni & Strutture',
      location: 'Monza e Brianza',
      year: 2024,
      surface: 'Intervento Strutturale',
      client: 'Privato / Residenziale',
      description: 'Esecuzione completa di opere strutturali in cemento armato antisismico, casseforme, gettate di fondazione, solai e cordoli certificati. Direzione tecnica dei lavori di cantiere e collaudo statico.',
      highlights: [
        'Strutture in cemento armato ad alte prestazioni',
        'Gettate di fondazione con platea continua',
        'Carpenteria specializzata e ferro d\'armatura B450C',
        'Isolamento e impermeabilizzazione contro terra'
      ],
      images: [
        { url: '/images/cantieri/cantiere-10.jpg', caption: 'Opere strutturali e armatura ferro in cantiere', isBefore: false },
        { url: '/images/cantieri/cantiere-01.jpg', caption: 'Fasi iniziali di cantiere e movimentazione terra', isBefore: true },
        { url: '/images/cantieri/cantiere-03.jpg', caption: 'Posa blocchi e murature portanti', isBefore: false },
        { url: '/images/cantieri/cantiere-07.jpg', caption: 'Dettaglio casseratura e getto completato', isBefore: false }
      ],
    },
    {
      id: '2',
      slug: 'ristrutturazione-interni-chiavi-in-mano',
      title: 'Ristrutturazione Completa con Demolizioni e Nuova Distribuzione',
      category: 'Ristrutturazioni & Interni',
      location: 'Milano e Provincia',
      year: 2024,
      surface: '160 mq',
      client: 'Appartamento Residenziale',
      description: 'Demolizione integrale di tramezzature interne, rifacimento massetti alleggeriti, installazione nuovi impianti idrico-sanitari ed elettrici a norma, ridistribuzione moderna degli spazi open-space.',
      highlights: [
        'Demolizione e smaltimento macerie a norma di legge',
        'Nuova distribuzione architettonica open-space',
        'Impianti idraulici ed elettrici certificati',
        'Finiture rasate e predisposizione clima canalizzato'
      ],
      images: [
        { url: '/images/cantieri/cantiere-06.jpg', caption: 'Zona living in fase di completamento impianti', isBefore: false },
        { url: '/images/cantieri/cantiere-04.jpg', caption: 'Stato iniziale pre-demolizione e rimozione rivestimenti', isBefore: true },
        { url: '/images/cantieri/cantiere-05.jpg', caption: 'Tracciati impiantistici e posa corrugati a pavimento', isBefore: false },
        { url: '/images/cantieri/cantiere-09.jpg', caption: 'Rifacimento massetto a consistenza terra umida', isBefore: false }
      ],
    },
    {
      id: '3',
      slug: 'cappotto-termico-facciata',
      title: 'Isolamento a Cappotto Termico e Risanamento Facciate Esterne',
      category: 'Facciate & Cappotti',
      location: 'Caponago (MB)',
      year: 2024,
      surface: 'Efficientamento Energetico',
      client: 'Condominio Residenziale',
      description: 'Posa cappotto termico con pannelli EPS con grafite certificati CAM, rasatura armata con doppia rete in fibra di vetro, intonachino silossanico idrorepellente traspirante ad alta resistenza climatica.',
      highlights: [
        'Pannelli isolanti EPS con grafite ad alta efficienza',
        'Doppia rete in fibra di vetro antifessurazione',
        'Finitura a spessore silossanica autopulente',
        'Eliminazione totale dei ponti termici su balconi e davanzali'
      ],
      images: [
        { url: '/images/cantieri/cantiere-12.jpg', caption: 'Facciata esterna con isolamento a cappotto completato', isAfter: true },
        { url: '/images/cantieri/cantiere-11.jpg', caption: 'Ponteggio e stato facciata prima dell\'intervento', isBefore: true },
        { url: '/images/cantieri/cantiere-13.jpg', caption: 'Fase di tassellatura e rasatura armata dei pannelli', isBefore: false }
      ],
    },
    {
      id: '4',
      slug: 'cartongesso-design-velette',
      title: 'Opere in Cartongesso, Controsoffitti e Illuminotecnica Integrata',
      category: 'Finiture, Cartongesso & Parquet',
      location: 'Monza e Brianza',
      year: 2024,
      surface: 'Design d\'Interni',
      client: 'Villa Unifamiliare',
      description: 'Realizzazione di controsoffittature di design su più livelli, velette perimetrali a luce indiretta LED, pareti divisorie acustiche con lana di roccia ad alta densità e porte a scomparsa filomuro.',
      highlights: [
        'Velette architettoniche per strip LED continue',
        'Controsoffitti con isolamento acustico integrato',
        'Stuccatura livello Q4 per superfici perfettamente complanari',
        'Pareti a doppio strato con lastre ad alta resistenza'
      ],
      images: [
        { url: '/images/cantieri/cantiere-16.jpg', caption: 'Controsoffitto con gole di luce e veletta curva', isAfter: true },
        { url: '/images/cantieri/cantiere-15.jpg', caption: 'Struttura metallica portante e orditura sospesa', isBefore: true },
        { url: '/images/cantieri/cantiere-17.jpg', caption: 'Stuccatura giunti e carteggiatura di precisione', isBefore: false }
      ],
    },
    {
      id: '5',
      slug: 'posa-levigatura-parquet',
      title: 'Posa, Trattamento e Levigatura Professionale Pavimentazioni in Parquet',
      category: 'Finiture, Cartongesso & Parquet',
      location: 'Lombardia',
      year: 2023,
      surface: 'Pavimentazione di Pregio',
      client: 'Residenza Privata',
      description: 'Intervento di ripristino conservativo e levigatura diamantata su parquet in legno massello, stuccatura con polvere di legno e finitura ecologica all\'acqua opaca ad alta resistenza al calpestio.',
      highlights: [
        'Levigatura con macchinari aspiranti antipolvere',
        'Stuccatura fessure con legante naturale',
        'Verniciatura ecologica opaca all\'acqua a zero VOC',
        'Posa battiscopa coordinato filomuro'
      ],
      images: [
        { url: '/images/cantieri/cantiere-18.jpg', caption: 'Parquet levigato e protetto con trattamento opaco', isAfter: true },
        { url: '/images/cantieri/cantiere-19.jpg', caption: 'Superficie lignea usurata prima del trattamento', isBefore: true },
        { url: '/images/cantieri/cantiere-20.jpg', caption: 'Dettaglio posa a spina di pesce italiana', isBefore: false }
      ],
    },
    {
      id: '6',
      slug: 'recinzioni-opere-esterne',
      title: 'Realizzazione Muri di Cinta, Recinzioni Perimetrali e Pavimentazioni',
      category: 'Costruzioni & Strutture',
      location: 'Caponago e limitrofi',
      year: 2023,
      surface: 'Opere Esterne',
      client: 'Complesso Industriale e Civile',
      description: 'Scavi perimetrali con miniescavatore, gettata di cordoli in calcestruzzo armato con fondazione antigelo, posa recinzioni metalliche zincate a caldo e cancelli carrabili motorizzati.',
      highlights: [
        'Cordoli in c.a. con armatura continua anti-cedimento',
        'Posa recinzioni zincate e verniciate a polveri',
        'Predisposizioni passacavi per automazione e fotocellule',
        'Coprimuro e gocciolatoio in pietra naturale'
      ],
      images: [
        { url: '/images/cantieri/cantiere-02.jpg', caption: 'Posa recinzione e cordolo perimetrale ultimato', isBefore: false },
        { url: '/images/cantieri/cantiere-08.jpg', caption: 'Preparazione terreno e armature in ferro', isBefore: true },
        { url: '/images/cantieri/cantiere-14.jpg', caption: 'Getto calcestruzzo con autobetoniera', isBefore: false }
      ],
    },
    {
      id: '7',
      slug: 'impianti-tecnologici-condominio',
      title: 'Manutenzione Condominiale e Rifacimento Impianti Tecnologici',
      category: 'Ristrutturazioni & Interni',
      location: 'Monza Brianza',
      year: 2024,
      surface: 'Opere Condominiali',
      client: 'Amministrazione di Condominio',
      description: 'Rifacimento completo delle colonne di scarico insonorizzate, montanti idriche, manutenzione scale, tinteggiature lavabili ad alta resistenza e adeguamento impianto elettrico delle parti comuni.',
      highlights: [
        'Sostituzione colonne di scarico con tubazioni fonoassorbenti',
        'Tinteggiature professionali scale e androni condominiali',
        'Pronto intervento manutentivo programmato',
        'Certificazioni di conformità rilasciate a fine cantiere'
      ],
      images: [
        { url: '/images/cantieri/cantiere-08.jpg', caption: 'Impianti idraulici e passaggi tecnologici a parete', isBefore: false },
        { url: '/images/cantieri/cantiere-05.jpg', caption: 'Sostituzione tubazioni ammalorate', isBefore: true },
        { url: '/images/cantieri/cantiere-06.jpg', caption: 'Chiusura cavedii e ripristino intonaci', isBefore: false }
      ],
    },
    {
      id: '8',
      slug: 'serramenti-imbiancature',
      title: 'Fornitura e Posa Serramenti ad Alto Isolamento & Imbiancature',
      category: 'Finiture, Cartongesso & Parquet',
      location: 'Milano',
      year: 2024,
      surface: 'Finiture Chiavi in Mano',
      client: 'Residenza Privata',
      description: 'Installazione infissi a taglio termico triplo vetro con posa certificata Posi-Clima, tapparelle motorizzate in alluminio coibentato e imbiancatura interna con smalti ecologici vellutati.',
      highlights: [
        'Infissi PVC / Alluminio ad alto abbattimento acustico (42dB)',
        'Posa certificata secondo norma UNI 11673-1',
        'Cassonetti monoblocco a scomparsa coibentati',
        'Tinteggiatura con pittura antimuffa e traspirante'
      ],
      images: [
        { url: '/images/cantieri/cantiere-14.jpg', caption: 'Posa serramenti completata e finitura pareti', isAfter: true },
        { url: '/images/cantieri/cantiere-07.jpg', caption: 'Stato pre-posa con vecchi infissi degradati', isBefore: true },
        { url: '/images/cantieri/cantiere-16.jpg', caption: 'Sigillatura termoacustica dei controtelai', isBefore: false }
      ],
    },
  ];

  useEffect(() => {
    // Prova a caricare i progetti dinamici dal backend
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
            
            // Aggiorna categorie se ce ne sono di nuove
            const uniqueCats = Array.from(new Set(['Tutti', ...data.map((d: any) => d.category)]));
            setCategories(uniqueCats);
            return;
          }
        }
      } catch (err) {
        // Fallback silenzioso se offline o API non ancora popolata con DB
      }
      setProjects(initialProjects);
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    selectedCategory === 'Tutti'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="cantieri" className="py-24 bg-white text-brand-dark relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Intestazione e Categorie */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-terracotta" />
              <span>Opere Reali Documentate e Gestite da CMS</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-brand-dark">
              Cantieri e Realizzazioni BMG Srl
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              Clicca su qualunque cantiere per aprire la <strong>scheda tecnica completa</strong>, la galleria con foto in alta definizione e i confronti Prima/Dopo.
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
            const mainImg = project.images?.[0]?.url || '/images/cantieri/cantiere-10.jpg';
            const imgCount = project.images ? project.images.length : 1;
            const hasBefore = project.images?.some((img) => img.isBefore);

            return (
              <motion.article
                key={project.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-2xl overflow-hidden bg-brand-surface border border-brand-stone/60 flex flex-col shadow-sm hover:shadow-soft-elevation hover:border-brand-terracotta/40 transition-all cursor-pointer"
              >
                {/* Immagine Cantiere Reale */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <motion.img
                    src={mainImg}
                    alt={project.title}
                    whileHover={{ scale: 1.07 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Badge Categoria */}
                  <div className="absolute top-3 left-3 bg-brand-dark/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {project.category}
                  </div>

                  {/* Badge Conteggio Foto / Prima Dopo */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    {hasBefore && (
                      <span className="bg-brand-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        Prima/Dopo
                      </span>
                    )}
                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                      📷 {imgCount} foto
                    </span>
                  </div>

                  {/* Hover Overlay con pulsante Apri Scheda */}
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-brand-dark text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>Vedi Scheda & Foto</span>
                    </span>
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
                      {project.surface || 'Intervento Specializzato'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-terracotta hover:underline"
                    >
                      <span>Dettagli</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Modal Scheda Dettaglio Cantiere */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
