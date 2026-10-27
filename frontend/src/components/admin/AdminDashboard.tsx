import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, Mail, Phone, Calendar, CheckCircle2, Clock, 
  Archive, LogOut, ArrowLeft, RefreshCw, HardHat, ExternalLink,
  Layers, Images, Settings, Copy
} from 'lucide-react';
import { PageBuilderCMS } from './PageBuilderCMS';
import { ProjectManagerCMS } from './ProjectManagerCMS';
import { allBmgPhotos } from '../ui/FullPhotoGalleryModal';

interface QuoteLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetRange?: string;
  location?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'ARCHIVED';
  createdAt: string;
}

export const AdminDashboard: React.FC<{ onBackToSite: () => void }> = ({ onBackToSite }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('bmg_admin_token'));
  
  // Stati Login
  const [email, setEmail] = useState('admin@edilpregio.it');
  const [password, setPassword] = useState('EdilPregio2026!');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Stati Dashboard
  const [activeTab, setActiveTab] = useState<'pagebuilder' | 'projects' | 'quotes' | 'media' | 'info'>('projects');
  const [quotes, setQuotes] = useState<QuoteLead[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadQuotes();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Credenziali non valide.');
      }

      localStorage.setItem('bmg_admin_token', data.token);
      setToken(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Errore di autenticazione. Verifica email e password.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bmg_admin_token');
    setToken(null);
  };

  const loadQuotes = async () => {
    setLoadingQuotes(true);
    try {
      const res = await fetch('/api/quotes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const updateQuoteStatus = async (id: string, newStatus: 'NEW' | 'CONTACTED' | 'ARCHIVED') => {
    try {
      await fetch(`/api/quotes/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const copyPhotoUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // 1. Schermata di Login se non autenticato
  if (!token) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-6 text-white relative">
        <button
          onClick={onBackToSite}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna al Sito Pubblico</span>
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-md border border-white/20 inline-block mx-auto mb-4">
              <img src="/logo.png" alt="BMG Costruzioni" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-xl font-bold font-display uppercase tracking-tight">
              Pannello CMS & Amministrazione
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              BMG Srl • Gestione Contenuti e Pagine
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Email Amministratore
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-sm tracking-wide uppercase transition-all shadow-glow-terracotta disabled:opacity-50 mt-2"
            >
              {loggingIn ? 'Accesso in corso...' : 'Accedi al CMS'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-gray-400">
            Credenziali iniziali: <code className="text-amber-200">admin@edilpregio.it</code> / <code className="text-amber-200">EdilPregio2026!</code>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Dashboard Amministrativa con CMS Page Builder
  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col">
      {/* Topbar Admin */}
      <header className="border-b border-white/10 bg-brand-dark/95 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="bg-white px-2.5 py-1 rounded-xl shadow-sm">
            <img src="/logo.png" alt="BMG Costruzioni" className="h-7 w-auto object-contain" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-2">
              <span>BMG Srl • CMS Suite</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/30">
                PRO v2.0
              </span>
            </h2>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Server Attivo (Porta 3002)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Visualizza Sito</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Esci</span>
          </button>
        </div>
      </header>

      {/* Subnav Tab Navigation */}
      <div className="border-b border-white/10 bg-white/5 px-6 py-2.5 flex items-center gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'projects'
              ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Gestione Cantieri & Lavori</span>
        </button>

        <button
          onClick={() => setActiveTab('pagebuilder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'pagebuilder'
              ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Page Builder & Blocchi</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'quotes'
              ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Richieste Preventivi ({quotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'media'
              ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>Media Manager ({allBmgPhotos.length} Foto)</span>
        </button>

        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'info'
              ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurazione Server</span>
        </button>
      </div>

      {/* Contenuto Dinamico Tab */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        
        {/* TAB 0: GESTIONE CANTIERI & PORTFOLIO */}
        {activeTab === 'projects' && (
          <ProjectManagerCMS token={token} />
        )}

        {/* TAB 1: PAGE BUILDER CMS */}
        {activeTab === 'pagebuilder' && (
          <PageBuilderCMS token={token} />
        )}

        {/* TAB 2: RICHIESTE PREVENTIVO */}
        {activeTab === 'quotes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Richieste di Sopralluogo e Preventivo</h3>
                <p className="text-xs text-gray-400">
                  Lead e contatti pervenuti direttamente dal modulo online di BMG Srl
                </p>
              </div>
              <button
                onClick={loadQuotes}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-gray-300 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Aggiorna</span>
              </button>
            </div>

            {loadingQuotes ? (
              <div className="py-12 text-center text-gray-400 text-sm">Caricamento lead...</div>
            ) : quotes.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <Clock className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">Nessuna richiesta ricevuta finora</h4>
                <p className="text-xs text-gray-400 mt-1">I messaggi inviati dal sito appariranno qui in tempo reale.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white">{quote.fullName}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          quote.status === 'NEW'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : quote.status === 'CONTACTED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {quote.status === 'NEW' ? 'Nuova Richiesta' : quote.status === 'CONTACTED' ? 'Contattato' : 'Archiviato'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                        <a href={`tel:${quote.phone}`} className="inline-flex items-center gap-1 text-brand-terracotta hover:underline font-mono">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{quote.phone}</span>
                        </a>
                        <a href={`mailto:${quote.email}`} className="inline-flex items-center gap-1 text-gray-300 hover:underline">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{quote.email}</span>
                        </a>
                        {quote.location && (
                          <span className="text-gray-400">📍 {quote.location}</span>
                        )}
                        <span className="text-gray-400">Intervento: <strong className="text-white">{quote.serviceType}</strong></span>
                      </div>

                      <div className="p-3 bg-black/30 rounded-xl text-xs text-gray-300 italic border border-white/5">
                        "{quote.message}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateQuoteStatus(quote.id, quote.status === 'CONTACTED' ? 'NEW' : 'CONTACTED')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          quote.status === 'CONTACTED'
                            ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{quote.status === 'CONTACTED' ? 'Segna da Contattare' : 'Segna Contattato'}</span>
                      </button>

                      <a
                        href={`tel:${quote.phone}`}
                        className="p-2 rounded-xl bg-brand-terracotta text-white hover:bg-[#a85e2b] transition-colors"
                        title="Chiama subito"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDIA MANAGER */}
        {activeTab === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Libreria Media & Foto Cantieri</h3>
                <p className="text-xs text-gray-400">
                  Tutte le 20 fotografie di BMG Srl disponibili da inserire nei blocchi
                </p>
              </div>
              {copiedUrl && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  URL Copiato negli appunti!
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allBmgPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-brand-terracotta transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-900 relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white">
                      #{photo.id}
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] uppercase font-bold text-brand-terracotta block">
                      {photo.category}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-2">
                      {photo.title}
                    </h4>
                    <button
                      onClick={() => copyPhotoUrl(photo.url)}
                      className="w-full py-1.5 px-2 rounded-lg bg-white/10 hover:bg-brand-terracotta text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copia Percorso</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONFIGURAZIONE & SERVER */}
        {activeTab === 'info' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl space-y-4">
            <h3 className="text-lg font-bold">Stato Infrastruttura IONOS VPS</h3>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Ragione Sociale:</span>
                <span className="font-bold text-white">BMG S.r.l.</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Marchio / Logo:</span>
                <span className="font-bold text-brand-terracotta">BMG Costruzioni</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Sede Legale:</span>
                <span className="font-bold text-white">Via De Gasperi 19, Caponago (MB)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Recapito Telefonico:</span>
                <span className="font-mono text-emerald-400 font-bold">+39 348 569 6125</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Porta Interna Node.js:</span>
                <span className="font-mono text-amber-200">3002</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Demone PM2:</span>
                <span className="text-emerald-400 font-bold">bmg-costruzioni (online)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Web Server & SSL:</span>
                <span className="font-bold text-white">Nginx + Certbot Let's Encrypt (HTTPS)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Dominio Attivo:</span>
                <a href="https://bmg-costruzioni.it" target="_blank" rel="noreferrer" className="text-brand-terracotta hover:underline">
                  https://bmg-costruzioni.it
                </a>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
