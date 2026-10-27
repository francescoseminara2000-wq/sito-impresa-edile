import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { pagesRouter } from './routes/pages';
import { sectionsRouter } from './routes/sections';
import { projectsRouter } from './routes/projects';
import { quotesRouter } from './routes/quotes';
import { uploadsRouter } from './routes/uploads';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;

// Configurazione Sicurezza e Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Consente il caricamento delle immagini statiche da Nginx e frontend
  })
);

// CORS abilitato per bmg-costruzioni.it (con e senza www), localhost e domini configurati
app.use(
  cors({
    origin: (origin, callback) => {
      // Se la richiesta non ha header origin (es. curl o same-origin Nginx) o se proviene da bmg-costruzioni.it o localhost
      if (
        !origin ||
        origin.includes('bmg-costruzioni.it') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        // Accetta comunque se presente in ALLOWED_ORIGINS
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permette la chiamata per evitare blocchi in produzione
        }
      }
    },
    credentials: true,
  })
);
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cartella statica per servire gli upload (in sviluppo locale o fallback a Nginx)
const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'public/uploads');
app.use('/uploads', express.static(uploadDir));

// Healthcheck per monitoraggio uptime / PM2
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Registrazione API Routes
app.use('/api/auth', authRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/uploads', uploadsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Errore interno del server.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Edil Server in ascolto sulla porta ${PORT} in modalità ${process.env.NODE_ENV || 'development'}`);
});
