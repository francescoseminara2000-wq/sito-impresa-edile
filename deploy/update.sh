#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DI DEPLOY AUTOMATIZZATO - IONOS LINUX VPS
# Web Application Impresa Edile (Backend Node/Express + Frontend React/Vite)
# ==============================================================================

set -e # Interrompe l'esecuzione in caso di errore in uno dei comandi

PROJECT_ROOT="/var/www/edilizia"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
UPLOAD_DIR="$PROJECT_ROOT/backend/public/uploads"

echo "=========================================================="
echo "🏗️  Avvio Pipeline di Aggiornamento su IONOS VPS..."
echo "📅  Data: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================================="

cd "$PROJECT_ROOT"

# 1. Recupero degli ultimi aggiornamenti dal repository Git
echo "📥 1/7 Esecuzione Git Pull..."
git pull origin main

# 2. Creazione e verifica permessi directory upload
echo "📁 2/7 Verifica permessi directory media (/uploads)..."
mkdir -p "$UPLOAD_DIR/optimized" "$UPLOAD_DIR/thumbs"
# Assicura che l'utente www-data e il processo PM2 possano leggere e scrivere
chmod -R 775 "$UPLOAD_DIR"

# 3. Aggiornamento Backend
echo "⚙️  3/7 Installazione dipendenze e Build Backend..."
cd "$BACKEND_DIR"
npm install --production=false

echo "🗄️  4/7 Generazione Prisma Client e Sincronizzazione Database MySQL..."
npx prisma generate
npx prisma db push

echo "🔨  Compilazione TypeScript Backend..."
npm run build

# 4. Aggiornamento Frontend (React + Vite)
echo "🎨 5/7 Installazione dipendenze e Build Frontend (Vite)..."
cd "$FRONTEND_DIR"
npm install
npm run build

# 5. Riavvio Zero-Downtime del Server Node con PM2
echo "🚀 6/7 Riavvio Zero-Downtime del processo PM2..."
cd "$PROJECT_ROOT"
pm2 reload "$PROJECT_ROOT/deploy/ecosystem.config.js" --env production || pm2 start "$PROJECT_ROOT/deploy/ecosystem.config.js" --env production

# 6. Ricarica configurazione Nginx
echo "🌐 7/7 Reload del Web Server Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "=========================================================="
echo "✅ DEPLOY COMPLETATO CON SUCCESSO!"
echo "🌐 Frontend attivo su /var/www/edilizia/frontend/dist"
echo "⚙️  API attiva in cluster mode su porta 3001"
echo "=========================================================="
