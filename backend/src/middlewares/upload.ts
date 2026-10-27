import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Cartelle di destinazione per i file
const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR || 'public/uploads');
const OPTIMIZED_DIR = path.join(UPLOAD_ROOT, 'optimized');
const THUMB_DIR = path.join(UPLOAD_ROOT, 'thumbs');

// Assicura l'esistenza delle directory su disco
[UPLOAD_ROOT, OPTIMIZED_DIR, THUMB_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage in memoria per consentire a Sharp di elaborare i buffer direttamente
const storage = multer.memoryStorage();

// Filtro tipi di file accettati
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato file non supportato. Carica immagini JPG, PNG, WEBP o AVIF.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limite 50MB (coerente con client_max_body_size su Nginx)
  },
  fileFilter,
});

export interface ProcessedUploadedFile {
  originalName: string;
  fileName: string;
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  size: number;
}

declare global {
  namespace Express {
    interface Request {
      processedFiles?: ProcessedUploadedFile[];
      processedFile?: ProcessedUploadedFile;
    }
  }
}

/**
 * Middleware di elaborazione immagini con Sharp:
 * - Conversione automatica in WebP ad alta fedeltà
 * - Creazione versione principale (max 1920px, qualità 85%)
 * - Creazione miniatura 'thumb_' (max 480px, qualità 80%)
 */
export const processImagesWithSharp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawFiles: Express.Multer.File[] = [];

    if (req.file) {
      rawFiles.push(req.file);
    } else if (Array.isArray(req.files)) {
      rawFiles.push(...req.files);
    } else if (req.files && typeof req.files === 'object') {
      Object.values(req.files).forEach((files) => {
        rawFiles.push(...files);
      });
    }

    if (rawFiles.length === 0) {
      return next();
    }

    const processedList: ProcessedUploadedFile[] = [];

    for (const file of rawFiles) {
      const timestamp = Date.now();
      const sanitizedBase = path
        .parse(file.originalname)
        .name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const uniqueName = `${sanitizedBase}-${timestamp}.webp`;
      const thumbName = `thumb_${uniqueName}`;

      const optimizedPath = path.join(OPTIMIZED_DIR, uniqueName);
      const thumbPath = path.join(THUMB_DIR, thumbName);

      // 1. Elaborazione Immagine Principale (max 1920px di larghezza o altezza, maintain aspect ratio)
      const sharpInstance = sharp(file.buffer).rotate(); // auto-orientamento EXIF
      const metadata = await sharpInstance.metadata();

      const optimizedInfo = await sharpInstance
        .resize({
          width: 1920,
          height: 1920,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .webp({ quality: 85, effort: 4 })
        .toFile(optimizedPath);

      // 2. Elaborazione Miniatura / Thumbnail (max 480px)
      await sharp(file.buffer)
        .rotate()
        .resize({
          width: 480,
          height: 480,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .webp({ quality: 80, effort: 3 })
        .toFile(thumbPath);

      processedList.push({
        originalName: file.originalname,
        fileName: uniqueName,
        url: `/uploads/optimized/${uniqueName}`,
        thumbUrl: `/uploads/thumbs/${thumbName}`,
        width: optimizedInfo.width || 0,
        height: optimizedInfo.height || 0,
        size: optimizedInfo.size,
      });
    }

    req.processedFiles = processedList;
    req.processedFile = processedList[0];

    next();
  } catch (error) {
    next(error);
  }
};
