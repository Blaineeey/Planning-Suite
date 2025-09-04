# Ruban Bleu Planning Suite - Dockerized

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- 8GB+ RAM recommended
- Windows 10/11 Pro or Enterprise (for Docker)

### Run Everything with One Command
```bash
docker-run.bat
```

This will:
1. Build all Docker containers
2. Start PostgreSQL database
3. Start Redis cache
4. Start API server
5. Start Web application
6. Open browser to http://localhost:3000

## 🏗️ Architecture

All services run in Docker containers:

| Service | Port | Description |
|---------|------|-------------|
| Web App | 3000 | Next.js frontend |
| API | 3001 | Express.js backend |
| PostgreSQL | 5432 | Main database |
| Redis | 6379 | Cache & sessions |
| Prisma Studio | 5555 | Database GUI |

## 📦 Docker Services

### 1. Database (PostgreSQL)
- Automatic setup with migrations
- Persistent data volume
- Health checks

### 2. API Server
- Express.js with Prisma ORM
- JWT authentication
- RESTful endpoints

### 3. Web Application
- Next.js with React
- Tailwind CSS
- Real-time API connection

### 4. Redis Cache
- Session management
- API caching
- Job queues (future)

## 🔧 Commands

### Start Everything
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Restart Services
```bash
docker-compose restart
```

### Database Migrations
```bash
docker-compose exec api npx prisma migrate dev
```

### Open Database GUI
```bash
docker-compose exec api npx prisma studio
```

## 📁 Project Structure

```
ruban-bleu/
├── apps/
│   ├── api/              # Backend API
│   │   ├── Dockerfile
│   │   ├── server.js     # Simple server
│   │   └── server-full.js # Full server with DB
│   └── web/              # Frontend app
│       ├── Dockerfile
│       └── src/
├── packages/
│   └── database/         # Prisma schema
│       ├── Dockerfile
│       └── prisma/
│           └── schema.prisma
├── docker-compose.yml    # Docker orchestration
├── docker-run.bat       # One-click start
└── cleanup.bat          # Remove old files
```

## 🌐 Endpoints

### Web Application
- http://localhost:3000 - Main app
- http://localhost:3000/dashboard - Dashboard

### API Server
- http://localhost:3001 - API root
- http://localhost:3001/health - Health check
- http://localhost:3001/api/auth/register - Registration
- http://localhost:3001/api/auth/login - Login
- http://localhost:3001/api/projects - Projects
- http://localhost:3001/api/leads - Leads

### Database GUI
- http://localhost:5555 - Prisma Studio

## 🔐 Default Credentials

### Database
- Host: localhost
- Port: 5432
- Database: ruban_bleu
- Username: postgres
- Password: postgres

## 🛠️ Troubleshooting

### Docker not running
1. Start Docker Desktop
2. Wait for it to fully load
3. Run `docker-run.bat` again

### Port already in use
```bash
docker-compose down
docker system prune -f
docker-compose up -d --force-recreate
```

### Database connection issues
```bash
docker-compose restart postgres
docker-compose exec api npx prisma migrate reset
```

### Clear everything and start fresh
```bash
docker-compose down -v
docker system prune -af
docker-run.bat
```

## 🧹 Cleanup

To remove old/unused files:
```bash
cleanup.bat
```

## 📝 Environment Variables

Configured in `docker-compose.yml`:
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- API URLs

## 🚦 Status Check

Check if everything is running:
```bash
docker-compose ps
```

Should show:
- ruban_bleu_db (postgres)
- ruban_bleu_redis
- ruban_bleu_api
- ruban_bleu_web
- ruban_bleu_prisma_studio

## 🎯 Next Steps

1. Access the web app: http://localhost:3000
2. Register a new account
3. Create your first project
4. Explore the dashboard

## 💡 Development Tips

- API changes reflect immediately (hot reload)
- Web app has fast refresh enabled
- Database changes require migration
- All data persists in Docker volumes

## 🐛 Debug Mode

View real-time logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
```

## 🔄 Reset Everything

```bash
docker-compose down -v
docker system prune -af
del /s /q node_modules
docker-run.bat
```
