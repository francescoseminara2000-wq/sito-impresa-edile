import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Home, Building2, 
  Wrench, Layers, Zap, Hammer, MapPin, Calendar, Percent, 
  ShieldCheck, Phone, Mail, User, Sparkles, Clock, FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WizardState {
  serviceType: string;
  propertyType: string;
  surfaceMq: number;
  propertyCondition: string;
  timeline: string;
  taxBonus: string;
  location: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export const InteractiveQuoteWizard: React.FC<{
  onFinished?: () => void;
  defaultService?: string;
}> = ({ onFinished, defaultService }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<WizardState>({
    serviceType: defaultService || 'Ristrutturazione Completa',
    propertyType: 'Appartamento',
    surfaceMq: 90,
    propertyCondition: 'Da ristrutturare completamente',
    timeline: 'Entro 2-3 mesi',
    taxBonus: 'Bonus Ristrutturazioni 50%',
    location: 'Monza e Brianza',
    fullName: '',
    phone: '',
    email: '',
    notes: '',
  });

  const servicesList = [
    {
      id: 'Ristrutturazione Completa',
      title: 'Ristrutturazione Completa Chiavi in Mano',
      desc: 'Demolizioni, rifacimento impianti, massetti, pavimenti e finiture',
      icon: Home,
    },
    {
      id: 'Costruzioni & Strutture',
      title: 'Nuova Costruzione & Interventi Strutturali',
      desc: 'Opere in cemento armato, fondazioni, murature portanti, ampliamenti',
      icon: Building2,
    },
    {
      id: 'Facciate & Cappotti',
      title: 'Cappotto Termico & Risanamento Facciate',
      desc: 'Isolamento EPS grafite, rasatura armata, finitura silossanica CAM',
      icon: ShieldCheck,
    },
    {
      id: 'Manutenzione Condomini',
      title: 'Manutenzione Condomini & Parti Comuni',
      desc: 'Tetti, androni, colonne scarico, terrazzi e pronto intervento',
      icon: Wrench,
    },
    {
      id: 'Cartongesso & Parquet',
      title: 'Opere Cartongesso, Velette & Parquet',
      desc: 'Controsoffitti illuminotecnici, pareti acustiche, posa e levigatura legno',
      icon: Layers,
    },
    {
      id: 'Impianti & Serramenti',
      title: 'Impianti Certificati & Posa Serramenti',
      desc: 'Elettrico, idraulico, infissi a taglio termico ad alto isolamento',
      icon: Zap,
    },
  ];

  const propertyTypes = [
    { id: 'Appartamento', label: 'Appartamento Residenziale' },
    { id: 'Villa / Casa Indipendente', label: 'Villa o Casa Singola' },
    { id: 'Condominio / Stabile', label: 'Condominio / Palazzina' },
    { id: 'Locale Commerciale / Capannone', label: 'Capannone / Ufficio' },
  ];

  const conditionOptions = [
    'Da ristrutturare completamente',
    'Ristrutturazione parziale / Ammodernamento',
    'Nuova costruzione da zero',
    'Manutenzione straordinaria urgente',
  ];

  const timelineOptions = [
    { id: 'Urgente (entro 30 giorni)', label: 'Urgente (entro 30 giorni)' },
    { id: 'Entro 2-3 mesi', label: 'A breve (entro 2-3 mesi)' },
    { id: 'Pianificazione per l\'anno prossimo', label: 'Sto valutando per i prossimi mesi' },
  ];

  const bonusOptions = [
    { id: 'Bonus Ristrutturazioni 50%', label: 'Bonus Casa 50% (Ristrutturazioni)' },
    { id: 'Ecobonus / Risparmio Energetico', label: 'Ecobonus (Cappotto e Serramenti)' },
    { id: 'Nessuna / Desidero consulenza fiscale', label: 'Desidero consulenza sulle detrazioni' },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      setErrorMessage('Nome e numero di telefono sono obbligatori.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    // Componi un messaggio dettagliato e chiaro con tutti i parametri del configuratore
    const compiledMessage = `
[CONFIGURATORE GUIDATO BMG SRL]
--------------------------------------------------
Tipo di Intervento: ${formData.serviceType}
Tipologia Immobile: ${formData.propertyType}
Superficie Stimata: ~${formData.surfaceMq} mq
Stato dell'Immobile: ${formData.propertyCondition}
Tempistiche Desiderate: ${formData.timeline}
Detrazioni Fiscali d'Interesse: ${formData.taxBonus}
Comune / Provincia: ${formData.location}

Note Aggiuntive del Cliente:
${formData.notes || 'Nessuna nota specificata.'}
--------------------------------------------------
    `.trim();

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email || 'non_specificata@richiesta.it',
          phone: formData.phone,
          serviceType: formData.serviceType,
          budgetRange: `${formData.surfaceMq} mq (${formData.propertyType})`,
          location: formData.location,
          message: compiledMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore durante l\'invio della richiesta.');
      }

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#c2783b', '#d97706', '#fbbf24', '#ffffff'],
      });
      if (onFinished) onFinished();
    } catch (err: any) {
      setErrorMessage(err.message || 'Errore invio configuratore. Riprova o chiamaci direttamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
      {/* Barra Progresso Step */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          <span>Configuratore Lavori BMG</span>
          <span className="text-brand-terracotta">Passaggio {currentStep} di 4</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-terracotta"
            initial={{ width: '25%' }}
            animate={{ width: `${currentStep * 25}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="max-w-lg mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                Configurazione Ricevuta con Successo!
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Grazie <strong>{formData.fullName}</strong>. Il nostro ufficio tecnico analizzerà la tua richiesta per <strong>{formData.serviceType} (~{formData.surfaceMq} mq a {formData.location})</strong>.
              </p>
              <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-brand-subtle flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Ti ricontatteremo entro 24 ore lavorative per concordare il sopralluogo tecnico gratuito.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="https://wa.me/393485696125?text=Buongiorno%20BMG%20Costruzioni%2C%20ho%20appena%20compilato%20il%20configuratore%20sul%20vostro%20sito."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Hai Urgenza? Scrivici su WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase text-gray-300"
              >
                Nuova Configurazione
              </button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* STEP 1: Tipo di Intervento */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    1. Che tipo di lavoro intendi realizzare?
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Seleziona l'intervento principale desiderato. Potrai specificare ulteriori dettagli in seguito.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {servicesList.map((srv) => {
                    const Icon = srv.icon;
                    const isSelected = formData.serviceType === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setFormData({ ...formData, serviceType: srv.id })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-brand-terracotta/20 border-brand-terracotta shadow-glow-terracotta text-white'
                            : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            isSelected ? 'bg-brand-terracotta text-white' : 'bg-white/10 text-brand-terracotta'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold leading-snug">{srv.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{srv.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all"
                  >
                    <span>Continua a Dimensioni Immobile</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Tipologia & Superficie Immobile */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    2. Tipologia dell'immobile e metratura stimata
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Indica indicativamente la superficie per permetterci di calcolare un dimensionamento accurato.
                  </p>
                </div>

                {/* Selezione Tipo Immobile */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-gray-300">
                    Tipologia dell'edificio:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {propertyTypes.map((pt) => {
                      const isSelected = formData.propertyType === pt.id;
                      return (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyType: pt.id })}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {pt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Slider Superficie mq */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase text-gray-300">
                      Superficie indicativa dell'intervento:
                    </label>
                    <span className="text-2xl font-bold text-brand-terracotta font-mono">
                      {formData.surfaceMq} mq
                    </span>
                  </div>

                  <input
                    type="range"
                    min="30"
                    max="450"
                    step="5"
                    value={formData.surfaceMq}
                    onChange={(e) => setFormData({ ...formData, surfaceMq: Number(e.target.value) })}
                    className="w-full accent-brand-terracotta cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>30 mq (Piccolo)</span>
                    <span>100 mq (Medio)</span>
                    <span>200 mq (Ampio)</span>
                    <span>450+ mq (Grande / Palazzina)</span>
                  </div>
                </div>

                {/* Stato Immobile */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-gray-300">
                    Stato attuale dell'immobile:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {conditionOptions.map((cond) => {
                      const isSelected = formData.propertyCondition === cond;
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setFormData({ ...formData, propertyCondition: cond })}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-brand-terracotta/20 border-brand-terracotta text-white font-bold'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Indietro</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all"
                  >
                    <span>Continua a Tempistiche e Bonus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Tempistiche & Detrazioni Fiscali */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    3. Tempistiche, Località e Agevolazioni Fiscali
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    BMG S.r.l. ti supporta con le pratiche per le detrazioni e l'organizzazione del cantiere.
                  </p>
                </div>

                {/* Tempistiche */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-terracotta" />
                    <span>Quando vorresti avviare i lavori?</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {timelineOptions.map((t) => {
                      const isSelected = formData.timeline === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, timeline: t.id })}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agevolazioni Fiscali */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-gray-300 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-400" />
                    <span>Ti interessa usufruire di detrazioni fiscali / Bonus Casa?</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {bonusOptions.map((b) => {
                      const isSelected = formData.taxBonus === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, taxBonus: b.id })}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500 shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comune / Località dell'immobile */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase text-gray-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-terracotta" />
                    <span>Comune o Zona dell'immobile:</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="es. Caponago, Monza, Agrate, Milano, Vimercate..."
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-brand-terracotta outline-none"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Indietro</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all"
                  >
                    <span>Riepilogo e Contatti</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Riepilogo & Invio Contatto */}
            {currentStep === 4 && (
              <motion.form
                key="step-4"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    4. Riepilogo Stima e Invio Richiesta Sopralluogo
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Inserisci i tuoi recapiti per ricevere la stima economica preliminare e fissare il sopralluogo tecnico gratuito.
                  </p>
                </div>

                {/* Box Riepilogo Parametri Selezionati */}
                <div className="bg-white/5 border border-white/15 rounded-2xl p-4 sm:p-5 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-brand-terracotta uppercase tracking-wider text-[11px] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Riepilogo della tua Configurazione:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                    <div>• <strong>Intervento:</strong> {formData.serviceType}</div>
                    <div>• <strong>Immobile:</strong> {formData.propertyType} (~{formData.surfaceMq} mq)</div>
                    <div>• <strong>Stato:</strong> {formData.propertyCondition}</div>
                    <div>• <strong>Avvio:</strong> {formData.timeline}</div>
                    <div>• <strong>Zona:</strong> {formData.location}</div>
                    <div>• <strong>Detrazioni:</strong> {formData.taxBonus}</div>
                  </div>
                </div>

                {/* Campi Anagrafica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>Nome e Cognome *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="es. Mario Rossi"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-brand-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>Recapito Telefonico *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="es. 348 123 4567"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-brand-terracotta outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>Email (Opzionale)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="es. mario.rossi@email.it"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-brand-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>Note aggiuntive (Opzionale)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="es. piano 3 con ascensore, capitolato pronto..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-brand-terracotta outline-none"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Modifica Parametri</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-terracotta hover:bg-[#a85e2b] text-white font-bold text-xs uppercase tracking-wider shadow-glow-terracotta transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{submitting ? 'Elaborazione in corso...' : 'Invia e Richiedi Sopralluogo Gratuito'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
