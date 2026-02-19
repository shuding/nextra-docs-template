# Dependencies stage (prod deps only)
FROM node:22-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable

# Copy package files (pnpm)
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Builder stage
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all deps (incl dev) for build
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only necessary runtime files
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# If your runtime needs node_modules (standalone usually doesn't),
# you can also copy prod deps from dependencies stage:
# COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application (Next.js standalone output)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Startup script
RUN echo '#!/bin/sh' > /usr/bin/run.sh && \
    echo 'node server.js' >> /usr/bin/run.sh && \
    chmod +x /usr/bin/run.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT [ "run.sh" ]