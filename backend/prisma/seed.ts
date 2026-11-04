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
      title: 'BMG Costruzioni • Caponago (MB)',
      seoTitle: 'BMG S.r.l. - Impresa Edile Caponago, Monza Brianza, Milano',
      seoDesc: 'Costruzioni edili, ristrutturazioni, rifacimento tetti e impianti a Monza e Milano.',
      isPublished: true,
    },
  });

  // 3. Sezioni Iniziali per la Home (BMG Standard 1:1)
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
            badge: 'BMG Srl • Impresa Edile Caponago (MB)',
            title: 'Costruzioni e Ristrutturazioni',
            highlightedWord: 'Civili ed Industriali',
            subtitle:
              'Dalla nuova costruzione alle ristrutturazioni complete, manutenzioni condominiali, cappotti termici e impianti certificati a Monza e Brianza, Milano e Lombardia.',
            primaryCtaText: 'Richiedi Preventivo e Sopralluogo',
            primaryCtaLink: '#preventivo',
            secondaryCtaText: 'I Nostri Servizi',
            secondaryCtaLink: '#servizi',
            backgroundImage: '/images/cantieri/cantiere-10.jpg',
            statsPreview: [
              { number: '100%', label: 'Lavori Certificati a Norma' },
              { number: '13+', label: 'Ambiti di Specializzazione' },
              { number: 'Chiavi in Mano', label: 'Unico Referente per Tutto' },
              { number: 'Caponago (MB)', label: 'Sede e Ufficio Tecnico' },
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
              { value: 'Civile & Industriale', label: 'Settori di Intervento', sublabel: 'Dall\'appartamento al capannone' },
              { value: 'Sicurezza', suffix: ' 100%', label: 'Conformità Cantieri', sublabel: 'DURC regolare e POS aggiornati' },
              { value: 'Chiavi in Mano', label: 'Gestione Integrale', sublabel: 'Opere murarie, impianti e finiture' },
              { value: 'Rapidità', label: 'Sopralluoghi Gratuiti', sublabel: 'Preventivi trasparenti e dettagliati' },
            ],
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.SERVICES_GRID,
          order: 2,
          isVisible: true,
          content: {
            tagline: 'Competenza Globale in Cantiere',
            title: 'Tutti i Servizi Offerti da BMG Srl',
            description:
              'Gestiamo internamente ogni fase: opere strutturali, demolizioni, impianti elettrici ed idraulici, finiture di pregio e posa serramenti con un unico interlocutore responsabile.',
            services: [
              {
                id: 'costruzioni',
                category: 'strutture',
                categoryLabel: 'Costruzioni & Strutture',
                iconName: 'Building2',
                badge: 'Civile & Industriale',
                imageUrl: '/images/servizi/costruzioni.jpg',
                title: 'Costruzioni Civili ed Industriali',
                shortTitle: 'Costruzioni Civili ed Industriali',
                description: 'Realizzazione di nuovi fabbricati, ville, capannoni e complessi industriali dalle fondazioni al tetto con standard antisismici ed energetici all\'avanguardia.',
                fullDetails: 'Dalla progettazione esecutiva e scavi di fondazione fino al grezzo avanzato e alle opere di finitura. Gestiamo commesse sia per privati sia per aziende con collaudi statici, certificazioni antisismiche e massima efficienza termica.',
                features: ['Nuove costruzioni residenziali e produttive', 'Strutture portanti in cemento armato e acciaio', 'Scavi, fondazioni speciali e collaudi statici'],
              },
              {
                id: 'ristrutturazioni',
                category: 'strutture',
                categoryLabel: 'Costruzioni & Strutture',
                iconName: 'Home',
                badge: 'Chiavi in Mano',
                imageUrl: '/images/servizi/ristrutturazioni.jpg',
                title: 'Ristrutturazione Civile ed Industriale',
                shortTitle: 'Ristrutturazione Civile ed Industriale',
                description: 'Riqualificazione completa di appartamenti, ville, uffici e capannoni industriali con ridistribuzione spazi, opere murarie e finiture sartoriali.',
                fullDetails: 'Affidandoti a BMG Srl hai un unico interlocutore responsabile per l\'intero cantiere: dalla demolizione controllata alla rimozione amianto certificata, dal rifacimento impianti a norma fino alla posa di pavimentazioni, resine e tinteggiature.',
                features: ['Ristrutturazioni integrali residenziali e commerciali', 'Gestione globale del cantiere chiavi in mano', 'Tempi garantiti e prezzi bloccati a contratto'],
              },
              {
                id: 'condomini',
                category: 'involucro',
                categoryLabel: 'Condomini & Involucro',
                iconName: 'Layers',
                badge: 'Parti Comuni & Stabili',
                imageUrl: '/images/servizi/condomini.jpg',
                title: 'Manutenzione Condomini',
                shortTitle: 'Manutenzione Condomini',
                description: 'Interventi ordinari e straordinari per condomini e stabili: ripristino frontalini, balconi, impermeabilizzazione terrazzi, coperture e androni.',
                fullDetails: 'Collaboriamo continuativamente con amministratori di condominio in tutta la provincia di Monza Brianza e Milano. Risanamento calcestruzzo ammalorato, rifacimento tetti e impermeabilizzazioni.',
                features: ['Risanamento facciate, cornicioni e balconi', 'Impermeabilizzazioni tetti e terrazzi', 'Pronto intervento e manutenzione programmata stabili'],
              },
            ],
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.BEFORE_AFTER,
          order: 3,
          isVisible: true,
          content: {
            title: 'Prima e Dopo: Ristrutturazione Completa',
            subtitle:
              'Dallo stato originario e di cantiere grezzo alla finitura chiavi in mano curata in ogni dettaglio.',
            description:
              'Demolizione pareti esistenti, nuovo impianto elettrico ed idraulico a pavimento, isolamento termoacustico, cartongesso ribassato e posa parquet levigato.',
            beforeImage: '/images/cantieri/cantiere-03.jpg',
            afterImage: '/images/cantieri/cantiere-04.jpg',
            beforeLabel: 'Prima dell\'Intervento',
            afterLabel: 'Consegna Lavori Finita',
            details: [
              { label: 'Ubicazione Lavori', value: 'Monza e Brianza / Milano' },
              { label: 'Opere Eseguite', value: 'Demolizione, Impianti, Cartongesso e Parquet' },
              { label: 'Tempi di Consegna', value: 'Rispettati rigorosamente a contratto' },
            ],
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.PROJECTS_SHOWCASE,
          order: 4,
          isVisible: true,
          content: {
            tagline: 'I Nostri Cantieri',
            title: 'Realizzazioni e Opere Eseguite da BMG Srl',
            description: 'Opere residenziali, commerciali ed industriali realizzate con maestranze dirette e massima precisione costruttiva.',
          },
        },
        {
          pageId: homePage.id,
          type: SectionType.CTA_FORM,
          order: 5,
          isVisible: true,
          content: {
            title: 'Richiedi un Preventivo Gratuito a BMG Srl',
            subtitle:
              'Compila il modulo o contattaci direttamente al +39 348 569 6125. Effettuiamo sopralluoghi tecnici gratuiti e senza impegno a Caponago, Monza Brianza e Milano.',
            servicesOptions: [
              'Costruzione Civile / Industriale',
              'Ristrutturazione Completa',
              'Manutenzione Condominio',
              'Cappotto Termico / Facciate',
              'Impianti Elettrici / Idraulici',
              'Cartongesso / Imbiancature',
              'Fornitura e Posa Serramenti',
              'Posa e Levigatura Parquet',
              'Demolizioni / Interventi Strutturali',
              'Recinzioni',
            ],
            budgetOptions: [
              'Meno di 25.000€',
              '25.000€ - 50.000€',
              '50.000€ - 100.000€',
              'Oltre 100.000€',
            ],
          },
        },
      ],
    });
    console.log('📄 Sezioni BMG 1:1 create per la Homepage.');
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
