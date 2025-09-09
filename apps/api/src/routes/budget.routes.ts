import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ============= BUDGET =============

// Get project budget
router.get('/projects/:projectId/budget', authenticateToken, async (req, res) => {
  try {
    const budget = await prisma.budget.findFirst({
      where: { projectId: req.params.projectId },
      include: { categories: true }
    });
    res.json(budget || { categories: [] });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.json({ categories: [] });
  }
});

// Create or update budget
router.post('/projects/:projectId/budget', authenticateToken, async (req, res) => {
  try {
    const { categories, totalBudget } = req.body;
    
    // Check if budget exists
    let budget = await prisma.budget.findFirst({
      where: { projectId: req.params.projectId }
    });

    if (budget) {
      // Update existing budget
      budget = await prisma.budget.update({
        where: { id: budget.id },
        data: { totalBudget }
      });

      // Delete old categories
      await prisma.budgetCategory.deleteMany({
        where: { budgetId: budget.id }
      });
    } else {
      // Create new budget
      budget = await prisma.budget.create({
        data: {
          projectId: req.params.projectId,
          totalBudget
        }
      });
    }

    // Create new categories
    if (categories && categories.length > 0) {
      await prisma.budgetCategory.createMany({
        data: categories.map(cat => ({
          budgetId: budget.id,
          name: cat.name,
          planned: cat.planned,
          actual: cat.actual,
          paid: cat.paid
        }))
      });
    }

    // Fetch updated budget with categories
    const updatedBudget = await prisma.budget.findUnique({
      where: { id: budget.id },
      include: { categories: true }
    });

    res.json(updatedBudget);
  } catch (error) {
    console.error('Error saving budget:', error);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// Update budget category
router.put('/categories/:id', authenticateToken, async (req, res) => {
  try {
    const category = await prisma.budgetCategory.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete budget category
router.delete('/categories/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.budgetCategory.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
