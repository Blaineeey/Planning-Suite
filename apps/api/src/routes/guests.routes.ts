import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Update guest
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await prisma.guest.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json(guest);
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// Delete guest
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.guest.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

// Get guest by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: req.params.id }
    });
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
});

// Update guest
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const guest = await prisma.guest.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(guest);
  } catch (error) {
    console.error('Error updating guest:', error);
    res.status(500).json({ error: 'Failed to update guest' });
  }
});

// Delete guest
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.guest.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
});

export default router;
