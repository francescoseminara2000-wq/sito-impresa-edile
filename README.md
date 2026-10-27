# EdilPregio Costruzioni - Web Application & CMS Headless

Web Application enterprise ad altissimo impatto visivo progettata per **imprese edili di alto profilo, studi di architettura e general contractor**.
Include:
- **Frontend Pubblico:** React 18, Vite, Tailwind CSS, Framer Motion (animazioni fluide, reveal mascherati, Ken Burns effect, slider Before & After, form lead con chip interattivi).
- **Backend API:** Node.js (LTS), Express.js in TypeScript, Prisma ORM, MySQL 8, Multer + Sharp (ottimizzazione automatica in formato WebP e generazione miniature).
- **Notifiche Lead:** Nodemailer con credenziali SMTP IONOS (notifica immediata ad amministrazione + autorisposta al cliente).
- **Infrastruttura di Produzione:** Configurazione per **IONOS Linux VPS** con reverse proxy **Nginx**, **PM2** Cluster e script di deploy zero-downtime **`update.sh`**.

---

## 📁 Struttura del Progetto

```
.
├── backend/                     # API RESTful, Prisma ORM, Autenticazione, Upload
│   ├── prisma/
│   │   ├── schema.prisma        # Modello dati MySQL (Pages, Sections, Projects, Quotes, Admin)
│   │   └── seed.ts              # Popolamento iniziale admin e sezioni predefinite
│   ├── src/
│   │   ├── index.ts             # Entry point Express, CORS, Helmet, Static Uploads
│   │   ├── lib/prisma.ts        # Prisma client singleton
│   │   ├── middlewares/
│   │   │   ├── auth.ts          # Protezione rotte tramite token JWT
│   │   │   └── upload.ts        # Multer + Sharp (conversione WebP e thumb 480px)
│   │   ├── routes/
│   │   │   ├── auth.ts          # Login Admin con Bcrypt
│   │   │   ├── pages.ts         # Pagine e sezioni dinamiche per frontend e CMS
│   │   │   ├── sections.ts      # Page builder a blocchi (CRUD e drag & drop reorder)
│   │   │   ├── projects.ts      # Cantieri, gallerie fotografiche e coppie Before/After
│   │   │   ├── quotes.ts        # Lead generation, form preventivi e notifiche email
│   │   │   └── uploads.ts       # Media Manager CMS
│   │   └── services/
│   │       └── email.ts         # Template email Nodemailer
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                    # Single Page Application ad Alto Impatto Visivo
│   ├── src/
│   │   ├── components/
│   │   │   ├── PageRenderer.tsx # Rendering dinamico blocchi con animazioni
│   │   │   ├── layout/          # Header intelligente con blur e Footer coordinato
│   │   │   ├── blocks/          # Blocchi: Hero, BeforeAfter, ServicesGrid, Projects, Stats, CTA
│   │   │   └── ui/              # Componenti UI (BeforeAfterSlider con mouse/touch drag)
│   │   ├── types/blocks.ts      # Schemi TypeScript per i blocchi modulari
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css            # Tipografia Syne/Inter, colori materici #111827 e #C2783B
│   ├── index.html               # Ottimizzazioni SEO e Meta tags
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── deploy/                      # Script e configurazioni per IONOS Linux VPS
    ├── nginx.conf               # Nginx reverse proxy, cache statica, 50M body size, SSL
    ├── ecosystem.config.js      # Configurazione PM2 Cluster per Node.js
    └── update.sh                # Script Bash di deploy continuo zero-downtime
```

---

## 🚀 Guida al Setup su IONOS Linux VPS

### 1. Prerequisiti sul Server Ubuntu/Debian di IONOS
Accedi via SSH alla tua VPS IONOS ed esegui:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server certbot python3-certbot-nginx

# Installa Node.js LTS (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installa PM2 globalmente
sudo npm install -g pm2
pm2 startup
```

### 2. Configurazione Database MySQL
```bash
sudo mysql
```
All'interno del prompt MySQL:
```sql
CREATE DATABASE edil_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'db_user_edil'@'localhost' IDENTIFIED BY 'TuaPasswordSicura123!';
GRANT ALL PRIVILEGES ON edil_db.* TO 'db_user_edil'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clonazione e Configurazione Ambiente
```bash
sudo mkdir -p /var/www/edilizia
sudo chown -R $USER:$USER /var/www/edilizia
git clone <URL_TUO_REPO> /var/www/edilizia
cd /var/www/edilizia

# Configura variabili d'ambiente backend
cp backend/.env.example backend/.env
nano backend/.env # Inserisci la stringa DATABASE_URL, credenziali SMTP IONOS e JWT_SECRET
```

### 4. Primo Deploy e Popolamento Database
```bash
# Rendi eseguibile lo script di deploy
chmod +x deploy/update.sh

# Esegui la prima compilazione e migrazione
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed # Inizializza l'utente admin e la homepage di default
npm run build

cd ../frontend
npm install
npm run build
```

### 5. Avvio Servizio Node con PM2
```bash
cd /var/www/edilizia
pm2 start deploy/ecosystem.config.js --env production
pm2 save
```

### 6. Configurazione Nginx & Certificato SSL
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/edilpregio.conf
sudo ln -s /etc/nginx/sites-available/edilpregio.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verifica sintassi Nginx
sudo nginx -t

# Generazione certificato SSL Let's Encrypt gratuito
sudo certbot --nginx -d tua-impresa-edile.it -d www.tua-impresa-edile.it

# Ricarica Nginx
sudo systemctl reload nginx
```

---

## 🔄 Aggiornamenti Futuri in Produzione
Ogni volta che effettui modifiche al codice e le pubblichi su GitHub/GitLab, ti basterà lanciare dalla VPS il comando:
```bash
/var/www/edilizia/deploy/update.sh
```
Lo script eseguirà automaticamente in modo trasparente e senza interruzioni di servizio:
1. `git pull origin main`
2. Aggiornamento dipendenze
3. Migrazione schema DB con Prisma
4. Build TypeScript & Vite
5. Ricaricamento zero-downtime del cluster con `pm2 reload`
6. Reload configurazione Nginx
