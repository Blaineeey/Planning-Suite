import { Router } from 'express';
import authRoutes from './auth.routes';
import crmRoutes from './crm.routes';
import projectsRoutes from './projects.routes';
import statsRoutes from './stats.routes';
import guestsRoutes from './guests.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/crm', crmRoutes);
router.use('/projects', projectsRoutes);
router.use('/stats', statsRoutes);
router.use('/guests', guestsRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
