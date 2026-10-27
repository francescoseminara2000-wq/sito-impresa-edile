import React from 'react';
import { Hammer, MapPin, Mail, Phone, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f19] text-gray-400 text-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-terracotta flex items-center justify-center text-white">
                <Hammer className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Edil<span className="text-brand-terracotta">Pregio</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Progettazione, ristrutturazioni di prestigio e costruzioni civili e commerciali con standard qualitativi d'eccellenza e rispetto rigoroso dei cronoprogrammi.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-brand-terracotta">
              <Shield className="w-3.5 h-3.5" />
              <span>Certificazione SOA & ISO 9001</span>
            </div>
          </div>

          {/* Servizi Chiave */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
              Ambiti di Intervento
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#servizi" className="hover:text-white transition-colors">Ristrutturazioni Chiavi in Mano</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Costruzioni Residenziali Passive</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Restauro Conservativo Monumentale</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Riqualificazione Energetica & Facciate</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Interior Architecture & Direzione Lavori</a></li>
            </ul>
          </div>

          {/* Sede e Contatti */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
              Sede & Recapiti
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                <span>Via Monte Napoleone 18, 20121 Milano (MI)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span>+39 02 8900 1234</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span>info@edilpregio.it</span>
              </li>
            </ul>
          </div>

          {/* Certificazioni e Garanzie */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
              Garanzie Tecniche
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Tutti i nostri cantieri sono coperti da polizza assicurativa CAR (Contractor's All Risks) e garanzia postuma decennale a tutela totale del committente.
            </p>
            <div className="text-[11px] text-gray-500">
              P.IVA & C.F. 09876543210 • REA MI-2039481 • Capitale Sociale € 250.000 i.v.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} EdilPregio Costruzioni s.r.l. - Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/cookie" className="hover:text-gray-300">Cookie Policy</a>
            <a href="/admin" className="hover:text-brand-terracotta font-medium">Area Riservata CMS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
