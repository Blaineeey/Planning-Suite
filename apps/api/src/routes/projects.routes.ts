import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      include: {
        venue: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Create a new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: {
        ...req.body,
        organizationId: req.user.organizationId,
        createdById: req.user.id,
      },
    });
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      include: {
        venue: true,
        guests: true,
      },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Get project guests
router.get('/:projectId/guests', authenticateToken, async (req, res) => {
  try {
    const guests = await prisma.guest.findMany({
      where: {
        projectId: req.params.projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.json([]); // Return empty array instead of error
  }
});

// Add guest to project
router.post('/:projectId/guests', authenticateToken, async (req, res) => {
  try {
    const guest = await prisma.guest.create({
      data: {
        ...req.body,
        projectId: req.params.projectId,
      },
    });
    res.json(guest);
  } catch (error) {
    console.error('Error creating guest:', error);
    res.status(500).json({ error: 'Failed to create guest' });
  }
});

export default router;
