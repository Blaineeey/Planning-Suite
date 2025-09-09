import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { id: 'demo-org' },
    update: {},
    create: {
      id: 'demo-org',
      name: 'Demo Wedding Planning',
      plan: 'PRO'
    }
  });

  console.log('✅ Created demo organization');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'OWNER',
      organizationId: demoOrg.id
    }
  });

  console.log('✅ Created demo user (demo@example.com / demo123)');

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Smith-Johnson Wedding',
      type: 'WEDDING',
      status: 'ACTIVE',
      eventDate: new Date('2025-09-15'),
      budget: 50000,
      guestCount: 150,
      organizationId: demoOrg.id,
      createdById: demoUser.id
    }
  });

  console.log('✅ Created sample project');

  // Create sample lead
  await prisma.lead.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah@example.com',
      phone: '555-0101',
      status: 'NEW',
      eventDate: new Date('2025-12-20'),
      budget: 75000,
      guestCount: 200,
      organizationId: demoOrg.id,
      createdById: demoUser.id
    }
  });

  console.log('✅ Created sample lead');

  // Create sample guests
  const guestData = [
    { firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '555-0201', side: 'BRIDE', rsvpStatus: 'YES' },
    { firstName: 'Emily', lastName: 'Johnson', email: 'emily@example.com', phone: '555-0202', side: 'GROOM', rsvpStatus: 'PENDING' },
    { firstName: 'Michael', lastName: 'Brown', email: 'michael@example.com', phone: '555-0203', side: 'BRIDE', rsvpStatus: 'YES' },
    { firstName: 'Jessica', lastName: 'Davis', email: 'jessica@example.com', phone: '555-0204', side: 'GROOM', rsvpStatus: 'NO' },
    { firstName: 'David', lastName: 'Wilson', email: 'david@example.com', phone: '555-0205', side: 'BOTH', rsvpStatus: 'YES' }
  ];

  for (const guest of guestData) {
    await prisma.guest.create({
      data: {
        ...guest,
        projectId: project.id
      }
    });
  }

  console.log('✅ Created sample guests');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
