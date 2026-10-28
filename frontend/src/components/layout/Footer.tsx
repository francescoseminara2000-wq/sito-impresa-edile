import React from 'react';
import { HardHat, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0f19] text-gray-400 text-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info BMG Costruzioni / BMG Srl */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo_dark.png" alt="BMG Costruzioni" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              <strong>BMG S.r.l.</strong> - Impresa edile specializzata in costruzioni civili ed industriali, ristrutturazioni chiavi in mano, manutenzioni condominiali ed efficientamento energetico a Monza Brianza, Milano e in tutta la Lombardia.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-brand-terracotta">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Maestranze Qualificate & Lavori Certificati</span>
            </div>
          </div>

          {/* Servizi Principali */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
              I Nostri Servizi
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#servizi" className="hover:text-white transition-colors">Costruzioni Civili ed Industriali</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Ristrutturazioni Chiavi in Mano</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Manutenzione Condomini & Facciate</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Cappotto Termico & Strutture</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Impianti Elettrici & Idraulici</a></li>
              <li><a href="#servizi" className="hover:text-white transition-colors">Cartongesso, Serramenti & Parquet</a></li>
            </ul>
          </div>

          {/* Sede Legale e Recapiti Reali */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
              Sede & Contatti
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong>BMG S.r.l.</strong><br />
                  Via De Gasperi 19<br />
                  20867 Caponago (MB)
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-terracotta shrink-0" />
                <a href="tel:+393485696125" className="hover:text-white transition-colors font-semibold">
                  +39 348 569 6125
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-terracotta shrink-0" />
                <a href="mailto:info@bmg-costruzioni.it" className="hover:text-white transition-colors">
                  info@bmg-costruzioni.it
                </a>
              </li>
            </ul>
          </div>

          {/* Ambiti Operativi */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 font-display">
              Area Operativa
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Operiamo attivamente a Caponago, Monza e Brianza, Milano e su tutto il territorio lombardo, con sopralluoghi rapidi e computi metrici precisi.
            </p>
            <div className="text-[11px] text-gray-500 pt-2 border-t border-white/5">
              Demolizioni • Recinzioni • Finiture d'interni • Interventi Strutturali
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} BMG S.r.l. • Sede Legale: Via De Gasperi 19, 20867 Caponago (MB) • P.IVA / C.F.: In fase di registrazione • REA: MB • Cap. Soc. € 20.000 i.v. • Tutti i diritti riservati.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/cookie" className="hover:text-gray-300">Cookie Policy</a>
            <a href="#preventivo" className="text-brand-terracotta font-medium hover:underline">Richiedi Preventivo</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
