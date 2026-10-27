import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.ionos.it',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true per 465, false per 587 con STARTTLS
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

interface QuoteNotificationData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  budgetRange?: string | null;
  location?: string | null;
  message: string;
}

export async function sendQuoteNotifications(data: QuoteNotificationData) {
  const companyEmail = process.env.COMPANY_ALERT_EMAIL || 'info@impresadiellusso.it';
  const companyName = process.env.COMPANY_NAME || 'EdilPregio Costruzioni';

  // 1. Notifica all'amministrazione / reparto commerciale
  const adminMailOptions = {
    from: `"${companyName} Web" <${process.env.SMTP_USER}>`,
    to: companyEmail,
    subject: `🔔 Nuova Richiesta Preventivo da: ${data.fullName} [${data.serviceType}]`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; border-bottom: 2px solid #C2783B; padding-bottom: 10px;">Nuova Richiesta dal Sito Web</h2>
        <p>Hai ricevuto una nuova richiesta di sopralluogo / preventivo con i seguenti dettagli:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; font-weight: bold; width: 35%; color: #4b5563;">Nome e Cognome:</td><td style="padding: 8px; color: #111827;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4b5563;">Email:</td><td style="padding: 8px; color: #111827;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4b5563;">Telefono:</td><td style="padding: 8px; color: #111827;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4b5563;">Intervento:</td><td style="padding: 8px; color: #C2783B; font-weight: bold;">${data.serviceType}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4b5563;">Budget Indicativo:</td><td style="padding: 8px; color: #111827;">${data.budgetRange || 'Non specificato'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #4b5563;">Località:</td><td style="padding: 8px; color: #111827;">${data.location || 'Non specificata'}</td></tr>
        </table>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #C2783B;">
          <p style="margin: 0; font-weight: bold; color: #111827;">Messaggio / Dettagli:</p>
          <p style="margin-top: 8px; white-space: pre-line; color: #374151;">${data.message}</p>
        </div>
      </div>
    `,
  };

  // 2. Email di conferma / auto-risposta rassicurante al potenziale cliente
  const clientMailOptions = {
    from: `"${companyName}" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `Grazie per averci contattato - ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937; line-height: 1.6;">
        <h1 style="color: #111827; font-size: 22px; margin-bottom: 16px;">Gentile ${data.fullName},</h1>
        <p>Abbiamo ricevuto la sua richiesta di contatto per il progetto relativo a <strong>"${data.serviceType}"</strong>.</p>
        <p>Il nostro ufficio tecnico sta già esaminando la sua richiesta. Un nostro ingegnere o project manager dedicato la ricontatterà entro <strong>24 ore lavorative</strong> per concordare una prima consulenza o un sopralluogo tecnico preliminare gratuito.</p>
        <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Riepilogo recapito telefonico indicato: <strong>${data.phone}</strong></p>
        </div>
        <p style="margin-bottom: 0;">Cordiali saluti,<br><strong>Il Team di ${companyName}</strong><br><span style="font-size: 13px; color: #6b7280;">Eccellenza Costruttiva e Architettura d'Autore</span></p>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);
  } catch (error) {
    console.error('Errore durante l\'invio delle email con Nodemailer:', error);
  }
}
