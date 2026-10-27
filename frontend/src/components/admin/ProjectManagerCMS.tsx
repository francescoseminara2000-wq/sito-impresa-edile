import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, CheckCircle2, Image as ImageIcon, 
  MapPin, Calendar, Building, Sparkles, X, Save, Eye, Layers 
} from 'lucide-react';
import { allBmgPhotos } from '../ui/FullPhotoGalleryModal';

interface ProjectImageItem {
  id?: string;
  url: string;
  caption?: string;
  order: number;
  isBefore: boolean;
  isAfter: boolean;
  compareGroup?: string | null;
}

interface ProjectData {
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
  isFeatured: boolean;
  order: number;
  images: ProjectImageItem[];
}

export const ProjectManagerCMS: React.FC<{ token: string }> = ({ token }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Ristrutturazione');
  const [location, setLocation] = useState('Monza e Brianza');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [surface, setSurface] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<ProjectImageItem[]>([]);

  const categories = [
    'Costruzioni & Strutture',
    'Ristrutturazioni & Interni',
    'Facciate & Cappotti',
    'Finiture, Cartongesso & Parquet',
    'Manutenzione Condomini',
    'Impianti Tecnologici',
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNewForm = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setCategory(categories[0]);
    setLocation('Caponago (MB)');
    setYear(new Date().getFullYear());
    setSurface('120 mq');
    setClient('Privato');
    setDescription('');
    setHighlightsText('Opere murarie e demolizioni\nRifacimento impianto elettrico ed idraulico\nPosa parquet e tinteggiature');
    setIsFeatured(true);
    setImages([
      { url: '/images/cantieri/cantiere-06.jpg', order: 0, isBefore: false, isAfter: true, caption: 'Lavori ultimati' },
      { url: '/images/cantieri/cantiere-03.jpg', order: 1, isBefore: true, isAfter: false, caption: 'Stato iniziale cantiere' },
    ]);
    setIsFormOpen(true);
  };

  const openEditForm = (proj: ProjectData) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setSlug(proj.slug);
    setCategory(proj.category);
    setLocation(proj.location);
    setYear(proj.year || new Date().getFullYear());
    setSurface(proj.surface || '');
    setClient(proj.client || '');
    setDescription(proj.description || '');
    setHighlightsText((proj.highlights || []).join('\n'));
    setIsFeatured(proj.isFeatured);
    setImages(proj.images || []);
    setIsFormOpen(true);
  };

  const addPhotoToProject = (url: string) => {
    if (images.some((img) => img.url === url)) return;
    setImages((prev) => [
      ...prev,
      { url, order: prev.length, isBefore: false, isAfter: false, caption: '' },
    ]);
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const toggleImageRole = (index: number, role: 'before' | 'after') => {
    setImages((prev) =>
      prev.map((img, idx) => {
        if (idx === index) {
          if (role === 'before') {
            return { ...img, isBefore: !img.isBefore, isAfter: false };
          } else {
            return { ...img, isAfter: !img.isAfter, isBefore: false };
          }
        }
        // Se impostiamo una nuova foto prima o dopo, disattiviamo le altre per evitare conflitti
        return img;
      })
    );
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showFeedback('Titolo e descrizione sono obbligatori.', 'error');
      return;
    }

    setSaving(true);
    const highlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const payload = {
      title,
      slug: generatedSlug,
      category,
      location,
      year: Number(year) || undefined,
      surface,
      client,
      description,
      highlights,
      isFeatured,
      order: 0,
      images,
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore durante il salvataggio.');
      }

      showFeedback(editingProject ? 'Cantiere aggiornato con successo!' : 'Nuovo cantiere aggiunto al portfolio!');
      setIsFormOpen(false);
      await loadProjects();
    } catch (err: any) {
      showFeedback(err.message || 'Errore salvataggio cantiere.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Sei sicuro di voler eliminare la scheda "${name}"?`)) return;

    try {
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      showFeedback(`Scheda "${name}" rimossa.`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      showFeedback('Errore eliminazione cantiere', 'error');
    }
  };

  const seedDefaultProjects = async () => {
    setLoading(true);
    const defaults = [
      {
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
        isFeatured: true,
        order: 1,
        images: [
          { url: '/images/cantieri/cantiere-10.jpg', caption: 'Opere strutturali e armatura ferro in cantiere', order: 0, isBefore: false, isAfter: false },
          { url: '/images/cantieri/cantiere-01.jpg', caption: 'Fasi iniziali di cantiere e movimentazione terra', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-03.jpg', caption: 'Posa blocchi e murature portanti', order: 2, isBefore: false, isAfter: false },
          { url: '/images/cantieri/cantiere-07.jpg', caption: 'Dettaglio casseratura e getto completato', order: 3, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: true,
        order: 2,
        images: [
          { url: '/images/cantieri/cantiere-06.jpg', caption: 'Zona living in fase di completamento impianti', order: 0, isBefore: false, isAfter: false },
          { url: '/images/cantieri/cantiere-04.jpg', caption: 'Stato iniziale pre-demolizione e rimozione rivestimenti', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-05.jpg', caption: 'Tracciati impiantistici e posa corrugati a pavimento', order: 2, isBefore: false, isAfter: false },
          { url: '/images/cantieri/cantiere-09.jpg', caption: 'Rifacimento massetto a consistenza terra umida', order: 3, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: true,
        order: 3,
        images: [
          { url: '/images/cantieri/cantiere-12.jpg', caption: 'Facciata esterna con isolamento a cappotto completato', order: 0, isBefore: false, isAfter: true },
          { url: '/images/cantieri/cantiere-11.jpg', caption: 'Ponteggio e stato facciata prima dell\'intervento', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-13.jpg', caption: 'Fase di tassellatura e rasatura armata dei pannelli', order: 2, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: true,
        order: 4,
        images: [
          { url: '/images/cantieri/cantiere-16.jpg', caption: 'Controsoffitto con gole di luce e veletta curva', order: 0, isBefore: false, isAfter: true },
          { url: '/images/cantieri/cantiere-15.jpg', caption: 'Struttura metallica portante e orditura sospesa', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-17.jpg', caption: 'Stuccatura giunti e carteggiatura di precisione', order: 2, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: true,
        order: 5,
        images: [
          { url: '/images/cantieri/cantiere-18.jpg', caption: 'Parquet levigato e protetto con trattamento opaco', order: 0, isBefore: false, isAfter: true },
          { url: '/images/cantieri/cantiere-19.jpg', caption: 'Superficie lignea usurata prima del trattamento', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-20.jpg', caption: 'Dettaglio posa a spina di pesce italiana', order: 2, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: false,
        order: 6,
        images: [
          { url: '/images/cantieri/cantiere-02.jpg', caption: 'Posa recinzione e cordolo perimetrale ultimato', order: 0, isBefore: false, isAfter: false },
          { url: '/images/cantieri/cantiere-08.jpg', caption: 'Preparazione terreno e armature in ferro', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-14.jpg', caption: 'Getto calcestruzzo con autobetoniera', order: 2, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: false,
        order: 7,
        images: [
          { url: '/images/cantieri/cantiere-08.jpg', caption: 'Impianti idraulici e passaggi tecnologici a parete', order: 0, isBefore: false, isAfter: false },
          { url: '/images/cantieri/cantiere-05.jpg', caption: 'Sostituzione tubazioni ammalorate', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-06.jpg', caption: 'Chiusura cavedii e ripristino intonaci', order: 2, isBefore: false, isAfter: false }
        ],
      },
      {
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
        isFeatured: false,
        order: 8,
        images: [
          { url: '/images/cantieri/cantiere-14.jpg', caption: 'Posa serramenti completata e finitura pareti', order: 0, isBefore: false, isAfter: true },
          { url: '/images/cantieri/cantiere-07.jpg', caption: 'Stato pre-posa con vecchi infissi degradati', order: 1, isBefore: true, isAfter: false },
          { url: '/images/cantieri/cantiere-16.jpg', caption: 'Sigillatura termoacustica dei controtelai', order: 2, isBefore: false, isAfter: false }
        ],
      },
    ];

    try {
      for (const p of defaults) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(p),
        });
      }
      showFeedback('Cantieri di base caricati con successo nel database!');
      await loadProjects();
    } catch (err: any) {
      showFeedback('Errore nel caricamento: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intestazione Sezione & Tasto Aggiungi */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Portfolio Cantieri & Lavori Realizzati</span>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-terracotta/20 text-brand-terracotta font-mono font-bold">
              {projects.length} Schede
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Gestisci le schede dei cantieri, aggiungi più foto per ciascun lavoro e imposta i confronti Prima / Dopo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {projects.length === 0 && (
            <button
              onClick={seedDefaultProjects}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4 text-brand-terracotta" />
              <span>Inizializza 8 Cantieri</span>
            </button>
          )}

          <button
            onClick={openNewForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Cantiere</span>
          </button>
        </div>
      </div>

      {/* Griglia Schede Cantieri */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Caricamento cantieri...</div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 p-8">
          <Building className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white">Nessun cantiere salvato nel Database</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-5">
            Puoi inserire un cantiere manualmente oppure caricare subito nel database gli 8 cantieri iniziali corredati di foto reali e specifiche tecniche.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={seedDefaultProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Carica 8 Cantieri Demo con Foto Reali</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const mainImg = proj.images?.[0]?.url || '/images/cantieri/cantiere-10.jpg';
            const beforeImg = proj.images?.find((i) => i.isBefore);
            const afterImg = proj.images?.find((i) => i.isAfter);

            return (
              <div
                key={proj.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-terracotta/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Foto con Badge */}
                  <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
                    <img src={mainImg} alt={proj.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white uppercase">
                        {proj.category}
                      </span>
                      {proj.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-black">
                          ★ In Evidenza
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/70 text-gray-300 font-mono">
                      📷 {proj.images?.length || 0} Foto
                    </span>
                  </div>

                  {/* Info Cantiere */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-terracotta" /> {proj.location}
                      </span>
                      {proj.year && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-terracotta" /> {proj.year}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white line-clamp-1">{proj.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Indicatori Prima / Dopo */}
                    {beforeImg && afterImg && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          ✓ Slider Prima/Dopo attivo
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pulsanti Azione */}
                <div className="p-4 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
                  <span className="text-[11px] text-gray-500 font-mono">/{proj.slug}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(proj)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Modifica Cantiere"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifica</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FORM CREA / MODIFICA CANTIERE */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-brand-dark border border-white/15 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingProject ? 'Modifica Cantiere' : 'Nuova Scheda Cantiere'}
                  </h3>
                  <p className="text-xs text-gray-400">Compila i dettagli del lavoro svolto da BMG Srl</p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-6">
                
                {/* 1. Dati Principali */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo dell'Opera *</label>
                    <input
                      type="text"
                      required
                      placeholder="es. Ristrutturazione Completa Villa e Cappotto"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">Categoria Lavoro</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-dark border border-white/15 text-white font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">Località / Città</label>
                    <input
                      type="text"
                      placeholder="es. Caponago (MB)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">Anno</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">Superficie / Dimensioni</label>
                    <input
                      type="text"
                      placeholder="es. 150 mq"
                      value={surface}
                      onChange={(e) => setSurface(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white"
                    />
                  </div>
                </div>

                {/* 2. Descrizione & Highlights */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">Descrizione Dettagliata dell'Intervento *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Descrivi le fasi dell'opera: demolizioni, posa impianti a pavimento, cartongesso, cappotto esterno, ecc..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase text-gray-300 mb-1">
                      Punti Chiave / Opere Eseguite (1 per riga)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Demolizione e rifacimento totale bagni&#10;Impianto elettrico e idraulico certificato&#10;Posa parquet a spina di pesce"
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-mono text-xs resize-none"
                    />
                  </div>
                </div>

                {/* 3. Gestione Galleria Fotografica del Cantiere */}
                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold uppercase text-brand-terracotta block">
                        Galleria Fotografica del Cantiere ({images.length} Foto)
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Clicca su una foto della libreria in basso per aggiungerla a questo cantiere
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded accent-brand-terracotta w-4 h-4"
                      />
                      <span className="font-bold">Metti in Evidenza in Homepage</span>
                    </label>
                  </div>

                  {/* Foto Assegnate a questo Cantiere */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10 p-2 space-y-2">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black relative">
                            <img src={img.url} alt="cantiere" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                              title="Rimuovi da questo cantiere"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Selettori PRIMA / DOPO */}
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => toggleImageRole(idx, 'before')}
                              className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                img.isBefore ? 'bg-amber-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              Prima
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleImageRole(idx, 'after')}
                              className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                img.isAfter ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                              }`}
                            >
                              Dopo
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selettore Rapido dalle 20 Foto Caricate */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-gray-400 mb-2">
                      Aggiungi foto da quelle caricate:
                    </span>
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {allBmgPhotos.map((p) => {
                        const isAdded = images.some((img) => img.url === p.url);
                        return (
                          <div
                            key={p.id}
                            onClick={() => !isAdded && addPhotoToProject(p.url)}
                            className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border cursor-pointer transition-all ${
                              isAdded
                                ? 'opacity-30 border-gray-600 pointer-events-none'
                                : 'border-white/20 hover:border-brand-terracotta hover:scale-105'
                            }`}
                          >
                            <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                            {isAdded && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                                Aggiunta
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Pulsante Salvataggio */}
                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Salvataggio...' : 'Salva Cantiere'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
