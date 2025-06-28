/* eslint-disable no-console */
import 'dotenv/config';
import { MailerSend } from 'mailersend';
import pino from 'pino';

const logger = pino({ level: 'info' });

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_TOKEN || '',
});

async function verifyDomain(domainName: string) {
  if (!domainName) {
    logger.error(
      'Domain name is required. Usage: ts-node scripts/verify-domain.ts <your-domain.com>',
    );
    process.exit(1);
  }

  try {
    logger.info(`Fetching DNS records for domain: ${domainName}...`);

    // First, find the domain ID from the name
    const domainsResponse = await mailerSend.email.domain.list();
    const domain = domainsResponse.body.data.find((d) => d.name === domainName);

    if (!domain) {
      throw new Error(
        `Domain "${domainName}" not found in your MailerSend account.`,
      );
    }

    const { id } = domain;
    const dnsResponse = await mailerSend.email.domain.dns(id);
    const { spf, dkim, return_path, custom_tracking, dmarc } =
      dnsResponse.body.data;

    console.log('--- DNS Records for Verification ---');
    console.log(`Domain: ${domainName}\n`);

    console.log('** SPF Record **');
    console.log(`  Type: TXT`);
    console.log(`  Host: @`);
    console.log(`  Value: ${spf.value}\n`);

    console.log('** DKIM Record **');
    console.log(`  Type: TXT`);
    console.log(`  Host: ${dkim.host}`);
    console.log(`  Value: ${dkim.value}\n`);

    console.log('** Return-Path (CNAME) **');
    console.log(`  Type: CNAME`);
    console.log(`  Host: ${return_path.host}`);
    console.log(`  Value: ${return_path.value}\n`);

    console.log('** Custom Tracking (CNAME) **');
    console.log(`  Type: CNAME`);
    console.log(`  Host: ${custom_tracking.host}`);
    console.log(`  Value: ${custom_tracking.value}\n`);

    if (dmarc) {
      console.log('** DMARC Record (Optional but Recommended) **');
      console.log(`  Type: TXT`);
      console.log(`  Host: ${dmarc.host}`);
      console.log(`  Value: ${dmarc.value}\n`);
    }

    console.log('------------------------------------');
    logger.info('Add these records to your DNS provider to verify the domain.');
  } catch (error: any) {
    logger.error({
      msg: 'Error verifying domain',
      error: error.message || error,
    });
    process.exit(1);
  }
}

const domainToVerify = process.argv[2];
verifyDomain(domainToVerify);
