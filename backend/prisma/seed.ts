import { PrismaClient, SectionType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Avvio popolamento database...');

  // 1. Creazione Admin User di default
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@edilpregio.it';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'EdilPregio2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Amministratore Edilizia',
      passwordHash,
    },
  });
  console.log(`👤 Utente Admin configurato: ${admin.email} (Password: ${defaultPassword})`);

  // 2. Creazione Pagina Home
  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Homepage Principale',
      seoTitle: 'EdilPregio Costruzioni | Ristrutturazioni e Architettura di Pregio',
      seoDesc: 'Impresa edile d\'eccellenza specializzata in ristrutturazioni di lusso chiavi in mano, nuove costruzioni ad alta efficienza e restauro conservativo.',
      isPublished: true,
    },
  });

  // 3. Sezioni Iniziali per la Home
  const existingSections = await prisma.pageSection.count({ where: { pageId: homePage.id } });
  if (existingSections === 0) {
    await prisma.pageSection.createMany({
      data: [
        {
          pageId: homePage.id,
          type: SectionType.HERO,
          order: 0,
          isVisible: true,
          content: {
            badge: 'Impresa Edile d\'Eccellenza • Garanzia Decennale',
            title: 'Architettura d\'Autore e',
            highlightedWord: 'Precisione Costruttiva',
            subtitle:
              'Dalla ristrutturazione conservativa di dimore storiche alla realizzazione di ville moderne a impatto zero: trasformiamo ogni progetto in un\'opera d\'arte duratura.',
            primaryCtaText: 'Richiedi un Sopralluogo',
            primaryCtaLink: '#preventivo',
            secondaryCtaText: 'Esplora i Cantieri',
            secondaryCtaLink: '#cantieri',
            backgroundImage:
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85',
            statsPreview: [
              { number: '35+', label: 'Anni di Esperienza' },
              { number: '280+', label: 'Cantieri Portati a Termine' },
              { number: '100%', label: 'Rispetto Cronoprogramma' },
              { number: '10 Anni', label: 'Garanzia Postuma Decennale' },
            ],
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.STATS,
          order: 1,
          isVisible: true,
          content: {
            stats: [
              { value: '45.000', suffix: ' mq', label: 'Superficie Ristrutturata', sublabel: 'Standard energetici classe A4' },
              { value: '100', suffix: '%', label: 'Consegna nei Tempi', sublabel: 'Penali garantite a contratto' },
              { value: '42', suffix: ' Tecnici', label: 'Personale Diretto Specializzato', sublabel: 'Ingegneri, geometri e maestranze' },
              { value: '250', suffix: 'k€', label: 'Capitale Sociale i.v.', sublabel: 'Solidità finanziaria verificata' },
            ],
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.BEFORE_AFTER,
          order: 2,
          isVisible: true,
          content: {
            title: 'Prima e Dopo: La Rinascita di una Dimora Storica',
            subtitle: 'Guarda il confronto visivo tra lo stato originario e la riqualificazione eseguita.',
            description: 'Recupero filologico delle modanature in gesso, consolidamento solai e installazione impianti VMC a scomparsa totale.',
            beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
            afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            beforeLabel: 'Prima: Stato di Degrado',
            afterLabel: 'Dopo: Realizzazione Conclusa',
            details: [
              { label: 'Tempo di Esecuzione', value: '7 Mesi con consegna anticipata' },
              { label: 'Classe Energetica', value: 'Da G ad A2 certificata' },
            ],
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.CTA_FORM,
          order: 3,
          isVisible: true,
          content: {
            title: 'Diamo Forma al Tuo Progetto',
            subtitle: 'Richiedi una consulenza preliminare e un sopralluogo tecnico senza impegno con il nostro ufficio tecnico.',
          },
        },
      ],
    });
    console.log('📄 Sezioni predefinite create per la Homepage.');
  }

  // 4. Progetto dimostrativo nel Portfolio
  const existingProject = await prisma.project.findFirst();
  if (!existingProject) {
    await prisma.project.create({
      data: {
        slug: 'villa-panoramica-lago',
        title: 'Villa Orobica: Restauro Conservativo e Nuova Ala Panoramica',
        category: 'Residenziale di Pregio',
        location: 'Bergamo Alta',
        year: 2024,
        client: 'Privato',
        surface: '520 mq',
        description: 'Intervento completo di consolidamento fondazioni, realizzazione di nuova facciata vetrata strutturale e finiture con pietra locale lavorata a mano.',
        isFeatured: true,
        order: 0,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
              thumbUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=480&q=80',
              caption: 'Prospetto esterno con piscina a sfioro',
              order: 0,
              isAfter: true,
            },
            {
              url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85',
              thumbUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=480&q=80',
              caption: 'Stato iniziale del fabbricato rurale',
              order: 1,
              isBefore: true,
              compareGroup: 'panoramica',
            },
          ],
        },
      },
    });
    console.log('🏢 Cantiere dimostrativo inserito nel portfolio.');
  }

  console.log('✅ Seed completato con successo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
