import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Edit3, 
  Save, CheckCircle2, Layout, Layers, Image as ImageIcon,
  HelpCircle, MessageSquare, BarChart3, Columns, X, RefreshCw, Sparkles
} from 'lucide-react';
import { PageSectionData, SectionType } from '../../types/blocks';
import { allBmgPhotos } from '../ui/FullPhotoGalleryModal';

interface PageItem {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  seoDesc?: string;
  isPublished: boolean;
  sections?: PageSectionData[];
  _count?: { sections: number };
}

export const PageBuilderCMS: React.FC<{ token: string }> = ({ token }) => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<PageItem | null>(null);
  const [sections, setSections] = useState<PageSectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Blocco in fase di modifica
  const [editingSection, setEditingSection] = useState<PageSectionData | null>(null);
  
  // Modal aggiunta nuovo blocco
  const [isAddBlockOpen, setIsAddBlockOpen] = useState(false);

  // Modal creazione nuova pagina
  const [isNewPageOpen, setIsNewPageOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
        if (data.length > 0) {
          const defaultPage = data.find((p: any) => p.slug === 'home') || data[0];
          setSelectedPageId(defaultPage.id);
          loadPageDetails(defaultPage.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPageDetails = async (pageId: string) => {
    try {
      const res = await fetch(`/api/pages/admin/${pageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPage(data);
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPage = (id: string) => {
    setSelectedPageId(id);
    setEditingSection(null);
    loadPageDetails(id);
  };

  // Creazione nuova pagina
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug) return;

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPageTitle,
          slug: newPageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          isPublished: true,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setIsNewPageOpen(false);
        setNewPageTitle('');
        setNewPageSlug('');
        showFeedback(`Pagina "${created.title}" creata con successo!`);
        await loadPages();
        handleSelectPage(created.id);
      }
    } catch (err) {
      showFeedback('Errore nella creazione della pagina.', 'error');
    }
  };

  // Toggle visibilità sezione
  const toggleVisibility = async (sec: PageSectionData) => {
    const updatedVisible = !sec.isVisible;
    try {
      await fetch(`/api/sections/${sec.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVisible: updatedVisible }),
      });

      setSections((prev) =>
        prev.map((s) => (s.id === sec.id ? { ...s, isVisible: updatedVisible } : s))
      );
      showFeedback(`Blocco ${sec.type} ${updatedVisible ? 'reso Visibile' : 'Nascosto'}`);
    } catch (err) {
      showFeedback('Errore aggiornamento visibilità', 'error');
    }
  };

  // Sposta su / giù sezione
  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    // Ricalcola ordini sequenziali
    const reorderedItems = newSections.map((sec, idx) => ({
      id: sec.id,
      order: idx,
    }));

    setSections(newSections.map((s, idx) => ({ ...s, order: idx })));

    try {
      await fetch('/api/sections/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: reorderedItems }),
      });
      showFeedback('Ordine dei blocchi aggiornato.');
    } catch (err) {
      showFeedback('Errore riordinamento blocchi', 'error');
    }
  };

  // Elimina sezione
  const deleteSection = async (id: string, type: string) => {
    if (!window.confirm(`Sei sicuro di voler eliminare il blocco "${type}"?`)) return;

    try {
      await fetch(`/api/sections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setSections((prev) => prev.filter((s) => s.id !== id));
      if (editingSection?.id === id) setEditingSection(null);
      showFeedback(`Blocco ${type} eliminato.`);
    } catch (err) {
      showFeedback('Errore eliminazione blocco', 'error');
    }
  };

  // Aggiungi nuovo blocco
  const addBlock = async (type: SectionType) => {
    setIsAddBlockOpen(false);
    const defaultContent = getDefaultContentForType(type);

    try {
      const res = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pageId: selectedPageId,
          type,
          order: sections.length,
          isVisible: true,
          content: defaultContent,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setSections((prev) => [...prev, created]);
        setEditingSection(created);
        showFeedback(`Nuovo blocco "${type}" inserito!`);
      }
    } catch (err) {
      showFeedback('Errore inserimento blocco', 'error');
    }
  };

  // Salva modifiche contenuto blocco
  const saveSectionContent = async () => {
    if (!editingSection) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/sections/${editingSection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editingSection.content,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSections((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        showFeedback(`Blocco ${editingSection.type} salvato con successo!`);
      }
    } catch (err) {
      showFeedback('Errore salvataggio blocco', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notifica Feedback */}
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

      {/* Barra di Selezione Pagina e Azioni */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Pagina da Gestire
            </label>
            <select
              value={selectedPageId}
              onChange={(e) => handleSelectPage(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id} className="bg-brand-dark text-white">
                  {p.title} (/{p.slug})
                </option>
              ))}
            </select>
          </div>

          {currentPage && (
            <div className="text-xs text-gray-400 pt-4 md:pt-0">
              <span className="block">
                Stato: <strong className="text-emerald-400 font-semibold">{currentPage.isPublished ? 'Pubblicata' : 'Bozza'}</strong>
              </span>
              <span className="block text-[11px] font-mono text-gray-400">
                https://bmg-costruzioni.it/{currentPage.slug === 'home' ? '' : currentPage.slug}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewPageOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuova Pagina</span>
          </button>
        </div>
      </div>

      {/* Griglia Principale: Colonna Sinistra Blocchi + Colonna Destra Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNA 1: LISTA BLOCCHI MODULARI (5 Colonne) */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-terracotta" />
                <span>Struttura a Blocchi ({sections.length})</span>
              </h3>
              <p className="text-[11px] text-gray-400">Riordina, nascondi o modifica i blocchi</p>
            </div>
            <button
              onClick={() => setIsAddBlockOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi Blocco</span>
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              Nessun blocco presente in questa pagina. Clicca su "Aggiungi Blocco" per iniziare.
            </div>
          ) : (
            <div className="space-y-2.5">
              {sections.map((sec, idx) => {
                const isSelected = editingSection?.id === sec.id;
                return (
                  <div
                    key={sec.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-terracotta/15 border-brand-terracotta shadow-md'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    } ${!sec.isVisible ? 'opacity-50' : ''}`}
                  >
                    {/* Badge e Titolo Blocco */}
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setEditingSection(sec)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-amber-200 uppercase font-mono">
                          {sec.type}
                        </span>
                        <span className="text-xs font-bold text-white line-clamp-1">
                          {sec.content?.title || sec.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Posizione #{idx + 1}
                      </span>
                    </div>

                    {/* Controlli Rapidi Blocco */}
                    <div className="flex items-center gap-1">
                      {/* Riordina Su */}
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20"
                        title="Sposta Su"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Riordina Giù */}
                      <button
                        disabled={idx === sections.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-20"
                        title="Sposta Giù"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Visibilità */}
                      <button
                        onClick={() => toggleVisibility(sec)}
                        className={`p-1.5 rounded transition-colors ${
                          sec.isVisible
                            ? 'text-emerald-400 hover:bg-emerald-500/10'
                            : 'text-gray-500 hover:bg-white/10'
                        }`}
                        title={sec.isVisible ? 'Nascondi blocco' : 'Mostra blocco'}
                      >
                        {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Modifica */}
                      <button
                        onClick={() => setEditingSection(sec)}
                        className={`p-1.5 rounded ${
                          isSelected ? 'bg-brand-terracotta text-white' : 'hover:bg-white/10 text-gray-300'
                        }`}
                        title="Modifica contenuto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Elimina */}
                      <button
                        onClick={() => deleteSection(sec.id, sec.type)}
                        className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                        title="Elimina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLONNA 2: EDITOR VISIVO DEL CONTENUTO (7 Colonne) */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          {editingSection ? (
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-terracotta uppercase">
                      Editor Blocco
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-amber-200 font-mono font-bold">
                      {editingSection.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Personalizza Contenuti e Testi
                  </h3>
                </div>

                <button
                  onClick={saveSectionContent}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Salvataggio...' : 'Salva Modifiche'}</span>
                </button>
              </div>

              {/* Form Dedicata in base alla tipologia di blocco */}
              <div className="space-y-4">
                {renderBlockForm(editingSection, setEditingSection)}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center">
              <Layout className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-40" />
              <h4 className="text-base font-bold text-white mb-1">Seleziona un blocco dalla lista</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Clicca su uno dei blocchi a sinistra per aprirne l'editor e modificare testi, CTA, immagini e impostazioni.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL AGGIUNGI BLOCCO */}
      <AnimatePresence>
        {isAddBlockOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-brand-dark border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Scegli la Tipologia di Blocco</h3>
                  <p className="text-xs text-gray-400">Inserisci una nuova sezione nella pagina</p>
                </div>
                <button
                  onClick={() => setIsAddBlockOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { type: 'HERO', label: 'Hero Sezione Iniziale', desc: 'Titolo grande, zoom di sfondo e call-to-action', icon: <Sparkles className="w-5 h-5 text-amber-300" /> },
                  { type: 'SERVICES_GRID', label: 'Griglia Servizi', desc: 'Card con icone, descrizioni e punti elenco', icon: <Columns className="w-5 h-5 text-brand-terracotta" /> },
                  { type: 'BEFORE_AFTER', label: 'Confronto Prima & Dopo', desc: 'Slider interattivo con cursore trascinabile', icon: <ImageIcon className="w-5 h-5 text-blue-400" /> },
                  { type: 'TEXT_IMAGE', label: 'Testo + Immagine Cantiere', desc: 'Layout asimmetrico per presentazioni aziendali', icon: <Layout className="w-5 h-5 text-emerald-400" /> },
                  { type: 'PROJECTS_SHOWCASE', label: 'Galleria Cantieri', desc: 'Portfolio lavori con filtri categoria', icon: <Layers className="w-5 h-5 text-purple-400" /> },
                  { type: 'STATS', label: 'Numeri & Statistiche', desc: 'Metriche aziendali e garanzie certificate', icon: <BarChart3 className="w-5 h-5 text-amber-400" /> },
                  { type: 'FAQ', label: 'Domande Frequenti', desc: 'Fisarmonica a scomparsa per dubbi e garanzie', icon: <HelpCircle className="w-5 h-5 text-cyan-400" /> },
                  { type: 'CTA_FORM', label: 'Form di Preventivo', desc: 'Modulo di contatto con chip interattivi', icon: <MessageSquare className="w-5 h-5 text-rose-400" /> },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addBlock(item.type as SectionType)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-terracotta hover:bg-white/10 text-left transition-all flex items-start gap-3.5 group"
                  >
                    <div className="p-2.5 rounded-xl bg-white/10 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-terracotta transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CREA NUOVA PAGINA */}
      <AnimatePresence>
        {isNewPageOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-brand-dark border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Crea Nuova Pagina</h3>
                  <p className="text-xs text-gray-400">Aggiungi una pagina secondaria al sito</p>
                </div>
                <button
                  onClick={() => setIsNewPageOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePage} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Titolo Pagina
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="es. Chi Siamo o Ristrutturazioni"
                    value={newPageTitle}
                    onChange={(e) => {
                      setNewPageTitle(e.target.value);
                      if (!newPageSlug) {
                        setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-300 mb-1">
                    Slug URL (percorso)
                  </label>
                  <div className="flex items-center bg-white/10 border border-white/15 rounded-xl px-3 text-xs text-gray-400">
                    <span>/</span>
                    <input
                      type="text"
                      required
                      placeholder="chi-siamo"
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(e.target.value)}
                      className="w-full px-1 py-2.5 bg-transparent text-white focus:outline-none text-sm font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider transition-all mt-4"
                >
                  Crea Pagina
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Funzione helper per rendere i form dedicati a ciascun blocco
function renderBlockForm(section: PageSectionData, setSection: (s: PageSectionData) => void) {
  const content = section.content || {};

  const updateContent = (field: string, value: any) => {
    setSection({
      ...section,
      content: { ...section.content, [field]: value },
    });
  };

  switch (section.type) {
    case 'HERO':
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Badge Superiore</label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => updateContent('badge', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo Riga 1</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Parola Evidenziata Terracotta</label>
              <input
                type="text"
                value={content.highlightedWord || ''}
                onChange={(e) => updateContent('highlightedWord', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-bold"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Sottotitolo Descrittivo</label>
            <textarea
              rows={3}
              value={content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Testo Bottone Primario</label>
              <input
                type="text"
                value={content.primaryCtaText || ''}
                onChange={(e) => updateContent('primaryCtaText', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Link Bottone Primario</label>
              <input
                type="text"
                value={content.primaryCtaLink || ''}
                onChange={(e) => updateContent('primaryCtaLink', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Immagine di Sfondo (URL)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.backgroundImage || ''}
                onChange={(e) => updateContent('backgroundImage', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-mono"
              />
            </div>
            {/* Galleria rapida foto cantieri per scegliere lo sfondo */}
            <div className="mt-2 flex gap-2 overflow-x-auto py-2">
              {allBmgPhotos.slice(0, 8).map((photo) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  onClick={() => updateContent('backgroundImage', photo.url)}
                  alt="anteprima"
                  className="w-12 h-10 object-cover rounded cursor-pointer border border-white/20 hover:border-brand-terracotta shrink-0"
                  title="Usa come sfondo"
                />
              ))}
            </div>
          </div>
        </div>
      );

    case 'BEFORE_AFTER':
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo Sezione</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
            />
          </div>
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Descrizione Lavori</label>
            <textarea
              rows={2}
              value={content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Foto PRIMA (URL)</label>
              <input
                type="text"
                value={content.beforeImage || ''}
                onChange={(e) => updateContent('beforeImage', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Foto DOPO (URL)</label>
              <input
                type="text"
                value={content.afterImage || ''}
                onChange={(e) => updateContent('afterImage', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-mono"
              />
            </div>
          </div>
          {/* Selettore rapido foto */}
          <div className="mt-2 flex gap-2 overflow-x-auto py-2">
            {allBmgPhotos.map((photo) => (
              <img
                key={photo.id}
                src={photo.url}
                onClick={() => updateContent('afterImage', photo.url)}
                alt="anteprima"
                className="w-12 h-10 object-cover rounded cursor-pointer border border-white/20 hover:border-brand-terracotta shrink-0"
                title="Imposta come foto Dopo"
              />
            ))}
          </div>
        </div>
      );

    case 'TEXT_IMAGE':
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Tagline</label>
            <input
              type="text"
              value={content.tagline || ''}
              onChange={(e) => updateContent('tagline', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
            />
          </div>
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-bold"
            />
          </div>
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Descrizione Dettagliata</label>
            <textarea
              rows={4}
              value={content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">URL Immagine</label>
              <input
                type="text"
                value={content.imageUrl || ''}
                onChange={(e) => updateContent('imageUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Posizione Immagine</label>
              <select
                value={content.imagePosition || 'right'}
                onChange={(e) => updateContent('imagePosition', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-brand-dark border border-white/15 text-white"
              >
                <option value="right">Destra</option>
                <option value="left">Sinistra</option>
              </select>
            </div>
          </div>
        </div>
      );

    case 'FAQ':
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo Sezione FAQ</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
            />
          </div>
          <div className="space-y-3">
            <span className="block font-semibold uppercase text-gray-300">Domande e Risposte</span>
            {(content.items || []).map((faq: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                <input
                  type="text"
                  placeholder="Domanda"
                  value={faq.question}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[idx].question = e.target.value;
                    updateContent('items', newItems);
                  }}
                  className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/15 text-white font-semibold"
                />
                <textarea
                  rows={2}
                  placeholder="Risposta"
                  value={faq.answer}
                  onChange={(e) => {
                    const newItems = [...content.items];
                    newItems[idx].answer = e.target.value;
                    updateContent('items', newItems);
                  }}
                  className="w-full px-3 py-1.5 rounded bg-white/10 border border-white/15 text-white resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'SERVICES_GRID': {
      const servicesList: any[] = content.services || [];

      const addService = () => {
        const newService = {
          id: `srv-${Date.now()}`,
          title: 'Nuovo Servizio',
          badge: 'Nuovo',
          iconName: 'Building2',
          description: 'Descrizione breve delle lavorazioni offerte con maestranze e materiali certificati.',
          fullDetails: 'Dettagli tecnici approfonditi per la scheda del servizio, tempi di posa e vantaggi per il cliente.',
          features: ['Sopralluogo tecnico preliminare gratuito', 'Computo metrico trasparente', 'Garanzia e certificazioni a norma'],
          imageUrl: '',
        };
        updateContent('services', [...servicesList, newService]);
      };

      const updateService = (index: number, key: string, val: any) => {
        const updated = [...servicesList];
        updated[index] = { ...updated[index], [key]: val };
        updateContent('services', updated);
      };

      const removeService = (index: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questo servizio?')) {
          const updated = servicesList.filter((_, i) => i !== index);
          updateContent('services', updated);
        }
      };

      const moveService = (index: number, direction: 'up' | 'down') => {
        if (
          (direction === 'up' && index === 0) ||
          (direction === 'down' && index === servicesList.length - 1)
        )
          return;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...servicesList];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);
        updateContent('services', updated);
      };

      const addFeatureToService = (srvIndex: number) => {
        const updated = [...servicesList];
        const features = updated[srvIndex].features || [];
        updated[srvIndex].features = [...features, 'Nuovo punto di forza'];
        updateContent('services', updated);
      };

      const updateFeatureInService = (srvIndex: number, featIndex: number, text: string) => {
        const updated = [...servicesList];
        const features = [...(updated[srvIndex].features || [])];
        features[featIndex] = text;
        updated[srvIndex].features = features;
        updateContent('services', updated);
      };

      const removeFeatureFromService = (srvIndex: number, featIndex: number) => {
        const updated = [...servicesList];
        const features = (updated[srvIndex].features || []).filter((_: any, i: number) => i !== featIndex);
        updated[srvIndex].features = features;
        updateContent('services', updated);
      };

      return (
        <div className="space-y-6 text-xs">
          {/* Intestazione Sezione Servizi */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="font-bold text-sm text-brand-terracotta uppercase tracking-wide">
              Intestazione Sezione
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-gray-300 mb-1">Tagline Superiore</label>
                <input
                  type="text"
                  placeholder="Competenza Globale in Cantiere"
                  value={content.tagline || ''}
                  onChange={(e) => updateContent('tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo Principale</label>
                <input
                  type="text"
                  placeholder="Tutti i Servizi Offerti da BMG Srl"
                  value={content.title || ''}
                  onChange={(e) => updateContent('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold uppercase text-gray-300 mb-1">Descrizione Introduttiva</label>
              <textarea
                rows={2}
                placeholder="Descrizione di sintesi..."
                value={content.description || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
              />
            </div>
          </div>

          {/* Elenco Servizi Configurato */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-sm text-white">
                Servizi Offerti ({servicesList.length})
              </span>
              <button
                type="button"
                onClick={addService}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold transition-all text-xs shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Servizio</span>
              </button>
            </div>

            {servicesList.length === 0 ? (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/15 text-gray-400">
                <p className="mb-3">Nessun servizio inserito in questa sezione.</p>
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2 rounded-lg bg-brand-terracotta text-white font-semibold text-xs"
                >
                  Crea il primo servizio
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {servicesList.map((srv, sIdx) => (
                  <div
                    key={srv.id || sIdx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-terracotta/40 transition-all space-y-4"
                  >
                    {/* Header Scheda Servizio con azioni */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-terracotta text-white font-bold flex items-center justify-center text-[10px]">
                          {sIdx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {srv.title || 'Senza Titolo'}
                        </span>
                        {srv.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-brand-terracotta font-semibold">
                            {srv.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveService(sIdx, 'up')}
                          disabled={sIdx === 0}
                          title="Sposta Su"
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveService(sIdx, 'down')}
                          disabled={sIdx === servicesList.length - 1}
                          title="Sposta Giù"
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeService(sIdx)}
                          title="Elimina Servizio"
                          className="p-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Campi Principali */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold uppercase text-gray-400 mb-1">
                          Nome Servizio
                        </label>
                        <input
                          type="text"
                          value={srv.title || ''}
                          onChange={(e) => updateService(sIdx, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold uppercase text-gray-400 mb-1">
                          Badge Evidenziato
                        </label>
                        <input
                          type="text"
                          placeholder="es. Chiavi in Mano"
                          value={srv.badge || ''}
                          onChange={(e) => updateService(sIdx, 'badge', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
                        />
                      </div>
                    </div>

                    {/* Scelta Icona */}
                    <div>
                      <label className="block font-semibold uppercase text-gray-400 mb-1">
                        Icona Rappresentativa
                      </label>
                      <select
                        value={srv.iconName || 'Building2'}
                        onChange={(e) => updateService(sIdx, 'iconName', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-brand-dark border border-white/15 text-white font-semibold"
                      >
                        <option value="Building2">🏢 Building2 (Edilizia / Capannoni)</option>
                        <option value="Home">🏠 Home (Ristrutturazioni Casa)</option>
                        <option value="Layers">🧱 Layers (Facciate / Cappotto / Isolamenti)</option>
                        <option value="Zap">⚡ Zap (Impianti Elettrici / Tecnologici)</option>
                        <option value="Wrench">🔧 Wrench (Impianti Idraulici / Assistenza)</option>
                        <option value="Maximize2">🪟 Maximize2 (Serramenti / Infissi)</option>
                        <option value="Paintbrush">🎨 Paintbrush (Finiture / Cartongesso / Tinteggiature)</option>
                        <option value="Hammer">🔨 Hammer (Demolizioni / Opere Murarie)</option>
                        <option value="Flame">🔥 Flame (Riscaldamento / Pompe di Calore)</option>
                        <option value="Sparkles">✨ Sparkles (Parquet / Finiture di Pregio)</option>
                      </select>
                    </div>

                    {/* Descrizione Breve (Card) */}
                    <div>
                      <label className="block font-semibold uppercase text-gray-400 mb-1">
                        Descrizione Breve (visibile sulla Card)
                      </label>
                      <textarea
                        rows={2}
                        value={srv.description || ''}
                        onChange={(e) => updateService(sIdx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
                      />
                    </div>

                    {/* Dettagli Completi (Scheda Modale al click) */}
                    <div>
                      <label className="block font-semibold uppercase text-gray-400 mb-1">
                        Dettagli Approfonditi (visibili nella finestra "Dettagli")
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Spiega nel dettaglio come operiamo, quali garanzie offriamo, normative..."
                        value={srv.fullDetails || ''}
                        onChange={(e) => updateService(sIdx, 'fullDetails', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
                      />
                    </div>

                    {/* Foto del Servizio */}
                    <div>
                      <label className="block font-semibold uppercase text-gray-400 mb-1">
                        Foto di Anteprima del Servizio (URL o clicca sotto)
                      </label>
                      <input
                        type="text"
                        placeholder="/images/cantieri/cantiere-01.jpg"
                        value={srv.imageUrl || ''}
                        onChange={(e) => updateService(sIdx, 'imageUrl', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-mono text-xs"
                      />

                      {/* Selettore rapido foto */}
                      <div className="mt-2 flex gap-2 overflow-x-auto py-1">
                        {allBmgPhotos.slice(0, 10).map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.url}
                            onClick={() => updateService(sIdx, 'imageUrl', photo.url)}
                            alt="anteprima"
                            className={`w-12 h-9 object-cover rounded cursor-pointer border transition-all shrink-0 ${
                              srv.imageUrl === photo.url ? 'border-brand-terracotta ring-2 ring-brand-terracotta' : 'border-white/20 opacity-60 hover:opacity-100'
                            }`}
                            title="Seleziona questa foto per il servizio"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Punti di Forza (Features / Checklist) */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold uppercase text-gray-400">
                          Punti di Forza / Specifiche ({(srv.features || []).length})
                        </label>
                        <button
                          type="button"
                          onClick={() => addFeatureToService(sIdx)}
                          className="text-[11px] font-bold text-brand-terracotta hover:text-amber-400 transition-colors"
                        >
                          + Aggiungi Punto
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {(srv.features || []).map((feat: string, fIdx: number) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => updateFeatureInService(sIdx, fIdx, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white"
                            />
                            <button
                              type="button"
                              onClick={() => removeFeatureFromService(sIdx, fIdx)}
                              className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Rimuovi punto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    default:
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Titolo Blocco</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white"
            />
          </div>
          <div>
            <label className="block font-semibold uppercase text-gray-300 mb-1">Sottotitolo / Descrizione</label>
            <textarea
              rows={3}
              value={content.description || content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white resize-none"
            />
          </div>
        </div>
      );
  }
}

// Default content per ciascun blocco quando viene inserito
function getDefaultContentForType(type: SectionType) {
  switch (type) {
    case 'HERO':
      return {
        badge: 'BMG Srl • Costruzioni e Ristrutturazioni',
        title: 'Eccellenza Costruttiva a',
        highlightedWord: 'Monza e Brianza',
        subtitle: 'Costruzioni civili ed industriali con maestranze dirette e rispetto rigoroso dei tempi di consegna.',
        primaryCtaText: 'Richiedi Sopralluogo Gratuito',
        primaryCtaLink: '#preventivo',
        backgroundImage: '/images/cantieri/cantiere-10.jpg',
      };
    case 'TEXT_IMAGE':
      return {
        tagline: 'Chi Siamo & Metodo Operativo',
        title: 'Precisione, Materiali di Pregio e Gestione Chiavi in Mano',
        description: 'La nostra azienda si avvale di personale altamente specializzato per ogni settore: dalle opere murarie strutturali alle finiture e certificazioni impiantistiche.',
        bullets: ['Preventivi trasparenti a computo metrico', 'Polizza assicurativa su tutti i cantieri', 'Direzione lavori costante e puntuale'],
        imageUrl: '/images/cantieri/cantiere-06.jpg',
        imagePosition: 'right',
        ctaText: 'Contattaci Ora',
        ctaLink: '#preventivo',
      };
    case 'FAQ':
      return {
        tagline: 'Garanzie & Trasparenza',
        title: 'Domande Frequenti sui Nostri Lavori',
        items: [
          { question: 'Il sopralluogo tecnico è gratuito?', answer: 'Sì, effettuiamo sempre un primo sopralluogo tecnico senza impegno a Caponago, Monza Brianza e Milano per verificare lo stato dei luoghi.' },
          { question: 'Rilasciate le certificazioni degli impianti?', answer: 'Assolutamente sì. Rilasciamo sempre la dichiarazione di conformità a regola d\'arte per tutti gli impianti elettrici ed idraulici realizzati.' },
          { question: 'Gestite anche le pratiche edilizie (CILA, SCIA)?', answer: 'Sì, ci occupiamo internamente di tutta la parte burocratica e tecnica tramite i nostri geometri e ingegneri abilitati.' },
        ],
      };
    case 'BEFORE_AFTER':
      return {
        title: 'Prima e Dopo i Lavori',
        subtitle: 'Confronta la trasformazione dell\'immobile prima e dopo il nostro intervento.',
        beforeImage: '/images/cantieri/cantiere-03.jpg',
        afterImage: '/images/cantieri/cantiere-04.jpg',
        beforeLabel: 'Prima',
        afterLabel: 'Dopo',
      };
    case 'SERVICES_GRID':
      return {
        tagline: 'Competenza Globale in Cantiere',
        title: 'Tutti i Servizi Offerti da BMG Srl',
        description: 'Gestiamo internamente ogni fase con maestranze dirette e unico responsabile.',
        services: [
          {
            id: 'srv-1',
            iconName: 'Building2',
            badge: 'Civile & Industriale',
            title: 'Costruzioni Civili ed Industriali',
            description: 'Nuove costruzioni, capannoni, strutture portanti e consolidamenti.',
            fullDetails: 'Realizzazione di nuovi fabbricati con strutture in cemento armato, muratura o acciaio a norma sismica.',
            features: ['Nuove costruzioni residenziali', 'Opere strutturali e consolidamenti', 'Fondazioni e recinzioni'],
            imageUrl: '/images/cantieri/cantiere-10.jpg',
          },
          {
            id: 'srv-2',
            iconName: 'Home',
            badge: 'Chiavi in Mano',
            title: 'Ristrutturazioni Complete',
            description: 'Riqualificazione totale chiavi in mano di appartamenti e complessi produttivi.',
            fullDetails: 'Dalla demolizione al rifacimento totale impianti e finiture di pregio con costi bloccati a contratto.',
            features: ['Demolizioni controllate', 'Rifacimento bagni e impianti', 'Cartongesso e pareti termiche'],
            imageUrl: '/images/cantieri/cantiere-04.jpg',
          },
        ],
      };
    case 'STATS':
      return {
        stats: [
          { value: '100%', label: 'Consegna nei Tempi' },
          { value: '13+', label: 'Ambiti di Specializzazione' },
          { value: 'Zero Pensieri', label: 'Gestione Chiavi in Mano' },
        ],
      };
    default:
      return {
        title: 'Nuova Sezione',
        subtitle: 'Inserisci qui la descrizione di questa sezione.',
      };
  }
}
