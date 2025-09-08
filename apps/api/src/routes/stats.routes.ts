import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get overview stats
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    // Get counts
    const [
      leads,
      projects,
      guests,
      vendors,
      users,
      proposals,
      contracts,
      invoices
    ] = await Promise.all([
      prisma.lead.count({ where: { organizationId } }),
      prisma.project.count({ where: { organizationId } }),
      prisma.guest.count({ 
        where: { 
          project: { organizationId } 
        } 
      }),
      prisma.vendor.count(),
      prisma.user.count({ where: { organizationId } }),
      prisma.proposal.count({ where: { organizationId } }),
      prisma.contract.count({ where: { organizationId } }),
      prisma.invoice.findMany({ 
        where: { 
          organizationId,
          status: 'PAID'
        } 
      })
    ]);

    // Calculate revenue
    const revenue = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    res.json({
      leads,
      projects,
      guests,
      vendors,
      users,
      proposals,
      contracts,
      revenue,
      organizations: 1,
      websites: 0,
      products: 0,
      orders: 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats on error
    res.json({
      leads: 0,
      projects: 0,
      guests: 0,
      vendors: 0,
      users: 1,
      proposals: 0,
      contracts: 0,
      revenue: 0,
      organizations: 1,
      websites: 0,
      products: 0,
      orders: 0
    });
  }
});

export default router;
