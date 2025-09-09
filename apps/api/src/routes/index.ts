import { Router } from 'express';
import authRoutes from './auth.routes';
import crmRoutes from './crm.routes';
import projectsRoutes from './projects.routes';
import statsRoutes from './stats.routes';
import guestsRoutes from './guests.routes';
import vendorsRoutes from './vendors.routes';
import websitesRoutes from './websites.routes';
import budgetRoutes from './budget.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/crm', crmRoutes);
router.use('/projects', projectsRoutes);
router.use('/stats', statsRoutes);
router.use('/guests', guestsRoutes);
router.use('/vendors', vendorsRoutes);
router.use('/websites', websitesRoutes);
router.use('/budget', budgetRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
