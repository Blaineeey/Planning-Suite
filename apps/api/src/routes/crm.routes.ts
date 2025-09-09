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

// Get lead by ID
router.get('/leads/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await prisma.lead.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Update lead
router.put('/leads/:id', authenticateToken, async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete lead
router.delete('/leads/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.lead.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
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

// Get proposal by ID
router.get('/proposals/:id', authenticateToken, async (req, res) => {
  try {
    const proposal = await prisma.proposal.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

// Update proposal
router.put('/proposals/:id', authenticateToken, async (req, res) => {
  try {
    const proposal = await prisma.proposal.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(proposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    res.status(500).json({ error: 'Failed to update proposal' });
  }
});

// Delete proposal
router.delete('/proposals/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.proposal.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    res.status(500).json({ error: 'Failed to delete proposal' });
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

// Get contract by ID
router.get('/contracts/:id', authenticateToken, async (req, res) => {
  try {
    const contract = await prisma.contract.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

// Update contract
router.put('/contracts/:id', authenticateToken, async (req, res) => {
  try {
    const contract = await prisma.contract.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(contract);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

// Delete contract
router.delete('/contracts/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.contract.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ error: 'Failed to delete contract' });
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

// Get invoice by ID
router.get('/invoices/:id', authenticateToken, async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Update invoice
router.put('/invoices/:id', authenticateToken, async (req, res) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/invoices/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.invoice.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
