import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateJwt } from '../middlewares/auth';
import { z } from 'zod';
import { SectionType } from '@prisma/client';

export const sectionsRouter = Router();

const CreateSectionSchema = z.object({
  pageId: z.string().uuid(),
  type: z.nativeEnum(SectionType),
  order: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  content: z.record(z.any()), // JSON tipizzato dal CMS
});

const UpdateSectionSchema = z.object({
  type: z.nativeEnum(SectionType).optional(),
  order: z.number().int().optional(),
  isVisible: z.boolean().optional(),
  content: z.record(z.any()).optional(),
});

/**
 * POST /api/sections (ADMIN)
 * Aggiunta di un nuovo blocco a una pagina
 */
sectionsRouter.post('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const data = CreateSectionSchema.parse(req.body);

    // Se l'ordine non è specificato, lo posiziona in fondo
    if (data.order === 0) {
      const lastSection = await prisma.pageSection.findFirst({
        where: { pageId: data.pageId },
        orderBy: { order: 'desc' },
      });
      data.order = lastSection ? lastSection.order + 1 : 0;
    }

    const section = await prisma.pageSection.create({ data });
    return res.status(201).json(section);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Dati del blocco non validi.' });
  }
});

/**
 * PUT /api/sections/:id (ADMIN)
 * Aggiornamento di un blocco (contenuto, visibilità o titolo)
 */
sectionsRouter.put('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = UpdateSectionSchema.parse(req.body);
    const updated = await prisma.pageSection.update({
      where: { id },
      data,
    });
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Errore aggiornamento blocco.' });
  }
});

/**
 * POST /api/sections/reorder (ADMIN)
 * Riordinamento drag-and-drop sequenziale dei blocchi di una pagina
 */
sectionsRouter.post('/reorder', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: { id: string; order: number }[] };

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Struttura ordini non valida.' });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.pageSection.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return res.json({ success: true, message: 'Ordine sezioni aggiornato.' });
  } catch (error) {
    return res.status(500).json({ error: 'Errore durante il riordinamento delle sezioni.' });
  }
});

/**
 * DELETE /api/sections/:id (ADMIN)
 * Eliminazione blocco
 */
sectionsRouter.delete('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pageSection.delete({ where: { id } });
    return res.json({ message: 'Sezione rimossa con successo.' });
  } catch (error) {
    return res.status(500).json({ error: 'Errore eliminazione sezione.' });
  }
});
