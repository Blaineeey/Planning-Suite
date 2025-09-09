import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ============= WEBSITES =============

// Get project website
router.get('/projects/:projectId/website', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.website.findFirst({
      where: { projectId: req.params.projectId }
    });
    res.json(website || null);
  } catch (error) {
    console.error('Error fetching website:', error);
    res.json(null);
  }
});

// Create or update website
router.post('/projects/:projectId/website', authenticateToken, async (req, res) => {
  try {
    const existing = await prisma.website.findFirst({
      where: { projectId: req.params.projectId }
    });

    let website;
    if (existing) {
      website = await prisma.website.update({
        where: { id: existing.id },
        data: req.body
      });
    } else {
      website = await prisma.website.create({
        data: {
          ...req.body,
          projectId: req.params.projectId
        }
      });
    }
    res.json(website);
  } catch (error) {
    console.error('Error saving website:', error);
    res.status(500).json({ error: 'Failed to save website' });
  }
});

// Update website
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.website.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(website);
  } catch (error) {
    console.error('Error updating website:', error);
    res.status(500).json({ error: 'Failed to update website' });
  }
});

// Publish/Unpublish website
router.post('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.website.update({
      where: { id: req.params.id },
      data: { isPublished: true }
    });
    res.json(website);
  } catch (error) {
    console.error('Error publishing website:', error);
    res.status(500).json({ error: 'Failed to publish website' });
  }
});

router.post('/:id/unpublish', authenticateToken, async (req, res) => {
  try {
    const website = await prisma.website.update({
      where: { id: req.params.id },
      data: { isPublished: false }
    });
    res.json(website);
  } catch (error) {
    console.error('Error unpublishing website:', error);
    res.status(500).json({ error: 'Failed to unpublish website' });
  }
});

export default router;
