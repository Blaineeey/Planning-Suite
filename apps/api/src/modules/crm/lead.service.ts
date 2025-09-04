import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const CreateLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional(),
  eventDate: z.string().datetime().optional(),
  eventType: z.string().optional(),
  budget: z.number().optional(),
  guestCount: z.number().optional(),
  venue: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export class LeadService {
  async create(organizationId: string, data: z.infer<typeof CreateLeadSchema>) {
    const validated = CreateLeadSchema.parse(data);
    
    // Check for duplicate
    const existing = await prisma.lead.findFirst({
      where: {
        organizationId,
        email: validated.email
      }
    });
    
    if (existing) {
      throw new AppError('Lead with this email already exists', 409);
    }
    
    return prisma.lead.create({
      data: {
        ...validated,
        organizationId,
        eventDate: validated.eventDate ? new Date(validated.eventDate) : null
      }
    });
  }
  
  async list(organizationId: string, filters: any = {}) {
    const { stage, status, assignedTo, search, page = 1, limit = 20 } = filters;
    
    const where: any = { organizationId };
    
    if (stage) where.stage = stage;
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const [total, leads] = await prisma.$transaction([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        include: {
          assignedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);
    
    return {
      data: leads,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async updateStage(id: string, stage: string, userId: string) {
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        stage,
        updatedAt: new Date()
      }
    });
    
    // Log activity
    await prisma.activity.create({
      data: {
        type: 'STAGE_CHANGE',
        description: `Lead stage changed to ${stage}`,
        leadId: id,
        userId
      }
    });
    
    return lead;
  }
  
  async convertToProject(leadId: string, userId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });
    
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    
    if (lead.stage === 'CONVERTED') {
      throw new AppError('Lead already converted', 400);
    }
    
    // Create project from lead
    const project = await prisma.project.create({
      data: {
        name: `${lead.firstName} ${lead.lastName} Wedding`,
        organizationId: lead.organizationId,
        plannerId: userId,
        status: 'CONTRACTED',
        eventDate: lead.eventDate,
        budget: {
          create: {
            total: lead.budget || 0,
            categories: {
              create: [
                { name: 'Venue', allocated: 0 },
                { name: 'Catering', allocated: 0 },
                { name: 'Photography', allocated: 0 },
                { name: 'Flowers', allocated: 0 },
                { name: 'Music', allocated: 0 }
              ]
            }
          }
        },
        client: {
          create: {
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email,
            phone: lead.phone
          }
        }
      }
    });
    
    // Update lead
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        stage: 'CONVERTED',
        convertedAt: new Date(),
        convertedToId: project.id
      }
    });
    
    return project;
  }
}