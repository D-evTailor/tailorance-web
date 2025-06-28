import { Router, Request, Response } from 'express';
import pino from 'pino';
import { sendTransactionalEmail } from '../lib/mailer';
import { validateEmailRequest } from '../middleware/validation';

const router = Router();
const logger = pino({ level: 'info' });

router.post('/', validateEmailRequest, async (req: Request, res: Response) => {
  // NOTE: Validation will be added in the next step.
  const { to, from, subject, html, text } = req.body;

  try {
    await sendTransactionalEmail({
      to,
      from,
      subject,
      html,
      text,
    });

    res.status(202).json({ message: 'Email request accepted.' });
  } catch (error) {
    logger.error({
      msg: 'Failed to process email request',
      error,
      body: req.body,
    });
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
