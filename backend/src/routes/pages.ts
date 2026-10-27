import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateJwt } from '../middlewares/auth';
import { z } from 'zod';

export const pagesRouter = Router();

// Schema di validazione
const PageUpsertSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  isPublished: z.boolean().default(true),
});

/**
 * GET /api/pages/:slug
 * Rotta pubblica per ottenere una pagina con tutte le sue sezioni visibili ordinate
 */
pagesRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
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
pagesRouter.get('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
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
    const page = await prisma.page.findUnique({
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

    return res.json(page);
  } catch (error) {
    return res.status(500).json({ error: 'Errore nel recupero della pagina admin.' });
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
