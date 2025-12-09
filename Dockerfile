# Multi-stage Dockerfile: build client, install server deps, produce production image

# Builder stage
FROM node:18 AS builder
WORKDIR /app

# Copy root package.json and install root deps (server)
COPY package.json package-lock.json* ./
RUN npm install --production=false --silent

# Copy client and build
COPY client/package.json client/package-lock.json* ./client/
WORKDIR /app/client
RUN npm install --production=false --silent
COPY client/ ./
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy server source + node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY server/ ./server

# Copy built client
COPY --from=builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/index.js"]
