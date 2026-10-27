import { Router, Request, Response } from 'express';
import { authenticateJwt } from '../middlewares/auth';
import { uploadMiddleware, processImagesWithSharp } from '../middlewares/upload';

export const uploadsRouter = Router();

/**
 * POST /api/uploads/single (ADMIN)
 * Caricamento e conversione WebP di una singola immagine
 */
uploadsRouter.post(
  '/single',
  authenticateJwt,
  uploadMiddleware.single('image'),
  processImagesWithSharp,
  (req: Request, res: Response) => {
    if (!req.processedFile) {
      return res.status(400).json({ error: 'Nessun file immagine fornito o elaborato.' });
    }

    return res.status(201).json({
      success: true,
      file: req.processedFile,
    });
  }
);

/**
 * POST /api/uploads/multiple (ADMIN)
 * Caricamento bulk di più fotografie cantiere
 */
uploadsRouter.post(
  '/multiple',
  authenticateJwt,
  uploadMiddleware.array('images', 20), // fino a 20 immagini per volta
  processImagesWithSharp,
  (req: Request, res: Response) => {
    if (!req.processedFiles || req.processedFiles.length === 0) {
      return res.status(400).json({ error: 'Nessuna immagine valida caricata.' });
    }

    return res.status(201).json({
      success: true,
      files: req.processedFiles,
    });
  }
);
