import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateJwt } from '../middlewares/auth';
import { z } from 'zod';

export const servicesRouter = Router();

export interface ServiceItemData {
  id: string;
  category: string;
  categoryLabel: string;
  iconName: string;
  badge: string;
  imageUrl: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDetails: string;
  features: string[];
  order?: number;
  isVisible?: boolean;
}

export const DEFAULT_SERVICES: ServiceItemData[] = [
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
    order: 0,
    isVisible: true,
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
    order: 1,
    isVisible: true,
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
    order: 2,
    isVisible: true,
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
    order: 3,
    isVisible: true,
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
    order: 4,
    isVisible: true,
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
    order: 5,
    isVisible: true,
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
    order: 6,
    isVisible: true,
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
    order: 7,
    isVisible: true,
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
    order: 8,
    isVisible: true,
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
    order: 9,
    isVisible: true,
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
    order: 10,
    isVisible: true,
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
    order: 11,
    isVisible: true,
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
    order: 12,
    isVisible: true,
  },
];

const ServiceItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  categoryLabel: z.string().min(1),
  iconName: z.string().min(1),
  badge: z.string().default(''),
  imageUrl: z.string().default(''),
  title: z.string().min(2),
  shortTitle: z.string().min(1),
  description: z.string().min(5),
  fullDetails: z.string().default(''),
  features: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

/**
 * Helper per ottenere o creare la sezione SERVICES_GRID della pagina home
 */
async function getOrCreateServicesSection() {
  let homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: {
      sections: {
        where: { type: 'SERVICES_GRID' },
      },
    },
  });

  if (!homePage) {
    homePage = await prisma.page.create({
      data: {
        slug: 'home',
        title: 'Home Page BMG Srl',
        seoTitle: 'BMG S.r.l. - Impresa Edile Caponago, Monza Brianza, Milano',
        seoDesc: 'Costruzioni edili, ristrutturazioni, rifacimento tetti e impianti a Monza e Milano.',
        isPublished: true,
      },
      include: {
        sections: {
          where: { type: 'SERVICES_GRID' },
        },
      },
    });
  }

  let section = homePage.sections[0];
  if (!section) {
    section = await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        type: 'SERVICES_GRID',
        order: 2,
        isVisible: true,
        content: {
          tagline: 'Competenza Globale in Cantiere',
          title: 'Tutti i Servizi Offerti da BMG Srl',
          description:
            'Gestiamo internamente ogni fase: opere strutturali, demolizioni, impianti elettrici ed idraulici, finiture di pregio e posa serramenti con un unico interlocutore responsabile.',
          services: DEFAULT_SERVICES,
        },
      },
    });
  }

  return section;
}

/**
 * GET /api/services
 * Restituisce la lista di tutti i servizi attivi
 */
servicesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const section = await getOrCreateServicesSection();
    const content = section.content as any;
    const services = Array.isArray(content?.services) && content.services.length > 0 
      ? content.services 
      : DEFAULT_SERVICES;
    return res.json(services);
  } catch (error) {
    console.error('Errore get /api/services:', error);
    // In caso di errore DB (es. server locale non connesso a MySQL), restituisce i default
    return res.json(DEFAULT_SERVICES);
  }
});

/**
 * PUT /api/services (ADMIN)
 * Aggiorna l'intera lista dei servizi (incluso l'ordine e aggiunte/modifiche)
 */
servicesRouter.put('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { services } = req.body;
    if (!Array.isArray(services)) {
      return res.status(400).json({ error: 'Array di servizi non valido.' });
    }

    const section = await getOrCreateServicesSection();
    const currentContent = (section.content as any) || {};

    const updatedSection = await prisma.pageSection.update({
      where: { id: section.id },
      data: {
        content: {
          ...currentContent,
          services,
        },
      },
    });

    return res.json({
      success: true,
      message: 'Elenco servizi aggiornato con successo!',
      services: (updatedSection.content as any).services,
    });
  } catch (error: any) {
    console.error('Errore update /api/services:', error);
    return res.status(500).json({ error: error.message || 'Errore nel salvataggio dei servizi.' });
  }
});

/**
 * POST /api/services (ADMIN)
 * Aggiunge un singolo servizio in coda all'elenco
 */
servicesRouter.post('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const newService = ServiceItemSchema.parse(req.body);
    const section = await getOrCreateServicesSection();
    const currentContent = (section.content as any) || {};
    const services: ServiceItemData[] = Array.isArray(currentContent.services)
      ? currentContent.services
      : [...DEFAULT_SERVICES];

    // Verifica unicità ID
    if (services.some((s) => s.id === newService.id)) {
      newService.id = `${newService.id}-${Date.now()}`;
    }

    services.push(newService);

    await prisma.pageSection.update({
      where: { id: section.id },
      data: {
        content: {
          ...currentContent,
          services,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Servizio aggiunto con successo!',
      service: newService,
      services,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Dati del servizio non validi.' });
  }
});

/**
 * PUT /api/services/:id (ADMIN)
 * Modifica un singolo servizio esistente
 */
servicesRouter.put('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const section = await getOrCreateServicesSection();
    const currentContent = (section.content as any) || {};
    let services: ServiceItemData[] = Array.isArray(currentContent.services)
      ? [...currentContent.services]
      : [...DEFAULT_SERVICES];

    const index = services.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Servizio non trovato.' });
    }

    services[index] = {
      ...services[index],
      ...updateData,
      id, // Mantiene l'ID coerente
    };

    await prisma.pageSection.update({
      where: { id: section.id },
      data: {
        content: {
          ...currentContent,
          services,
        },
      },
    });

    return res.json({
      success: true,
      message: 'Servizio aggiornato con successo!',
      service: services[index],
      services,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Errore aggiornamento servizio.' });
  }
});

/**
 * DELETE /api/services/:id (ADMIN)
 * Elimina un servizio dall'elenco
 */
servicesRouter.delete('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const section = await getOrCreateServicesSection();
    const currentContent = (section.content as any) || {};
    let services: ServiceItemData[] = Array.isArray(currentContent.services)
      ? [...currentContent.services]
      : [...DEFAULT_SERVICES];

    services = services.filter((s) => s.id !== id);

    await prisma.pageSection.update({
      where: { id: section.id },
      data: {
        content: {
          ...currentContent,
          services,
        },
      },
    });

    return res.json({
      success: true,
      message: 'Servizio eliminato.',
      services,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Errore eliminazione servizio.' });
  }
});

/**
 * POST /api/services/reset (ADMIN)
 * Ripristina i 13 servizi certificati originali BMG
 */
servicesRouter.post('/reset', authenticateJwt, async (_req: Request, res: Response) => {
  try {
    const section = await getOrCreateServicesSection();
    const currentContent = (section.content as any) || {};

    await prisma.pageSection.update({
      where: { id: section.id },
      data: {
        content: {
          ...currentContent,
          services: DEFAULT_SERVICES,
        },
      },
    });

    return res.json({
      success: true,
      message: 'Elenco servizi ripristinato allo stato originario (13 servizi BMG).',
      services: DEFAULT_SERVICES,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Errore nel ripristino servizi.' });
  }
});

