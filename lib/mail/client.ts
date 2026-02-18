import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import nodemailer from "nodemailer";

export type EmailAddress = {
  email: string;
  name: string;
};

export type SendMailInput = {
  to: EmailAddress;
  from: EmailAddress;
  subject: string;
  html: string;
  text: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : undefined;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;
  return value.toLowerCase() === "true";
}

function getMailerClient(): MailerSend {
  return new MailerSend({ apiKey: getRequiredEnv("MAILERSEND_API_TOKEN") });
}

function canUseSmtp(): boolean {
  return Boolean(
    getOptionalEnv("ZOHO_SMTP_HOST") &&
      getOptionalEnv("ZOHO_SMTP_USER") &&
      getOptionalEnv("ZOHO_SMTP_PASS"),
  );
}

async function sendWithSmtp(input: SendMailInput): Promise<void> {
  const host = getRequiredEnv("ZOHO_SMTP_HOST");
  const port = Number.parseInt(getOptionalEnv("ZOHO_SMTP_PORT") ?? "465", 10);
  const secure = parseBoolean(getOptionalEnv("ZOHO_SMTP_SECURE"), true);
  const user = getRequiredEnv("ZOHO_SMTP_USER");
  const pass = getRequiredEnv("ZOHO_SMTP_PASS");

  const transporter = nodemailer.createTransport({
    host,
    port: Number.isNaN(port) ? 465 : port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${input.from.name}" <${input.from.email}>`,
    to: `"${input.to.name}" <${input.to.email}>`,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.from.email,
  });
}

async function sendWithMailersend(input: SendMailInput): Promise<void> {
  const mailer = getMailerClient();
  const from = new Sender(input.from.email, input.from.name);
  const to = [new Recipient(input.to.email, input.to.name)];

  const params = new EmailParams()
    .setFrom(from)
    .setTo(to)
    .setSubject(input.subject)
    .setHtml(input.html)
    .setText(input.text);

  await mailer.email.send(params);
}

export async function sendTransactionalEmail(input: SendMailInput): Promise<void> {
  if (canUseSmtp()) {
    await sendWithSmtp(input);
    return;
  }

  await sendWithMailersend(input);
}
