# Ruban Bleu Planning Suite - Setup Instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm/pnpm
- Docker and Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Step 1: Install Dependencies

```bash
# Install pnpm globally if not installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
# At minimum, update:
# - DATABASE_URL
# - JWT_SECRET
# - JWT_REFRESH_SECRET
```

### Step 3: Start Database Services

```bash
# Start PostgreSQL and Redis using Docker
docker-compose up -d postgres redis

# Or if you have them installed locally, ensure they're running
```

### Step 4: Set Up Database

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# (Optional) Seed database with sample data
pnpm prisma db seed
```

### Step 5: Start Development Servers

```bash
# From root directory, start all services
pnpm dev

# Or start individually:
# API only
cd apps/api && pnpm dev

# Web only  
cd apps/web && pnpm dev
```

## 📍 Access Points

- **Web Application**: http://localhost:3000
- **API Server**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Database GUI**: `pnpm --filter database studio`

## 🏗️ Project Structure

```
ruban-bleu/
├── apps/
│   ├── api/          # Express.js API server
│   └── web/          # Next.js web application
├── packages/
│   ├── database/     # Prisma ORM and database schema
│   ├── shared/       # Shared utilities
│   └── ui/           # Shared UI components
├── docker-compose.yml
└── .env
```

## 🔧 Common Commands

```bash
# Database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database

# Development
pnpm dev              # Start all services
pnpm build            # Build all services
pnpm lint             # Run linting
pnpm test             # Run tests

# Docker
docker-compose up -d  # Start services
docker-compose down   # Stop services
docker-compose logs   # View logs
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill
```

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Try: `docker-compose restart postgres`

### Prisma Issues
```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
pnpm prisma generate
```

## 📝 API Testing

### Register a New User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "John",
    "lastName": "Doe",
    "role": "OWNER",
    "organizationName": "My Wedding Planning Co"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

## 🚢 Next Steps

1. **Complete Database Schema**: 
   - Copy the complete schema from `packages/database/prisma/complete-schema.prisma`
   - Run migrations: `pnpm prisma migrate dev`

2. **Implement Core Modules**:
   - CRM (leads, pipeline)
   - Projects (tasks, timeline, budget)
   - Invoicing (proposals, contracts, payments)
   - Wedding Websites (generator, RSVP)
   - Vendor Directory

3. **Set Up Integrations**:
   - Stripe payment processing
   - SendGrid email service
   - AWS S3 file storage
   - Twilio SMS notifications

4. **Build Frontend**:
   - Dashboard components
   - Project management views
   - Client portal
   - Wedding website builder

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Support

For issues or questions, create an issue in the repository or contact the development team.
