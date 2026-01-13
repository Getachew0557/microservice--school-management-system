# Development Dockerfile for Student Service
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]


# Production Dockerfile (optional for later)
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

COPY --from=development /app/node_modules ./node_modules

EXPOSE 3001

CMD ["npm", "run","dev"]