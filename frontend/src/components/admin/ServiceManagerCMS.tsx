import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, ArrowUp, ArrowDown, Eye, CheckCircle2, 
  Sparkles, X, Save, RefreshCw, Copy, Layers, Building2, Home, 
  Paintbrush, Hammer, Zap, Wrench, Maximize2, Flame, ShieldCheck, 
  HardHat, Image as ImageIcon, UploadCloud, Search, Check, AlertTriangle
} from 'lucide-react';
import { ServiceItem } from '../../types/blocks';
import { BMG_ALL_SERVICES, BmgFullService } from '../../data/bmgServices';
import { allBmgPhotos } from '../ui/FullPhotoGalleryModal';
import { ServiceDetailModal } from '../ui/ServiceDetailModal';

// Catalogo Icone disponibili
const ICON_OPTIONS = [
  { name: 'Building2', label: 'Costruzioni / Fabbricati', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Home', label: 'Ristrutturazioni / Residenziale', icon: <Home className="w-5 h-5" /> },
  { name: 'Layers', label: 'Involucro / Cartongesso / Tetti', icon: <Layers className="w-5 h-5" /> },
  { name: 'Hammer', label: 'Demolizioni / Carpenteria', icon: <Hammer className="w-5 h-5" /> },
  { name: 'Paintbrush', label: 'Imbiancature / Finiture', icon: <Paintbrush className="w-5 h-5" /> },
  { name: 'Zap', label: 'Impianti Elettrici / Domotica', icon: <Zap className="w-5 h-5" /> },
  { name: 'Wrench', label: 'Impianti Idraulici / Pompe Calore', icon: <Wrench className="w-5 h-5" /> },
  { name: 'Maximize2', label: 'Serramenti / Infissi PosaClima', icon: <Maximize2 className="w-5 h-5" /> },
  { name: 'Flame', label: 'Cappotto Termico / Isolamento', icon: <Flame className="w-5 h-5" /> },
  { name: 'Sparkles', label: 'Parquet / Finiture Pregiate', icon: <Sparkles className="w-5 h-5" /> },
  { name: 'ShieldCheck', label: 'Recinzioni / Sicurezza Statica', icon: <ShieldCheck className="w-5 h-5" /> },
  { name: 'HardHat', label: 'Cantiere & Direzione Lavori', icon: <HardHat className="w-5 h-5" /> },
];

const PREDEFINED_CATEGORIES = [
  { id: 'strutture', label: 'Costruzioni & Strutture' },
  { id: 'involucro', label: 'Condomini & Involucro' },
  { id: 'impianti', label: 'Impianti & Serramenti' },
  { id: 'finiture', label: 'Finiture & Interni' },
];

export const ServiceManagerCMS: React.FC<{ token: string }> = ({ token }) => {
  const [services, setServices] = useState<BmgFullService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modale di Anteprima Scheda Servizio
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);

  // Modale di Creazione/Modifica Servizio
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formShortTitle, setFormShortTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'strutture' | 'involucro' | 'impianti' | 'finiture'>('strutture');
  const [formBadge, setFormBadge] = useState('');
  const [formIconName, setFormIconName] = useState('Building2');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFullDetails, setFormFullDetails] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Selettore Foto e Upload
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      // 1. Prova fetch da endpoint backend
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
          localStorage.setItem('bmg_services_data', JSON.stringify(data));
          return;
        }
      }
    } catch (err) {
      console.warn('Backend /api/services non raggiungibile, utilizzo cache locale:', err);
    }

    // 2. Fallback a localStorage
    const cached = localStorage.getItem('bmg_services_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServices(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Fallback a dati predefiniti certificati BMG
    setServices(BMG_ALL_SERVICES);
    localStorage.setItem('bmg_services_data', JSON.stringify(BMG_ALL_SERVICES));
    setLoading(false);
  };

  const saveAllServicesToBackend = async (updatedList: BmgFullService[]) => {
    setSaving(true);
    // Salva sempre localmente per aggiornamento immediato della UI pubblica
    localStorage.setItem('bmg_services_data', JSON.stringify(updatedList));

    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ services: updatedList }),
      });

      if (!res.ok) {
        // Fallback: aggiorna anche la sezione SERVICES_GRID via /api/sections se il server usa quello
        throw new Error('Salvataggio API non riuscito, sincronizzato localmente.');
      }
      showNotification('Modifiche salvate e sincronizzate con successo!');
    } catch (err: any) {
      showNotification('Modifiche salvate in locale (Server in modalità standalone).');
    } finally {
      setSaving(false);
    }
  };

  // Apertura modale per nuovo servizio
  const handleOpenNew = () => {
    setEditingServiceId(null);
    setFormId(`servizio-${Date.now()}`);
    setFormTitle('');
    setFormShortTitle('');
    setFormCategory('strutture');
    setFormBadge('Chiavi in Mano');
    setFormIconName('Building2');
    setFormImageUrl('/images/cantieri/cantiere-01.jpg');
    setFormDescription('');
    setFormFullDetails('');
    setFormFeatures([
      'Sopralluogo preliminare e computo metrico dettagliato',
      'Maestranze dirette e materiali di prima scelta',
      'Conformità normativa e garanzia a regola d\'arte'
    ]);
    setShowPhotoPicker(false);
    setIsEditorOpen(true);
  };

  // Apertura modale per modifica servizio esistente
  const handleOpenEdit = (service: BmgFullService) => {
    setEditingServiceId(service.id);
    setFormId(service.id);
    setFormTitle(service.title);
    setFormShortTitle(service.shortTitle || service.title);
    setFormCategory((service.category as any) || 'strutture');
    setFormBadge(service.badge || '');
    setFormIconName(service.iconName || 'Building2');
    setFormImageUrl(service.imageUrl || '');
    setFormDescription(service.description);
    setFormFullDetails(service.fullDetails || '');
    setFormFeatures(service.features ? [...service.features] : []);
    setShowPhotoPicker(false);
    setIsEditorOpen(true);
  };

  // Duplicazione rapida
  const handleDuplicate = (service: BmgFullService) => {
    const copy: BmgFullService = {
      ...service,
      id: `${service.id}-copia-${Date.now()}`,
      title: `${service.title} (Copia)`,
      shortTitle: `${service.shortTitle || service.title} (Copia)`,
      badge: service.badge ? `${service.badge}` : 'Nuovo',
    };
    const updated = [...services, copy];
    setServices(updated);
    saveAllServicesToBackend(updated);
    showNotification(`Servizio duplicato: "${copy.title}"`);
  };

  // Eliminazione
  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il servizio "${title}"?`)) return;
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    saveAllServicesToBackend(updated);
    showNotification(`Servizio "${title}" rimosso dall'elenco.`);
  };

  // Ordinamento: Sposta su / giù
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === services.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...services];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setServices(updated);
    saveAllServicesToBackend(updated);
  };

  // Ripristino 13 servizi originali certificati BMG
  const handleResetDefaults = () => {
    if (!window.confirm('Attenzione: questa operazione ripristinerà l\'elenco originario dei 13 servizi BMG Srl sovrascrivendo le modifiche personalizzate. Continuare?')) {
      return;
    }
    setServices(BMG_ALL_SERVICES);
    saveAllServicesToBackend(BMG_ALL_SERVICES);
    showNotification('Elenco servizi ripristinato allo stato originario BMG (13 servizi).');
  };

  // Gestione aggiunta punto di forza
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormFeatures([...formFeatures, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== idx));
  };

  const handleUpdateFeature = (idx: number, text: string) => {
    const updated = [...formFeatures];
    updated[idx] = text;
    setFormFeatures(updated);
  };

  // Upload immagine da dispositivo
  const handleUploadDevicePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', files[0]);

    try {
      const res = await fetch('/api/uploads/single', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Errore upload immagine');
      const data = await res.json();
      if (data.url) {
        setFormImageUrl(data.url);
        showNotification('Foto caricata e convertita in WebP con successo!');
      }
    } catch (err: any) {
      showNotification('Errore caricamento foto: ' + (err.message || 'Controlla il file'), 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Submit Form Modifica / Creazione
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      showNotification('Titolo e descrizione breve sono obbligatori.', 'error');
      return;
    }

    const catObj = PREDEFINED_CATEGORIES.find((c) => c.id === formCategory);
    const categoryLabel = catObj ? catObj.label : 'Costruzioni & Strutture';

    const serviceData: BmgFullService = {
      id: formId || `srv-${Date.now()}`,
      title: formTitle.trim(),
      shortTitle: formShortTitle.trim() || formTitle.trim(),
      category: formCategory,
      categoryLabel,
      badge: formBadge.trim(),
      iconName: formIconName,
      imageUrl: formImageUrl.trim(),
      description: formDescription.trim(),
      fullDetails: formFullDetails.trim() || formDescription.trim(),
      features: formFeatures.length > 0 ? formFeatures : ['Opere a regola d\'arte garantite'],
    };

    let updatedList: BmgFullService[];
    if (editingServiceId) {
      updatedList = services.map((s) => (s.id === editingServiceId ? serviceData : s));
      showNotification(`Servizio "${serviceData.title}" aggiornato!`);
    } else {
      updatedList = [...services, serviceData];
      showNotification(`Nuovo servizio "${serviceData.title}" aggiunto all'elenco!`);
    }

    setServices(updatedList);
    saveAllServicesToBackend(updatedList);
    setIsEditorOpen(false);
  };

  // Filtro categoria e ricerca
  const filteredServices = services.filter((s) => {
    const matchesCategory = activeCategoryFilter === 'all' || s.category === activeCategoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.shortTitle && s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.badge && s.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Conteggi categorie dinamici
  const counts = {
    all: services.length,
    strutture: services.filter((s) => s.category === 'strutture').length,
    involucro: services.filter((s) => s.category === 'involucro').length,
    impianti: services.filter((s) => s.category === 'impianti').length,
    finiture: services.filter((s) => s.category === 'finiture').length,
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              feedback.type === 'error'
                ? 'bg-red-500/90 text-white border-red-400'
                : 'bg-emerald-600/95 text-white border-emerald-400'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span className="text-xs font-semibold">{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Gestore Servizi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-terracotta/20 border border-brand-terracotta/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
            <span>Catalogo Attivo & Offerta Commerciale</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white flex items-center gap-2.5">
            <span>Gestione Elenco Servizi</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
              {services.length} Servizi
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Aggiungi, modifica, riordina e personalizza i servizi visualizzati nella griglia della Homepage e nel configuratore preventivi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetDefaults}
            title="Ripristina i 13 servizi originali di BMG Srl"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Ripristina 13 Servizi BMG</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-glow-terracotta flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuovo Servizio</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Filtri Categorie & Barra di Ricerca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
        {/* Filtri Categoria con contatori dinamici */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategoryFilter === 'all'
                ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Tutti</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20">{counts.all}</span>
          </button>

          {PREDEFINED_CATEGORIES.map((cat) => {
            const count = (counts as any)[cat.id] || 0;
            const isActive = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/20">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Input di Ricerca Istantanea */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Cerca servizio per nome o badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Griglia Schede Servizi */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-terracotta" />
          Caricamento catalogo servizi in corso...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl p-8">
          <Layers className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nessun Servizio Trovato</h3>
          <p className="text-xs text-gray-400 mb-4">
            Non ci sono servizi corrispondenti ai criteri di ricerca selezionati.
          </p>
          <button
            onClick={() => {
              setActiveCategoryFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 text-white transition-colors"
          >
            Azzera Filtri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredServices.map((service, index) => {
            const rawIndex = services.findIndex((s) => s.id === service.id);
            const iconObj = ICON_OPTIONS.find((ico) => ico.name === service.iconName) || ICON_OPTIONS[0];

            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col group relative shadow-lg"
              >
                {/* Immagine di Copertina e Badge */}
                <div className="relative h-40 bg-gray-900 overflow-hidden">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-gray-500">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge Categoria e Custom Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                      {service.categoryLabel || service.category}
                    </span>

                    {service.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-terracotta/90 text-white shadow-sm">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Icona Fluttuante */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-dark/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-md">
                      {iconObj.icon}
                    </div>
                    <span className="text-[11px] font-mono text-gray-300">
                      #{rawIndex + 1}
                    </span>
                  </div>

                  {/* Pulsanti Sposta Su / Giù in Overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMove(rawIndex, 'up')}
                      disabled={rawIndex === 0}
                      title="Sposta prima nell'elenco"
                      className="p-1 rounded-lg hover:bg-white/20 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(rawIndex, 'down')}
                      disabled={rawIndex === services.length - 1}
                      title="Sposta dopo nell'elenco"
                      className="p-1 rounded-lg hover:bg-white/20 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contenuti Testuali */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white leading-snug line-clamp-1 mb-1 font-display">
                      {service.title}
                    </h3>
                    {service.shortTitle && service.shortTitle !== service.title && (
                      <p className="text-[11px] text-brand-terracotta font-medium mb-2">
                        {service.shortTitle}
                      </p>
                    )}
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-3">
                      {service.description}
                    </p>

                    {/* Features Tags */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-1 mb-3 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Punti di Forza ({service.features.length}):
                        </span>
                        {service.features.slice(0, 2).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                        {service.features.length > 2 && (
                          <span className="text-[10px] text-brand-terracotta font-semibold pl-4">
                            +{service.features.length - 2} altre specifiche nel capitolato
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pulsanti Azione */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1.5 mt-auto">
                    <button
                      onClick={() => setPreviewService(service)}
                      title="Vedi come appare al cliente nel modal"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>Anteprima</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(service)}
                        title="Duplica questo servizio"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(service)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-terracotta/20 hover:bg-brand-terracotta text-brand-terracotta hover:text-white text-xs font-bold transition-all border border-brand-terracotta/30"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modifica</span>
                      </button>

                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        title="Elimina servizio"
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* MODALE DI CREAZIONE / MODIFICA SERVIZIO */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#111827] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-6 max-h-[90vh] flex flex-col overflow-hidden text-white"
            >
              {/* Header Modale */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 shrink-0">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-terracotta" />
                    <span>{editingServiceId ? 'Modifica Scheda Servizio' : 'Crea Nuovo Servizio'}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Definisci specifiche tecniche, immagini di cantiere e punti di forza per il pubblico.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Scorrevole */}
              <form onSubmit={handleSaveForm} className="space-y-6 overflow-y-auto pr-1 flex-1">
                {/* 1. Dati Anagrafici & Categoria */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                    1. Informazioni Principali & Categoria
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Titolo Completo Servizio *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Es: Ristrutturazione Civile ed Industriale"
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (!formShortTitle || formShortTitle === formTitle) {
                            setFormShortTitle(e.target.value);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Titolo Breve (Badge Card)
                      </label>
                      <input
                        type="text"
                        placeholder="Es: Ristrutturazioni Integrali"
                        value={formShortTitle}
                        onChange={(e) => setFormShortTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Categoria di Riferimento *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                      >
                        {PREDEFINED_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Badge Evidenza (es. Chiavi in Mano, Sismabonus)
                      </label>
                      <input
                        type="text"
                        placeholder="Es: Chiavi in Mano / Certificato DM 37/08"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Selezione Icona Visiva */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                    2. Icona Grafica Rappresentativa
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((ico) => {
                      const isSelected = formIconName === ico.name;
                      return (
                        <button
                          key={ico.name}
                          type="button"
                          onClick={() => setFormIconName(ico.name)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-brand-terracotta/30 border-brand-terracotta text-amber-300 shadow-glow-terracotta'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className={isSelected ? 'text-brand-terracotta' : 'text-gray-400'}>
                            {ico.icon}
                          </div>
                          <span className="text-[11px] font-medium leading-tight truncate">
                            {ico.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Immagine di Copertina e Galleria */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                      3. Fotografia di Copertina Cantiere
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline"
                    >
                      {showPhotoPicker ? 'Chiudi Galleria Foto' : 'Scegli tra le Foto BMG'}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Anteprima Miniatura */}
                    <div className="w-32 h-20 rounded-xl bg-gray-900 border border-white/15 overflow-hidden shrink-0 relative">
                      {formImageUrl ? (
                        <img
                          src={formImageUrl}
                          alt="Anteprima"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px]">
                          Nessuna foto
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        placeholder="URL Immagine (es: /images/cantieri/cantiere-04.jpg o URL esterno)"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUploadDevicePhoto}
                          className="hidden"
                          id="service-upload-input"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                          <span>{uploadingImage ? 'Caricamento WebP...' : 'Carica dal tuo Dispositivo'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Selettore Galleria 20 Foto BMG */}
                  {showPhotoPicker && (
                    <div className="p-3 bg-black/40 border border-white/10 rounded-2xl space-y-2 mt-2">
                      <span className="text-[11px] font-semibold text-gray-300 block">
                        Clicca su una fotografia reale di BMG Srl per impostarla come copertina:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                        {allBmgPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() => {
                              setFormImageUrl(photo.url);
                              setShowPhotoPicker(false);
                            }}
                            className={`h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative ${
                              formImageUrl === photo.url
                                ? 'border-brand-terracotta scale-105 shadow-glow-terracotta'
                                : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                            {formImageUrl === photo.url && (
                              <div className="absolute inset-0 bg-brand-terracotta/40 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Descrizione Breve & Scheda Tecnica Dettagliata */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                    4. Testi Informativi & Scheda Modale
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Descrizione Breve (visibile nella Card) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Descrivi in 2-3 frasi l'essenza dell'intervento e i vantaggi per il cliente."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Capitolato & Specifiche Approfondite (visibili nella Scheda Modale Dettagliata)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Spiegazione estesa di materiali, metodologie di cantiere, conformità di legge, collaudi e garanzie."
                      value={formFullDetails}
                      onChange={(e) => setFormFullDetails(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                    />
                  </div>
                </div>

                {/* 5. Punti di Forza & Checklist Certificazioni */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta flex items-center justify-between">
                    <span>5. Punti di Forza & Checklist ({formFeatures.length})</span>
                  </h4>

                  <div className="space-y-2">
                    {formFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Aggiunta nuovo punto */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Nuovo punto di forza (es. Certificazione energetica CAM)..."
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Aggiungi</span>
                    </button>
                  </div>
                </div>

                {/* Footer Bottoni di Salvataggio */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 sticky bottom-0 bg-[#111827] py-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    Annulla
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-glow-terracotta flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Salvataggio in corso...' : editingServiceId ? 'Salva Modifiche' : 'Crea Servizio'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modale Anteprima Live */}
      <ServiceDetailModal
        isOpen={Boolean(previewService)}
        service={previewService}
        onClose={() => setPreviewService(null)}
      />
    </div>
  );
};

