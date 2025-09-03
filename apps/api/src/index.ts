// apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middleware/error-handler';
import { logger } from './utils/logger';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}));

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`API server running on port ${config.port}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    logger.info('Server closed');
  });
});