import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { logger } from './logger';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN || '',
});

// Exportamos la instancia para poder espiarla en los tests si es necesario,
// pero el enfoque principal será la inyección de dependencias.
export { mailerSend };

interface SendTransactionalEmailParams {
  to: { email: string; name: string };
  from: { email: string; name: string };
  subject: string;
  html: string;
  text: string;
  variables?: Record<string, unknown>;
}

export async function sendTransactionalEmail(
  params: SendTransactionalEmailParams,
): Promise<void> {
  const { to, from, subject, html, text } = params;

  const sentFrom = new Sender(from.email, from.name);
  const recipients = [new Recipient(to.email, to.name)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html)
    .setText(text);

  try {
    logger.debug({ msg: 'Sending email...', params });
    await mailerSend.email.send(emailParams);
    logger.info({ msg: 'Email sent successfully to', email: to.email });
  } catch (error) {
    logger.error({ msg: 'Error sending email', error });
    throw new Error('Failed to send transactional email.');
  }
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  // Aceptamos un cliente de mailer para facilitar los tests
  mailerClient: { email: { send: (params: EmailParams) => Promise<any> } } = mailerSend
) => {
  const from = new Sender(
    process.env.MAILERSEND_SENDER_EMAIL || 'no-reply@trial-z3m5jgrynokg7qrx.mlsender.net',
    process.env.MAILERSEND_SENDER_NAME || 'DevTailor'
  );

  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(from)
    .setTo(recipients)
    .setSubject(subject)
    .setHtml(html);

  try {
    logger.info(`Sending email to ${to} with subject "${subject}"`);
    const response = await mailerClient.email.send(emailParams);
    logger.info(`Email sent successfully to ${to}. Response ID: ${response.headers['x-message-id']}`);
    return response;
  } catch (error) {
    logger.error({ error }, 'Error sending email');
    throw error;
  }
};
 