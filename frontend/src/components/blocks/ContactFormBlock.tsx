import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, PhoneCall, Clock, ShieldCheck } from 'lucide-react';
import { CtaFormContent } from '../../types/blocks';

export const ContactFormBlock: React.FC<{ content: CtaFormContent }> = ({ content }) => {
  const serviceOptions = content.servicesOptions || [
    'Ristrutturazione Completa',
    'Restauro Conservativo',
    'Nuova Costruzione Villa',
    'Ampliamento / Sopraelevazione',
    'Riqualificazione Energetica (Cappotto/Tetto)',
    'Ristrutturazione Commerciale / Showroom',
  ];

  const budgetOptions = content.budgetOptions || [
    '50.000€ - 100.000€',
    '100.000€ - 250.000€',
    '250.000€ - 500.000€',
    'Oltre 500.000€',
  ];

  const [selectedService, setSelectedService] = useState<string>(serviceOptions[0]);
  const [selectedBudget, setSelectedBudget] = useState<string>(budgetOptions[1]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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
          serviceType: selectedService,
          budgetRange: selectedBudget,
          location,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Si è verificato un errore.');
      }

      setStatus('success');
      setFullName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Errore durante l\'invio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="preventivo" className="py-24 bg-brand-dark text-white relative overflow-hidden">
      {/* Texture decorativa geometrica di sfondo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Colonna Informativa e Rassicurazione */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-brand-terracotta mb-2 block">
                Contatto Diretto & Sopralluogo
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
                {content.title || 'Diamo Forma al Tuo Progetto'}
              </h2>
              <p className="text-base text-brand-subtle mb-8 leading-relaxed">
                {content.subtitle ||
                  'Richiedi una consulenza preliminare e un sopralluogo tecnico senza impegno. Analizzeremo fattibilità, computo metrico e cronoprogramma dei lavori.'}
              </p>

              <div className="space-y-6 pt-4 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-brand-terracotta" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Risposta Entro 24 Ore</h4>
                    <p className="text-xs text-brand-subtle mt-0.5">
                      Un nostro ingegnere o geometra dedicato analizzerà la tua richiesta e ti ricontatterà rapidamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-brand-terracotta" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Trasparenza Contrattuale & Garanzie</h4>
                    <p className="text-xs text-brand-subtle mt-0.5">
                      Prezzi bloccati a computo metrico, polizza decennale postuma e gestione completa di pratiche edilizie edili.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5 text-brand-terracotta" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Centralino Ufficio Tecnico</h4>
                    <p className="text-xs text-brand-subtle mt-0.5 font-mono">
                      +39 02 8900 1234 • Dal lunedì al venerdì (08:30 - 18:30)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-brand-subtle">
              Trattamento dati nel pieno rispetto del GDPR (UE 2016/679). Nessun invio di spam.
            </div>
          </div>

          {/* Form Interattivo ad Alta Conversione */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Richiesta Ricevuta con Successo!</h3>
                    <p className="text-sm text-brand-subtle max-w-md mx-auto mb-8">
                      Abbiamo preso in carico la tua richiesta e inviato un'email di riepilogo. Un nostro responsabile tecnico ti contatterà al più presto.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="px-6 py-2.5 rounded-xl bg-brand-terracotta text-white font-semibold text-sm hover:bg-[#a85e2b] transition-colors"
                    >
                      Invia un'altra richiesta
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Chip Selezione Tipo Intervento */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-terracotta mb-3">
                        1. Che tipo di intervento intendi realizzare? *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {serviceOptions.map((srv) => (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => setSelectedService(srv)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                              selectedService === srv
                                ? 'bg-brand-terracotta text-white shadow-glow-terracotta'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {srv}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chip Selezione Budget Indicativo */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-terracotta mb-3">
                        2. Fascia di Budget Previsto
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {budgetOptions.map((bgt) => (
                          <button
                            type="button"
                            key={bgt}
                            onClick={() => setSelectedBudget(bgt)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                              selectedBudget === bgt
                                ? 'bg-white text-brand-dark font-bold'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {bgt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campi Anagrafici Ordinati */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                          Nome e Cognome *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="es. Marco Rossi"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                          Recapito Telefonico *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="es. +39 340 1234567"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                          Indirizzo Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="es. marco.rossi@email.it"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1.5">
                          Comune / Provincia del Cantiere
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="es. Monza e Brianza"
                          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-sm"
                        />
                      </div>
                    </div>

                    {/* Descrizione Progetto */}
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Dettagli dell'Intervento / Note *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Descrivi brevemente lo stato attuale dell'immobile, le tempistiche desiderate o particolari esigenze tecniche..."
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta text-sm resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Pulsante Invio */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-sm tracking-wide uppercase shadow-glow-terracotta flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Richiedi Sopralluogo Gratuito</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
