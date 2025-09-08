import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all leads
router.get('/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Create a new lead
router.post('/leads', authenticateToken, async (req, res) => {
  try {
    const lead = await prisma.lead.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
      },
    });
    res.json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Get all proposals
router.get('/proposals', authenticateToken, async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Get all contracts
router.get('/contracts', authenticateToken, async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Get all invoices
router.get('/invoices', authenticateToken, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Create a proposal
router.post('/proposals', authenticateToken, async (req, res) => {
  try {
    const proposal = await prisma.proposal.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
      },
    });
    res.json(proposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
});

// Create a contract
router.post('/contracts', authenticateToken, async (req, res) => {
  try {
    const contract = await prisma.contract.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
      },
    });
    res.json(contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
});

// Create an invoice
router.post('/invoices', authenticateToken, async (req, res) => {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
      },
    });
    res.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

export default router;
