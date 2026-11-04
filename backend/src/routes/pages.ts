import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateJwt } from '../middlewares/auth';
import { z } from 'zod';
import { SectionType } from '@prisma/client';
import { DEFAULT_SERVICES } from './services';

export const pagesRouter = Router();

// Schema di validazione
const PageUpsertSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  isPublished: z.boolean().default(true),
});

// 6 Blocchi Ufficiali BMG Srl perfettamente allineati tra Home e CMS
export const BMG_CANONICAL_SECTIONS = [
  {
    type: 'HERO',
    order: 0,
    isVisible: true,
    content: {
      badge: 'BMG Srl • Impresa Edile Caponago (MB)',
      title: 'Costruzioni e Ristrutturazioni',
      highlightedWord: 'Civili ed Industriali',
      subtitle:
        'Dalla nuova costruzione alle ristrutturazioni complete, manutenzioni condominiali, cappotti termici e impianti certificati a Monza e Brianza, Milano e Lombardia.',
      primaryCtaText: 'Richiedi Preventivo e Sopralluogo',
      primaryCtaLink: '#preventivo',
      secondaryCtaText: 'I Nostri Servizi',
      secondaryCtaLink: '#servizi',
      backgroundImage: '/images/cantieri/cantiere-10.jpg',
      statsPreview: [
        { number: '100%', label: 'Lavori Certificati a Norma' },
        { number: '13+', label: 'Ambiti di Specializzazione' },
        { number: 'Chiavi in Mano', label: 'Unico Referente per Tutto' },
        { number: 'Caponago (MB)', label: 'Sede e Ufficio Tecnico' },
      ],
    },
  },
  {
    type: 'STATS',
    order: 1,
    isVisible: true,
    content: {
      stats: [
        { value: 'Civile & Industriale', label: 'Settori di Intervento', sublabel: 'Dall\'appartamento al capannone' },
        { value: 'Sicurezza', suffix: ' 100%', label: 'Conformità Cantieri', sublabel: 'DURC regolare e POS aggiornati' },
        { value: 'Chiavi in Mano', label: 'Gestione Integrale', sublabel: 'Opere murarie, impianti e finiture' },
        { value: 'Rapidità', label: 'Sopralluoghi Gratuiti', sublabel: 'Preventivi trasparenti e dettagliati' },
      ],
    },
  },
  {
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
  {
    type: 'BEFORE_AFTER',
    order: 3,
    isVisible: true,
    content: {
      title: 'Prima e Dopo: Ristrutturazione Completa',
      subtitle:
        'Dallo stato originario e di cantiere grezzo alla finitura chiavi in mano curata in ogni dettaglio.',
      description:
        'Demolizione pareti esistenti, nuovo impianto elettrico ed idraulico a pavimento, isolamento termoacustico, cartongesso ribassato e posa parquet levigato.',
      beforeImage: '/images/cantieri/cantiere-03.jpg',
      afterImage: '/images/cantieri/cantiere-04.jpg',
      beforeLabel: 'Prima dell\'Intervento',
      afterLabel: 'Consegna Lavori Finita',
      details: [
        { label: 'Ubicazione Lavori', value: 'Monza e Brianza / Milano' },
        { label: 'Opere Eseguite', value: 'Demolizione, Impianti, Cartongesso e Parquet' },
        { label: 'Tempi di Consegna', value: 'Rispettati rigorosamente a contratto' },
      ],
    },
  },
  {
    type: 'PROJECTS_SHOWCASE',
    order: 4,
    isVisible: true,
    content: {
      tagline: 'I Nostri Cantieri',
      title: 'Realizzazioni e Opere Eseguite da BMG Srl',
      description: 'Opere residenziali, commerciali ed industriali realizzate con maestranze dirette e massima precisione costruttiva.',
    },
  },
  {
    type: 'CTA_FORM',
    order: 5,
    isVisible: true,
    content: {
      title: 'Richiedi un Preventivo Gratuito a BMG Srl',
      subtitle:
        'Compila il modulo o contattaci direttamente al +39 348 569 6125. Effettuiamo sopralluoghi tecnici gratuiti e senza impegno a Caponago, Monza Brianza e Milano.',
      servicesOptions: [
        'Costruzione Civile / Industriale',
        'Ristrutturazione Completa',
        'Manutenzione Condominio',
        'Cappotto Termico / Facciate',
        'Impianti Elettrici / Idraulici',
        'Cartongesso / Imbiancature',
        'Fornitura e Posa Serramenti',
        'Posa e Levigatura Parquet',
        'Demolizioni / Interventi Strutturali',
        'Recinzioni',
      ],
      budgetOptions: [
        'Meno di 25.000€',
        '25.000€ - 50.000€',
        '50.000€ - 100.000€',
        'Oltre 100.000€',
      ],
    },
  },
];

/**
 * Assicura che la pagina home esista e abbia le sezioni BMG perfettamente allineate
 */
async function getOrCreateHomePageWithSections() {
  let homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!homePage) {
    homePage = await prisma.page.create({
      data: {
        slug: 'home',
        title: 'BMG Costruzioni • Caponago (MB)',
        seoTitle: 'BMG S.r.l. - Impresa Edile Caponago, Monza Brianza, Milano',
        seoDesc: 'Costruzioni edili, ristrutturazioni, rifacimento tetti e impianti a Monza e Milano.',
        isPublished: true,
      },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // Se la pagina home non ha sezioni nel DB, inserisce le 6 sezioni canoniche
  if (homePage.sections.length === 0) {
    for (let i = 0; i < BMG_CANONICAL_SECTIONS.length; i++) {
      const sec = BMG_CANONICAL_SECTIONS[i];
      await prisma.pageSection.create({
        data: {
          pageId: homePage.id,
          type: sec.type as SectionType,
          order: i,
          isVisible: true,
          content: sec.content as any,
        },
      });
    }

    homePage = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    }) as any;
  }

  return homePage;
}

/**
 * GET /api/pages/:slug
 * Rotta pubblica per ottenere una pagina con tutte le sue sezioni visibili ordinate
 */
pagesRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (slug === 'home') {
      const homePage = await getOrCreateHomePageWithSections();
      const visibleSections = homePage.sections.filter((s: any) => s.isVisible);
      return res.json({
        ...homePage,
        sections: visibleSections,
      });
    }

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      return res.status(404).json({ error: 'Pagina non trovata.' });
    }

    return res.json(page);
  } catch (error) {
    return res.status(500).json({ error: 'Errore nel recupero della pagina.' });
  }
});

