import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateJwt } from '../middlewares/auth';
import { z } from 'zod';

export const projectsRouter = Router();

const ProjectUpsertSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  category: z.string().min(2),
  location: z.string().min(2),
  year: z.number().int().optional(),
  client: z.string().optional(),
  surface: z.string().optional(),
  description: z.string().min(10),
  highlights: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  images: z
    .array(
      z.object({
        url: z.string(),
        thumbUrl: z.string().optional(),
        caption: z.string().optional(),
        order: z.number().int().default(0),
        isBefore: z.boolean().default(false),
        isAfter: z.boolean().default(false),
        compareGroup: z.string().optional().nullable(),
      })
    )
    .optional(),
});

/**
 * GET /api/projects
 * Lista pubblica dei cantieri/progetti con filtri
 */
projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category, featured, limit } = req.query;

    const where: any = {};
    if (category && typeof category === 'string' && category !== 'Tutti') {
      where.category = category;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      take: limit ? parseInt(limit as string, 10) : undefined,
    });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ error: 'Errore nel recupero dei progetti.' });
  }
});

/**
 * GET /api/projects/:slug
 * Dettaglio cantiere per pagina dedicata con immagini e confronti Before/After
 */
projectsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Progetto non trovato.' });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ error: 'Errore nel recupero della scheda progetto.' });
  }
});

/**
 * POST /api/projects (ADMIN)
 * Creazione nuovo cantiere con galleria fotografica
 */
projectsRouter.post('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const data = ProjectUpsertSchema.parse(req.body);
    const { images, ...projectData } = data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        images: images
          ? {
              create: images.map((img) => ({
                url: img.url,
                thumbUrl: img.thumbUrl,
                caption: img.caption,
                order: img.order,
                isBefore: img.isBefore,
                isAfter: img.isAfter,
                compareGroup: img.compareGroup,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return res.status(201).json(project);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Dati progetto non validi.' });
  }
});

/**
 * PUT /api/projects/:id (ADMIN)
 * Modifica cantiere e aggiornamento immagini
 */
projectsRouter.put('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = ProjectUpsertSchema.parse(req.body);
    const { images, ...projectData } = data;

    // Se vengono fornite immagini, aggiorniamo la galleria
    if (images) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        images: images
          ? {
              create: images.map((img) => ({
                url: img.url,
                thumbUrl: img.thumbUrl,
                caption: img.caption,
                order: img.order,
                isBefore: img.isBefore,
                isAfter: img.isAfter,
                compareGroup: img.compareGroup,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Errore modifica progetto.' });
  }
});

/**
 * DELETE /api/projects/:id (ADMIN)
 */
projectsRouter.delete('/:id', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    return res.json({ message: 'Progetto eliminato con successo.' });
  } catch (error) {
    return res.status(500).json({ error: 'Errore eliminazione progetto.' });
  }
});
