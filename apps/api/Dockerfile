FROM node:20-alpine

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install || true

# Install additional dependencies
RUN npm install express cors @prisma/client bcryptjs jsonwebtoken || true
RUN npm install -D prisma || true

# Copy Prisma schema
COPY ../../packages/database/prisma ./prisma 2>/dev/null || true

# Copy application files
COPY . .

# Generate Prisma Client (ignore errors if schema doesn't exist)
RUN npx prisma generate 2>/dev/null || true

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server-full.js"]
