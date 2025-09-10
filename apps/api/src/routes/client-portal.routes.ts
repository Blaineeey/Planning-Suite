import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// ============= CLIENT PORTAL =============

// Client login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find project by client email
    const project = await prisma.project.findFirst({
      where: { clientEmail: email },
      include: {
        organization: true,
        guests: { take: 5 },
        tasks: { where: { status: 'TODO' }, take: 5 },
        budgets: { include: { categories: true } },
        invoices: { where: { status: { not: 'PAID' } } }
      }
    });

    if (!project) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (simplified - in production, store hashed client passwords)
    // For MVP, we'll use a simple password check
    const validPassword = password === 'wedding2024'; // Default password for all clients
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate client token
    const token = jwt.sign(
      { 
        projectId: project.id,
        clientEmail: email,
        organizationId: project.organizationId,
        role: 'CLIENT'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      project: {
        id: project.id,
        name: project.name,
        eventDate: project.eventDate,
        clientName: project.clientName,
        guestCount: project.guests.length,
        venue: project.venue
      }
    });
  } catch (error) {
    console.error('Client login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get client project details
router.get('/project', authenticateClient, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.client.projectId },
      include: {
        guests: true,
        tasks: {
          where: {
            OR: [
              { status: 'TODO' },
              { status: 'IN_PROGRESS' }
            ]
          },
          orderBy: { dueDate: 'asc' }
        },
        timelines: { orderBy: { order: 'asc' } },
        budgets: { include: { categories: true } },
        websites: true,
        invoices: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Error fetching client project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get client invoices
router.get('/invoices', authenticateClient, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { projectId: req.client.projectId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get client contracts
router.get('/contracts', authenticateClient, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.client.projectId },
      select: { clientEmail: true }
    });

    const contracts = await prisma.contract.findMany({
      where: {
        lead: {
          email: project?.clientEmail
        }
      },
      include: {
        signatureRequests: {
          where: { recipientEmail: project?.clientEmail }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// Update guest RSVP
router.post('/guests/:guestId/rsvp', authenticateClient, async (req, res) => {
  try {
    const { rsvpStatus, mealSelection, dietaryRestrictions } = req.body;
    
    const guest = await prisma.guest.update({
      where: { 
        id: req.params.guestId,
        projectId: req.client.projectId
      },
      data: {
        rsvpStatus,
        mealSelection,
        dietaryRestrictions
      }
    });
    
    res.json(guest);
  } catch (error) {
    console.error('Error updating RSVP:', error);
    res.status(500).json({ error: 'Failed to update RSVP' });
  }
});

// Middleware to authenticate client
function authenticateClient(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'CLIENT') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    req.client = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export default router;
