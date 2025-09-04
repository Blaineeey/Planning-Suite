import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);

// Add more routes as needed
// router.use('/projects', projectRoutes);
// router.use('/leads', leadRoutes);
// router.use('/invoices', invoiceRoutes);

export default router;
