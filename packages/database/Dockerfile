FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Expose Prisma Studio port
EXPOSE 5555

# Run Prisma Studio
CMD ["npx", "prisma", "studio", "--port", "5555", "--browser", "none"]
