import { ServiceItem } from '../types/blocks';

export interface BmgFullService extends ServiceItem {
  id: string;
  category: 'strutture' | 'involucro' | 'impianti' | 'finiture';
  categoryLabel: string;
  shortTitle: string;
}

export const BMG_ALL_SERVICES: BmgFullService[] = [
  {
    id: 'costruzioni',
    category: 'strutture',
    categoryLabel: 'Costruzioni & Strutture',
    iconName: 'Building2',
    badge: 'Civile & Industriale',
    imageUrl: '/images/servizi/costruzioni.jpg',
    title: 'Costruzioni Civili ed Industriali',
    shortTitle: 'Costruzioni Civili ed Industriali',
    description: 'Realizzazione di nuovi fabbricati, ville, capannoni e complessi industriali dalle fondazioni al tetto con standard antisismici ed energetici all\'avanguardia.',
    fullDetails: 'Dalla progettazione esecutiva e scavi di fondazione fino al grezzo avanzato e alle opere di finitura. Gestiamo commesse sia per privati (ville unifamiliari e plurifamiliari) sia per aziende (capannoni produttivi, magazzini logistici e sedi direzionali) con collaudi statici, certificazioni antisismiche e massima efficienza termica.',
    features: [
      'Nuove costruzioni residenziali e produttive',
      'Strutture portanti in cemento armato e acciaio',
      'Scavi, fondazioni speciali e collaudi statici'
    ],
  },
  {
    id: 'ristrutturazioni',
    category: 'strutture',
    categoryLabel: 'Costruzioni & Strutture',
    iconName: 'Home',
    badge: 'Chiavi in Mano',
    imageUrl: '/images/servizi/ristrutturazioni.jpg',
    title: 'Ristrutturazione Civile ed Industriale',
    shortTitle: 'Ristrutturazione Civile ed Industriale',
    description: 'Riqualificazione completa di appartamenti, ville, uffici e capannoni industriali con ridistribuzione spazi, opere murarie e finiture sartoriali.',
    fullDetails: 'Affidandoti a BMG Srl hai un unico interlocutore responsabile per l\'intero cantiere: dalla demolizione controllata alla rimozione amianto certificata, dal rifacimento impianti a norma fino alla posa di pavimentazioni, resine e tinteggiature. Tempi certi e costi bloccati a computo metrico.',
    features: [
      'Ristrutturazioni integrali residenziali e commerciali',
      'Gestione globale del cantiere chiavi in mano',
      'Tempi garantiti e prezzi bloccati a contratto'
    ],
  },
  {
    id: 'condomini',
    category: 'involucro',
    categoryLabel: 'Condomini & Involucro',
    iconName: 'Layers',
    badge: 'Parti Comuni & Stabili',
    imageUrl: '/images/servizi/condomini.jpg',
    title: 'Manutenzione Condomini',
    shortTitle: 'Manutenzione Condomini',
    description: 'Interventi ordinari e straordinari per condomini e stabili: ripristino frontalini, balconi, impermeabilizzazione terrazzi, coperture e androni.',
    fullDetails: 'Collaboriamo continuativamente con amministratori di condominio in tutta la provincia di Monza Brianza e Milano. Eseguiamo il risanamento del calcestruzzo ammalorato, rifacimento tetti con coibentazione, messa in sicurezza parapetti, impermeabilizzazione terrazzi e manutenzione programmata delle parti comuni.',
    features: [
      'Risanamento facciate, cornicioni e balconi',
      'Impermeabilizzazioni tetti, lastrici solari e terrazzi',
      'Pronto intervento e manutenzione programmata stabili'
    ],
  },
  {
    id: 'demolizioni',
    category: 'strutture',
    categoryLabel: 'Costruzioni & Strutture',
    iconName: 'Hammer',
    badge: 'Sicurezza & Smaltimento',
    imageUrl: '/images/servizi/demolizioni.jpg',
    title: 'Demolizioni',
    shortTitle: 'Demolizioni Controllate',
    description: 'Demolizioni controllate, selettive e strutturali di pareti, solai e manufatti con abbattimento polveri e smaltimento macerie a norma di legge.',
    fullDetails: 'Eseguiamo demolizioni con mezzi meccanici dedicati (mini-escavatori con pinze e martelloni idraulici) e interventi manuali di precisione (strip-out). Salvaguardia assoluta delle parti strutturali confinanti, abbattimento fumi/polveri con nebulizzatori d\'acqua e conferimento autorizzato con formulario rifiuti.',
    features: [
      'Demolizioni controllate e strip-out selettivo',
      'Abbattimento polveri continuo con nebulizzazione',
      'Smaltimento certificato macerie con formulari di legge'
    ],
  },
  {
    id: 'cartongesso',
    category: 'finiture',
    categoryLabel: 'Finiture & Interni',
    iconName: 'Layers',
    badge: 'Design & Isolamento',
    imageUrl: '/images/servizi/cartongesso.jpg',
    title: 'Cartongesso',
    shortTitle: 'Opere in Cartongesso & Velette',
    description: 'Controsoffitti moderni, velette con gole di luce LED, pareti divisorie acustiche, contropareti termiche e soluzioni antincendio certificate REI.',
    fullDetails: 'Realizzazione a regola d\'arte di pareti divisorie, contropareti ad alto isolamento termico e acustico, ribassamenti soffitti per alloggiamento impianti e canali VMC. Integrazione di gole luce per strip LED radenti, botole a scomparsa totale a filo cartongesso e lastre idrorepellenti o antincendio REI.',
    features: [
      'Controsoffitti lineari e velette illuminotecniche a gola',
      'Pareti e contropareti fonoassorbenti ad alta densità',
      'Certificazioni di resistenza al fuoco REI e botole a scomparsa'
    ],
  },
  {
    id: 'imbiancature',
    category: 'finiture',
    categoryLabel: 'Finiture & Interni',
    iconName: 'Paintbrush',
    badge: 'Finiture & Colore',
    imageUrl: '/images/servizi/imbiancature.jpg',
    title: 'Imbiancature',
    shortTitle: 'Imbiancature & Tinteggiature',
    description: 'Tinteggiature professionali per interni ed esterni: pitture traspiranti, lavabili, smalti ecologici, trattamenti antimuffa e finiture materiche.',
    fullDetails: 'Preparazione minuziosa dei fondi con stuccatura, rasatura a gesso o malte fini, applicazione di primer consolidanti e stesura a rullo o airless di pitture di prima qualità. Prodotti ecologici a bassissimo VOC per la salubrità dell\'aria indoor, pitture fotocatalitiche e smalti murali ad alta resistenza.',
    features: [
      'Tinteggiature lavabili, superlavabili e traspiranti',
      'Trattamenti antibatterici, antimuffa e anticondensa',
      'Finiture materiche, smalti ad acqua e spatolati di pregio'
    ],
  },
  {
    id: 'impianti-elettrici',
    category: 'impianti',
    categoryLabel: 'Impianti & Serramenti',
    iconName: 'Zap',
    badge: 'Certificato DM 37/08',
    imageUrl: '/images/servizi/elettrici.jpg',
    title: 'Impianti Elettrici',
    shortTitle: 'Impianti Elettrici Certificati',
    description: 'Progettazione e posa di impianti elettrici civili ed industriali a norma, quadri di distribuzione, domotica e illuminazione architetturale LED.',
    fullDetails: 'Realizzazione integrale dall\'infilaggio cavi ignifughi alla messa a terra certificata: quadri generali con sezionamento differenziale, gestione carichi, illuminotecnica interna ed esterna, impianti citofonici/videocitofonici, reti LAN cablate e predisposizione impianti fotovoltaici ed accumulo.',
    features: [
      'Impianti elettrici completi civili, commerciali e industriali',
      'Quadri generali sezionati, domotica smart e reti dati cablate',
      'Rilascio Dichiarazione di Conformità (Di.Co.) a norma di legge'
    ],
  },
  {
    id: 'impianti-idraulici',
    category: 'impianti',
    categoryLabel: 'Impianti & Serramenti',
    iconName: 'Wrench',
    badge: 'Efficienza Energetica',
    imageUrl: '/images/servizi/idraulici.jpg',
    title: 'Impianti Idraulici',
    shortTitle: 'Impianti Idraulici & Termoidraulici',
    description: 'Impianti idrosanitari, riscaldamento a pavimento radiante, pompe di calore, condizionamento e trattamento acque a elevata efficienza.',
    fullDetails: 'Dalla centrale termica alla posa collettori in acciaio inox e multistrato coibentato: installazione pompe di calore aria-acqua ad alto COP, sistemi ibridi, riscaldamento a pavimento a bassa inerzia termica, climatizzazione canalizzata o split e rifacimento totale scarichi silenziati.',
    features: [
      'Impianti di riscaldamento a pavimento radiante e pompe di calore',
      'Impianti idrosanitari, scarichi insonorizzati e sanitari sospesi',
      'Climatizzazione canalizzata, VMC e collaudi con rilascio Di.Co.'
    ],
  },
  {
    id: 'serramenti',
    category: 'impianti',
    categoryLabel: 'Impianti & Serramenti',
    iconName: 'Maximize2',
    badge: 'Isolamento Termico',
    imageUrl: '/images/servizi/serramenti.jpg',
    title: 'Fornitura Posa e Serramenti',
    shortTitle: 'Fornitura e Posa Serramenti',
    description: 'Installazione certificata di infissi ad alto isolamento termoacustico in PVC, alluminio a taglio termico e legno con vetri basso emissivi.',
    fullDetails: 'Fornitura e posa qualificata PosaClima per eliminare ogni ponte termico del vano finestra. Finestre scorrevoli panoramiche, persiane orientabili, tapparelle coibentate motorizzate con cassonetti termoacustici e portoncini blindati antieffrazione certificati in classe 3 e 4.',
    features: [
      'Serramenti in PVC pluricamera, alluminio termico e legno-alluminio',
      'Posa qualificata PosaClima con nastri autoespandenti certificati',
      'Massimo abbattimento acustico e asseverazione per sgravi fiscali'
    ],
  },
  {
    id: 'recinzioni',
    category: 'strutture',
    categoryLabel: 'Costruzioni & Strutture',
    iconName: 'ShieldCheck',
    badge: 'Sicurezza Perimetrale',
    imageUrl: '/images/servizi/recinzioni.jpg',
    title: 'Recinzioni',
    shortTitle: 'Recinzioni & Muretti di Cinta',
    description: 'Muretti di cinta in cemento armato, cancelli carrai e pedonali, recinzioni metalliche a pannelli o tagliate al laser e grigliati industriali.',
    fullDetails: 'Opere complete di delimitazione e protezione perimetrale: getto di cordoli e fondazioni continue in c.a., posa muretti in calcestruzzo a vista o intonacati, recinzioni a moduli in ferro zincato e verniciato a polveri, pannelli frangivista di design e predisposizione pilastri per cancelli motorizzati.',
    features: [
      'Muretti di cinta e cordoli di fondazione armati in calcestruzzo',
      'Recinzioni modulari in ferro zincato, alluminio e pannelli laser',
      'Cancelli scorrevoli o battenti con predisposizione automazione'
    ],
  },
  {
    id: 'cappotto',
    category: 'involucro',
    categoryLabel: 'Condomini & Involucro',
    iconName: 'Flame',
    badge: 'Risparmio Energetico',
    imageUrl: '/images/servizi/cappotto.jpg',
    title: 'Capotto',
    shortTitle: 'Isolamento a Cappotto Termico',
    description: 'Isolamento termico a cappotto certificato per facciate con pannelli EPS grafite o lana di roccia, rasatura armata e finitura silossanica.',
    fullDetails: 'Riqualificazione energetica dell\'involucro esterno per ville unifamiliari e condomini. Utilizzo di pannelli isolanti certificati CAM ad alta conducibilità termica (EPS con grafite o lana di roccia ignifuga), tassellatura meccanica anti-strappo, doppia rasatura con rete d\'armatura in fibra di vetro e tonachino silossanico traspirante idrorepellente.',
    features: [
      'Pannelli in EPS con grafite certificati CAM e lana di roccia',
      'Rasatura a doppia mano con rete d\'armatura in fibra di vetro',
      'Finitura a spessore silossanica antimuffa ed antialga a lunga durata'
    ],
  },
  {
    id: 'strutturali',
    category: 'strutture',
    categoryLabel: 'Costruzioni & Strutture',
    iconName: 'Building2',
    badge: 'Sicurezza Statica',
    imageUrl: '/images/servizi/strutturali.jpg',
    title: 'Interventi Strutturali',
    shortTitle: 'Interventi Strutturali & Consolidamenti',
    description: 'Consolidamento solai, apertura varchi in muratura portante con cerchiature in acciaio (travi HEB/IPE), sottomurazioni e opere antisismiche.',
    fullDetails: 'Interventi eseguiti rigorosamente su progetto strutturale depositato al Genio Civile: apertura di vani porta o finestre in pareti portanti con telai di cerchiatura metallica precaricati, rinforzo estradossale di solai con soletta collaborante e connettori certificati, incamiciature di pilastri e risanamento fondazioni.',
    features: [
      'Cerchiature in acciaio con profilati HEB/IPE e tirafondi certificati',
      'Rinforzo e consolidamento solai in legno, ferro e laterocemento',
      'Sottomurazioni, cordoli armati e adeguamenti antisismici'
    ],
  },
  {
    id: 'parquet',
    category: 'finiture',
    categoryLabel: 'Finiture & Interni',
    iconName: 'Sparkles',
    badge: 'Artigianalità del Legno',
    imageUrl: '/images/servizi/parquet.jpg',
    title: 'Posa e Levigatura Parquet',
    shortTitle: 'Posa e Levigatura Parquet',
    description: 'Posa in opera e restauro di pavimenti in legno: parquet massello, prefinito, a spina di pesce, levigatura professionale e verniciatura ecologica.',
    fullDetails: 'Artigiani parquettisti con esperienza pluridecennale: verifica igrometrica del massetto, posa incollata o flottante di parquet prefinito o massello in rovere, noce e teak, pose a spina italiana o ungherese. Ripristino e rilamatura di parquet antichi con macchine aspiranti a zero polvere e finiture a vernice all\'acqua opaca o oli naturali.',
    features: [
      'Posa parquet massello, prefinito e maxiplance di design',
      'Geometrie a cassero regolare, spina italiana, francese ed ungherese',
      'Levigatura e restauro senza polvere con finiture ecologiche all\'acqua'
    ],
  },
];

export const SERVICE_CATEGORIES = [
  { id: 'all', label: 'Tutti i Lavori', count: BMG_ALL_SERVICES.length },
  { id: 'strutture', label: 'Costruzioni & Strutture', count: BMG_ALL_SERVICES.filter(s => s.category === 'strutture').length },
  { id: 'involucro', label: 'Condomini & Involucro', count: BMG_ALL_SERVICES.filter(s => s.category === 'involucro').length },
  { id: 'impianti', label: 'Impianti & Serramenti', count: BMG_ALL_SERVICES.filter(s => s.category === 'impianti').length },
  { id: 'finiture', label: 'Finiture & Interni', count: BMG_ALL_SERVICES.filter(s => s.category === 'finiture').length },
];
