import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTransactionalEmail } from "@/lib/mail/client";
import { buildContactTemplate } from "@/lib/mail/templates/contact";
import { siteConfig } from "@/lib/site.config";

const emailAddressSchema = z.object({
  email: z.string().email("Invalid email address."),
  name: z.string().min(1, "Name is required."),
});

const directEmailSchema = z.object({
  to: emailAddressSchema,
  from: emailAddressSchema,
  subject: z.string().min(1, "Subject is required."),
  html: z.string().min(1, "HTML content is required."),
  text: z.string().min(1, "Text content is required."),
  template: z.string().optional(),
  vars: z.record(z.unknown()).optional(),
});

const contactFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  company: z.string().trim().optional().default(""),
  service: z.string().trim().optional().default(""),
  message: z.string().trim().min(1),
});

const requestSchema = z.union([directEmailSchema, contactFormSchema]);

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getEnvOrFallback(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ message: "Invalid Content-Type." }, { status: 415 });
  }

  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid request body.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if ("to" in parsed.data) {
      await sendTransactionalEmail({
        to: parsed.data.to,
        from: parsed.data.from,
        subject: parsed.data.subject,
        html: parsed.data.html,
        text: parsed.data.text,
      });

      return NextResponse.json({ message: "Email request accepted." }, { status: 202 });
    }

    const recipientEmail = getEnvOrFallback("CONTACT_FORM_TO_EMAIL", siteConfig.email);
    const senderEmail = getEnvOrFallback(
      "MAIL_SENDER_EMAIL",
      getEnvOrFallback("MAILERSEND_SENDER_EMAIL", getEnvOrFallback("ZOHO_SMTP_USER", siteConfig.email)),
    );
    const senderName =
      process.env.MAIL_SENDER_NAME || process.env.MAILERSEND_SENDER_NAME || siteConfig.legalName;

    const template = buildContactTemplate(parsed.data);

    await sendTransactionalEmail({
      to: { email: recipientEmail, name: `Contacto ${siteConfig.legalName}` },
      from: { email: senderEmail, name: senderName },
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({ message: "Email request accepted." }, { status: 202 });
  } catch (error) {
    console.error("[mail/send] Failed to process request", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
