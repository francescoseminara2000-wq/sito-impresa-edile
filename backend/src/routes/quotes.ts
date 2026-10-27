import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateJwt } from '../middlewares/auth';
import { sendQuoteNotifications } from '../services/email';
import { z } from 'zod';
import { QuoteStatus } from '@prisma/client';

export const quotesRouter = Router();

const CreateQuoteSchema = z.object({
  fullName: z.string().min(2, 'Il nome e cognome sono obbligatori.'),
  email: z.string().email('Inserisci un indirizzo email valido.'),
  phone: z.string().min(6, 'Inserisci un recapito telefonico valido.'),
  serviceType: z.string().min(2, 'Seleziona una tipologia di intervento.'),
  budgetRange: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  message: z.string().min(10, 'Fornisci una breve descrizione della tua richiesta (min. 10 caratteri).'),
});

/**
 * POST /api/quotes
 * Ricezione form preventivo/sopralluogo pubblico
 */
quotesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = CreateQuoteSchema.parse(req.body);

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    const newQuote = await prisma.quoteRequest.create({
      data: {
        ...parsed,
        ipAddress: clientIp,
        userAgent,
        status: QuoteStatus.NEW,
      },
    });

    // Invia notifiche asincrone con Nodemailer (admin + autorisposta al cliente)
    sendQuoteNotifications({
      fullName: newQuote.fullName,
      email: newQuote.email,
      phone: newQuote.phone,
      serviceType: newQuote.serviceType,
      budgetRange: newQuote.budgetRange,
      location: newQuote.location,
      message: newQuote.message,
    }).catch((err) => console.error('Errore background email quote:', err));

    return res.status(201).json({
      success: true,
      message: 'Richiesta ricevuta con successo! Verrai ricontattato entro 24 ore.',
      id: newQuote.id,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message || 'Dati non validi.' });
    }
    return res.status(500).json({ error: 'Errore interno durante l\'invio della richiesta.' });
  }
});

/**
 * GET /api/quotes (ADMIN)
 * Lista lead con filtri di stato
 */
quotesRouter.get('/', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status as QuoteStatus;
    }

    const quotes = await prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json(quotes);
  } catch (error) {
    return res.status(500).json({ error: 'Errore recupero richieste preventivo.' });
  }
});

/**
 * PATCH /api/quotes/:id/status (ADMIN)
 * Cambio stato richiesta e note interne
 */
quotesRouter.patch('/:id/status', authenticateJwt, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: status ? (status as QuoteStatus) : undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Errore aggiornamento stato lead.' });
  }
});
