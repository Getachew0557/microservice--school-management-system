# Development Dockerfile for Teacher Service
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3002

CMD ["npm", "run", "dev"]


FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

COPY --from=development /app/node_modules ./node_modules

EXPOSE 3002

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]