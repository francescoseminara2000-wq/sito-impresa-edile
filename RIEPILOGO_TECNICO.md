# 🏗️ BMG Costruzioni — Riepilogo Tecnico & Struttura del Progetto

> **Documento Tecnico di Riepilogo**  
> **Azienda:** BMG S.r.l. — Impresa Edile (Caponago, Monza Brianza, Milano)  
> **Stack:** React 18, Vite, TypeScript, TailwindCSS, Framer Motion, Node.js, Express, Prisma ORM, MySQL, Nginx, PM2  
> **Data:** Ottobre 2026  

---

## 📑 Indice
1. [Panoramica del Progetto](#1-panoramica-del-progetto)
2. [Stack Tecnologico Completo](#2-stack-tecnologico-completo)
3. [Albero & Struttura del Repository](#3-albero--struttura-del-repository)
4. [Dettaglio Lavori Svolti & Componenti Implementati](#4-dettaglio-lavori-svolti--componenti-implementati)
   - [4.1 Header & Barra di Navigazione Superiore](#41-header--barra-di-navigazione-superiore)
   - [4.2 Suite di Animazioni di Pregio (Awwwards Grade)](#42-suite-di-animazioni-di-pregio-awwwards-grade)
   - [4.3 Cursore Personalizzato "Studio Architettura"](#43-cursore-personalizzato-studio-architettura)
   - [4.4 Sezione Servizi & Scheda Modale Dettagli](#44-sezione-servizi--scheda-modale-dettagli)
   - [4.5 Gestione Completa Servizi nell'Admin CMS](#45-gestione-completa-servizi-nelladmin-cms)
   - [4.6 Risoluzione Visibilità Sezioni & Database Seed](#46-risoluzione-visibilità-sezioni--database-seed)
5. [Configurazione Server & Deploy su IONOS VPS](#5-configurazione-server--deploy-su-ionos-vps)
6. [Guida Operativa Rapida](#6-guida-operativa-rapida)

---

## 1. Panoramica del Progetto

Il progetto è una **Web Application moderna ad alte prestazioni** sviluppata per **BMG S.r.l.**, impresa edile d'eccellenza con sede a Caponago (MB), attiva su Monza Brianza, Milano e in tutta la Lombardia.

L'applicazione integra:
- Un **frontend pubblico ultra-moderno** con design "Capsula Sospesa" (Floating Island), animazioni fluide a 60/120fps, sezioni interattive (prima/dopo, configuratore guidato, galleria fotografica dei cantieri reali).
- Un **pannello di amministrazione (CMS)** riservato per la gestione dei cantieri/portfolio, personalizzazione dei blocchi pagina (Page Builder) e ricezione delle richieste di preventivo.
- Un **backend RESTful** in TypeScript per l'archiviazione dati, gestione autenticazione JWT, caricamento e compressione immagini in formato WebP, e invio notifiche email SMTP.

---

## 2. Stack Tecnologico Completo

### Frontend (`/frontend`)
| Tecnologia | Versione / Scopo |
| :--- | :--- |
| **React** | `18.3.1` (Architettura a componenti funzionali e hook) |
| **Vite** | `5.4.2` (Build tool ad altissima velocità e Hot Module Replacement) |
| **TypeScript** | `5.5.3` (Tipizzazione statica rigorosa per blocchi e dati) |
| **TailwindCSS** | `3.4.10` (Design system personalizzato con palette materica BMG) |
| **Framer Motion** | `11.5.4` (Fisica a molla, layout animations, sliding pills, 3D tilt) |
| **Lucide React** | `0.439.0` (Iconografia vettoriale moderna e leggera) |
| **canvas-confetti** | `1.9.4` (Effetto particellare celebrativo post-preventivo) |

### Backend (`/backend`)
| Tecnologia | Versione / Scopo |
| :--- | :--- |
| **Node.js + Express** | `4.19.2` (Server HTTP e router API RESTful) |
| **TypeScript** | Compilazione con target ES2022 |
| **Prisma ORM** | `5.19.1` (Accesso al database MySQL e gestione migrazioni) |
| **MySQL** | Database relazionale su IONOS VPS |
| **Sharp** | Elaborazione e ottimizzazione immagini con conversione WebP |
| **Nodemailer** | Gestione invio email preventivi tramite server SMTP IONOS |
| **JWT + Bcrypt** | Autenticazione sicura per l'amministratore |

### Produzione & Deploy (`/deploy`)
- **Web Server & Reverse Proxy:** Nginx con compressione Gzip e caching asset
- **Process Manager:** PM2 (Cluster mode, restart automatico, zero-downtime reload)
- **Certificato SSL:** Let's Encrypt con Certbot e rinnovo automatico
- **Scripting:** `deploy/update.sh` (Pipeline automatizzata di git pull, build e reload)

---

## 3. Albero & Struttura del Repository

```text
Sito impresa edile/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelli DB (AdminUser, Page, PageSection, Project, Quote)
│   │   └── seed.ts             # Script di popolamento iniziale con dati e sezioni
│   ├── src/
│   │   ├── routes/             # auth.ts, pages.ts, projects.ts, quotes.ts, sections.ts, uploads.ts
│   │   ├── services/           # email.ts, storage.ts
│   │   └── index.ts            # Entrypoint backend Express
│   └── package.json
│
├── deploy/
│   ├── ecosystem.config.js     # Configurazione PM2 per produzione
│   ├── nginx.conf              # Configurazione virtual host Nginx (porta 80/443 e reverse proxy)
│   └── update.sh               # Script di aggiornamento zero-downtime da lanciare su IONOS
│
├── frontend/
│   ├── public/
│   │   ├── images/cantieri/    # Fotografie ad alta risoluzione dei cantieri BMG
│   │   ├── logo.png            # Logo BMG Costruzioni versione chiara
│   │   └── logo_dark.png       # Logo BMG Costruzioni versione scura
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminDashboard.tsx, PageBuilderCMS.tsx, ProjectManagerCMS.tsx
│   │   │   ├── blocks/         # HeroBlock, StatsBlock, ServicesGridBlock, BeforeAfterBlock,
│   │   │   │                   # ProjectsShowcaseBlock, ContactFormBlock, TextImageBlock, FaqBlock
│   │   │   ├── layout/         # Header.tsx (Navbar), Footer.tsx
│   │   │   └── ui/             # CustomCursor, ServiceDetailModal, SpotlightCard, CountUp,
│   │   │                       # BeforeAfterSlider, FullPhotoGalleryModal, InteractiveQuoteWizard, WhatsAppButton
│   │   ├── types/
│   │   │   └── blocks.ts       # Interfacce TypeScript di tutti i blocchi e dei servizi
│   │   ├── App.tsx             # Componente radice, fetch sezioni con fallback e modali
│   │   ├── index.css           # Direttive Tailwind e stili base
│   │   └── main.tsx            # Bootstrap React
│   ├── tailwind.config.js      # Palette brand BMG, ombre personalizzate e font display
│   └── package.json
└── README.md
```

---

## 4. Dettaglio Lavori Svolti & Componenti Implementati

### 4.1 Header & Barra di Navigazione Superiore ([Header.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/layout/Header.tsx))
1. **Design a Capsula Sospesa (Floating Island)**:
   - Sostituita la precedente barra statica con una capsula galleggiante satinata (`backdrop-blur-2xl`, bordo sottile in vetro e ombra ad alta definizione).
   - Eliminato il disordine visivo: rimossi slogan lunghi, orari di apertura stipati e testi duplicati a fianco del logo.
2. **Larghezza Stabile & Riduzione Sottile di Altezza**:
   - La larghezza della capsula è vincolata a `max-w-7xl` senza mai subire compressioni orizzontali anomale.
   - Tutti gli elementi (`+39 348 569 6125` e `Richiedi Preventivo`) restano sempre rigorosamente su **singola riga** (`whitespace-nowrap`).
   - Quando l'utente scorre la pagina in basso, l'altezza della barra si riduce delicatamente da `py-5` a `py-2.5` e il logo scala a `h-8.5`, lasciando il massimo spazio visivo ai contenuti.
3. **Chip di Selezione nel Blu Scuro del Tema (`#0f172a`)**:
   - Integrato un chip con animazione magnetica (`layoutId`) nello stesso colore blu scuro/ardesia profondo del tema.
   - **Al passaggio del mouse (Hover):** il chip segue istantaneamente la voce puntata.
   - **Allo scroll della pagina (Scrollspy Continuo):** rileva in tempo reale le coordinate geometriche delle sezioni (`#servizi`, `#cantieri`, `#chi-siamo`, `#preventivo`) evidenziando automaticamente la voce corrispondente.
4. **Hairline Reading Progress Bar**:
   - Micro-linea da 2px incorporata alla base della capsula con gradiente sfumato che si estende da 0 a 100% durante la lettura della pagina.

---

### 4.2 Suite di Animazioni di Pregio (Awwwards Grade)
1. **Contatore Numerico Dinamico ([CountUp.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/ui/CountUp.tsx))**:
   - Componente React ad alte prestazioni basato su `requestAnimationFrame` con curva di decelerazione cubica (*ease-out*).
   - Applicato alle metriche in [StatsBlock.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/blocks/StatsBlock.tsx) e nell'anteprima numerica di [HeroBlock.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/blocks/HeroBlock.tsx).
2. **Inclinazione 3D e Riflettore Radiale ([SpotlightCard.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/ui/SpotlightCard.tsx))**:
   - Calcola in tempo reale la posizione del cursore rispetto alla card generando una rotazione su asse X e Y (`rotateX`, `rotateY` con fisica a molla) e un bagliore radiale caldo che segue il mouse.
   - Integrato su tutte le card dei servizi in [ServicesGridBlock.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/blocks/ServicesGridBlock.tsx).
3. **Esplosione di Coriandoli Celebrativi ([canvas-confetti](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/package.json))**:
   - Trigger animato all'invio con successo del modulo di preventivo ([ContactFormBlock.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/blocks/ContactFormBlock.tsx)) e al completamento del configuratore guidato a 4 passaggi ([InteractiveQuoteWizard.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/ui/InteractiveQuoteWizard.tsx)), con coriandoli nei colori aziendali terracotta e oro.

---

### 4.3 Cursore Personalizzato "Studio Architettura" ([CustomCursor.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/ui/CustomCursor.tsx))
- **Puntino di Precisione:** Micro-dot centrale terracotta `#C2783B` con rendering hardware-accelerated.
- **Anello Trailing Fluido:** Anello con inerzia elastica (`framer-motion` spring: stiffness 350, damping 25) che insegue il puntatore.
- **Micro-Mirino Tecnico su Elementi Cliccabili:** Al passaggio su link, pulsanti o card, l'anello si espande di 1.6x, assume uno sfondo ambrato e fa apparire una crocetta tecnica da mirino.
- **Click Feedback:** Effetto contrazione elastica alla pressione del mouse.
- **Auto-Disabilitazione Touch:** Rileva automaticamente schermi touch per disattivarsi ed evitare conflitti su smartphone e tablet.

---

### 4.4 Sezione Servizi & Scheda Modale Dettagli ([ServicesGridBlock.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/blocks/ServicesGridBlock.tsx) & [ServiceDetailModal.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/ui/ServiceDetailModal.tsx))
- **Card Arricchite**: Supportano badge di specializzazione (es. *"Civile & Industriale"*, *"Chiavi in Mano"*, *"Detrazione Fiscale"*), foto del cantiere di riferimento in testata, icona 3D, sintesi descrittiva e checklist delle caratteristiche.
- **Finestra Modale a Schermo Intero**: Cliccando su *"Dettagli"* o sulla card, si apre un modal con:
  - Fotografia ad alta risoluzione del lavoro eseguito.
  - Spiegazione tecnica approfondita delle metodologie operative.
  - Punti di forza e garanzie di conformità normativa (DURC, collaudi statici, certificazioni DM 37/08).
  - Tasto di contatto rapido *"Richiedi Preventivo per questo Servizio"* e chiamata diretta.
  - Chiusura rapida con tasto Esc, pulsante o click sul backdrop.

---

### 4.5 Gestione Completa Servizi nell'Admin CMS ([PageBuilderCMS.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/admin/PageBuilderCMS.tsx))
All'interno dell'Area Riservata (sezione Page Builder):
- **Intestazione Sezione:** Modifica in tempo reale di tagline, titolo e descrizione introduttiva.
- **Gestore Servizi Dinamico:**
  - Pulsante **`+ Aggiungi Servizio`** per creare nuove lavorazioni.
  - Pulsanti **Sposta Su / Sposta Giù** per definire l'ordine delle card a schermo.
  - Pulsante **Elimina** con conferma di sicurezza.
  - **Campi configurabili:** Nome servizio, badge, selezione icona da catalogo (Edilizia, Ristrutturazioni, Cappotti, Impianti, Serramenti, Finiture, ecc.), descrizione breve, dettagli estesi per il modal, URL foto con selettore visuale rapido dalla galleria BMG, ed elenco punti di forza con aggiunta e rimozione dinamica.

---

### 4.6 Risoluzione Visibilità Sezioni & Database Seed
- **Problema rilevato:** Il database MySQL sul server conteneva solo le 4 sezioni generate dallo script seed originario, escludendo i servizi e il portfolio cantieri dall'endpoint `/api/pages/home`.
- **Risoluzione Implementata:**
  1. In [App.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/App.tsx): implementato un meccanismo di *Smart Merge* che verifica se la risposta dell'API include `SERVICES_GRID` e `PROJECTS_SHOWCASE`. In caso contrario, inietta automaticamente i blocchi predefiniti completi senza interruzioni.
  2. In [ServicesGridBlock.tsx](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/frontend/src/components/blocks/ServicesGridBlock.tsx): inserito un set di fallback robusto per garantire che le 6 lavorazioni principali con foto e dettagli siano sempre visibili.
  3. In [seed.ts](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/backend/prisma/seed.ts): aggiornato il seeder del database backend con tutte le sezioni complete.

---

## 5. Configurazione Server & Deploy su IONOS VPS

### Configurazione Virtual Host Nginx ([deploy/nginx.conf](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/deploy/nginx.conf))
- **Frontend SPA:** Servito da `/var/www/edilizia/frontend/dist` con fallback `try_files $uri $uri/ /index.html;`.
- **API Proxy:** Inoltro richieste `/api/` al cluster Node.js PM2 attivo in locale su porta `3002`.
- **Media Uploads:** Alias statico `/uploads/` verso `/var/www/edilizia/backend/public/uploads/` con header di cache a 30 giorni.

### Pipeline di Aggiornamento Automatizzata ([deploy/update.sh](file:///c:/Users/franc/Documents/Antigravity/Sito%20impresa%20edile/deploy/update.sh))
Lo script esegue sequenzialmente:
1. `git pull origin main`
2. Verifica permessi directory media `/uploads`
3. `cd backend && npm install && npx prisma generate && npx prisma db push && npm run build`
4. `cd frontend && npm install && npm run build`
5. `pm2 reload deploy/ecosystem.config.js --env production` (Zero-downtime)
6. `systemctl reload nginx`

---

## 6. Guida Operativa Rapida

### A. Sviluppo Locale (Windows)

```powershell
# Avvio Backend (Porta 3001 o 3002)
cd backend
npm run dev

# Avvio Frontend (Porta 5173)
cd frontend
npm.cmd run dev
```

### B. Aggiornamento in Produzione (IONOS VPS Linux)

Dalla tua sessione SSH (`ssh root@<IP_SERVER>`):

```bash
cd /var/www/edilizia

# 1. Rimuovi eventuali conflitti locali sul package-lock (se presenti)
rm -f frontend/package-lock.json

# 2. Scarica gli ultimi commit dal repository
git pull origin main

# 3. Compila la nuova versione del frontend
cd frontend
npm install
npm run build

# 4. Ricarica Nginx per applicare le modifiche istantaneamente
systemctl reload nginx
```

### C. Accesso all'Area Riservata (CMS)
- **URL di accesso:** `https://tuo-dominio.it/#admin` oppure cliccando sul badge `🔒 Area Riservata` in basso a sinistra nel sito.
- **Credenziali predefinite:**
  - **Email:** `admin@edilpregio.it`
  - **Password:** `EdilPregio2026!`
