import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle2, Clock, ShieldCheck, Phone } from 'lucide-react';
import { InteractiveQuoteWizard } from './InteractiveQuoteWizard';
import confetti from 'canvas-confetti';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultService,
}) => {
  const [formMode, setFormMode] = useState<'wizard' | 'quick'>('wizard');

  // Campi per il modulo rapido
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedService, setSelectedService] = useState(defaultService || 'Costruzioni Civili ed Industriali');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Sincronizza il servizio selezionato se cambia dall'esterno
  useEffect(() => {
    if (defaultService) {
      setSelectedService(defaultService);
    }
  }, [defaultService]);

  const servicesList = [
    'Costruzioni Civili ed Industriali',
    'Ristrutturazione Civile ed Industriale',
    'Manutenzione Condomini',
    'Demolizioni',
    'Cartongesso',
    'Imbiancature',
    'Impianti Elettrici',
    'Impianti Idraulici',
    'Fornitura Posa e Serramenti',
    'Recinzioni',
    'Capotto',
    'Interventi Strutturali',
    'Posa e Levigatura Parquet',
  ];

  // Gestione tasto Escape e blocco scroll del body
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

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          location,
          serviceType: selectedService,
          message,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Si è verificato un errore.');
      }

      setStatus('success');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#c2783b', '#d97706', '#fbbf24', '#ffffff'],
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Errore durante l\'invio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop scuro con blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Finestra Modale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Header Modale */}
          <div className="flex items-center justify-between p-6 sm:px-8 border-b border-slate-800 bg-slate-950/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                BMG S.r.l. • Preventivo & Sopralluogo Gratuito
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Richiedi un Preventivo per il Tuo Progetto
              </h3>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Switcher Modalità Form: Wizard Guidato vs Modulo Rapido */}
          <div className="px-6 sm:px-8 pt-5">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <button
                type="button"
                onClick={() => setFormMode('wizard')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  formMode === 'wizard'
                    ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Configuratore Guidato</span>
              </button>

              <button
                type="button"
                onClick={() => setFormMode('quick')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  formMode === 'quick'
                    ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Modulo Rapido Diretto</span>
              </button>
            </div>
          </div>

          {/* Contenuto Dinamico Form (Scrollabile se necessario) */}
          <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
            {formMode === 'wizard' ? (
              <InteractiveQuoteWizard
                defaultService={defaultService}
                onFinished={() => {
                  setTimeout(() => {
                    onClose();
                  }, 2500);
                }}
              />
            ) : (
              <div>
                {status === 'success' ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">Richiesta Inviata con Successo!</h4>
                    <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                      Grazie per averci contattato. Un nostro tecnico responsabile analizzerà la richiesta e ti ricontatterà entro 24 ore.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-brand-terracotta text-white font-bold text-xs uppercase tracking-wider hover:brightness-110"
                    >
                      Chiudi Finestra
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleQuickSubmit} className="space-y-4">
                    {/* Selezione Servizio */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Tipo di Lavorazione *
                      </label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-brand-terracotta focus:outline-hidden"
                      >
                        {servicesList.map((srv, idx) => (
                          <option key={idx} value={srv}>
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dati Anagrafici */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Nome e Cognome *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Mario Rossi"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-brand-terracotta focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Telefono / Cellulare *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+39 340 000 0000"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-brand-terracotta focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="mario.rossi@email.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-brand-terracotta focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Comune dell'Immobile *
                        </label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Caponago, Monza, Milano..."
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-brand-terracotta focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Dettagli / Messaggio */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Note o Dettagli sul Progetto (Opzionale)
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Descrivi brevemente l'immobile, i metri quadri o le esigenze specifiche..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-brand-terracotta focus:outline-hidden resize-none"
                      />
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-300 text-xs">
                        {errorMessage}
                      </div>
                    )}

                    {/* Tasto Invia */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-terracotta to-[#d4894c] hover:brightness-110 text-white font-bold text-sm uppercase tracking-wider shadow-glow-terracotta transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span>Invio in corso...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Invia Richiesta Preventivo</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuoteModal;