/**
 * GET /api/pages (ADMIN)
 * Lista di tutte le pagine con il conteggio delle sezioni
 */
pagesRouter.get('/', authenticateJwt, async (_req: Request, res: Response) => {
  try {
    await getOrCreateHomePageWithSections(); // Assicura che la home esista con le sezioni corrette
    const pages = await prisma.page.findMany({
      include: {
        _count: {
          select: { sections: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return res.json(pages);
  } catch (error) {
    return res.status(500).json({ error: 'Errore nel recupero della lista pagine.' });
  }
});

/**
 * GET /api/pages/admin/:id (ADMIN)
 * Dettaglio pagina con tutte le sezioni (anche non visibili) per il Page Builder
 */
pagesRouter.get('/admin/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let page = await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      return res.status(404).json({ error: 'Pagina non trovata.' });
    }

    // Se è la pagina home ed è vuota nel DB, la popoliamo
    if (page.slug === 'home' && page.sections.length === 0) {
      await getOrCreateHomePageWithSections();
      page = await prisma.page.findUnique({
        where: { id },
        include: {
          sections: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    return res.json(page);
  } catch (error) {
    return res.status(500).json({ error: 'Errore nel recupero della pagina admin.' });
  }
});

/**
 * POST /api/pages/admin/:id/sync-defaults (ADMIN)
 * Allinea forzatamente tutti i blocchi della pagina con lo standard ufficiale BMG
 */
pagesRouter.post('/admin/:id/sync-defaults', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) {
      return res.status(404).json({ error: 'Pagina non trovata.' });
    }

    // Rimuove tutte le sezioni obsolete esistenti per questa pagina
    await prisma.pageSection.deleteMany({ where: { pageId: id } });

    // Inserisce i 6 blocchi canonici completi
    for (let i = 0; i < BMG_CANONICAL_SECTIONS.length; i++) {
      const sec = BMG_CANONICAL_SECTIONS[i];
      await prisma.pageSection.create({
        data: {
          pageId: id,
          type: sec.type as SectionType,
          order: i,
          isVisible: true,
          content: sec.content as any,
        },
      });
    }

    const updated = await prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Tutti i blocchi sono stati allineati con la Home Page!',
      page: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Errore durante la sincronizzazione blocchi.' });
  }
});

/**
 * POST /api/pages (ADMIN)
 * Creazione nuova pagina
 */
pagesRouter.post('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const parsed = PageUpsertSchema.parse(req.body);
    const page = await prisma.page.create({
      data: parsed,
    });
    return res.status(201).json(page);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Dati non validi.' });
  }
});

/**
 * PUT /api/pages/:id (ADMIN)
 * Aggiornamento metadati SEO e titolo pagina
 */
pagesRouter.put('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = PageUpsertSchema.partial().parse(req.body);
    const updated = await prisma.page.update({
      where: { id },
      data: parsed,
    });
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Errore aggiornamento pagina.' });
  }
});

/**
 * DELETE /api/pages/:id (ADMIN)
 */
pagesRouter.delete('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.page.delete({ where: { id } });
    return res.json({ message: 'Pagina eliminata con successo.' });
  } catch (error) {
    return res.status(500).json({ error: 'Errore durante l\'eliminazione della pagina.' });
  }
});
