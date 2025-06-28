import 'dotenv/config';
import express from 'express';
import { logger } from './lib/logger';
import emailRouter from './routes/email';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', emailRouter);

app.listen(PORT, () => {
  logger.info(`Mail service running on http://localhost:${PORT}`);
});

export default app;
 