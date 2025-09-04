export class ProjectService {
  async createFromTemplate(organizationId: string, templateId: string, data: any) {
    const template = await prisma.checklistTemplate.findFirst({
      where: {
        id: templateId,
        organizationId
      },
      include: {
        items: true
      }
    });
    
    if (!template) {
      throw new AppError('Template not found', 404);
    }
    
    const project = await prisma.project.create({
      data: {
        ...data,
        organizationId,
        checklists: {
          create: {
            name: template.name,
            tasks: {
              create: template.items.map((item: any) => ({
                title: item.title,
                description: item.description,
                dueDate: data.eventDate ? 
                  new Date(new Date(data.eventDate).getTime() - item.daysBefore * 24 * 60 * 60 * 1000) : 
                  null,
                priority: item.priority,
                order: item.order
              }))
            }
          }
        }
      }
    });
    
    return project;
  }
  
  async getTimeline(projectId: string) {
    const timeline = await prisma.timelineItem.findMany({
      where: { projectId },
      include: {
        vendors: {
          include: {
            vendor: true
          }
        }
      },
      orderBy: { time: 'asc' }
    });
    
    // Group by time blocks
    const grouped = timeline.reduce((acc: any, item) => {
      const hour = new Date(item.time).getHours();
      const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      
      if (!acc[period]) acc[period] = [];
      acc[period].push(item);
      
      return acc;
    }, {});
    
    return grouped;
  }
  
  async updateBudget(projectId: string, categoryId: string, amount: number) {
    const budget = await prisma.budgetItem.update({
      where: {
        id: categoryId,
        projectId
      },
      data: {
        actual: amount
      }
    });
    
    // Calculate variance and send alert if over budget
    if (budget.actual > budget.allocated) {
      await this.sendBudgetAlert(projectId, categoryId, budget);
    }
    
    return budget;
  }
  
  private async sendBudgetAlert(projectId: string, categoryId: string, budget: any) {
    // Send notification to project planner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { planner: true }
    });
    
    if (project?.planner.email) {
      // Queue email notification
      await this.queueEmail({
        to: project.planner.email,
        subject: 'Budget Alert',
        template: 'budget-alert',
        data: {
          projectName: project.name,
          category: budget.name,
          allocated: budget.allocated,
          actual: budget.actual,
          variance: budget.actual - budget.allocated
        }
      });
    }
  }
}