# ================= Stage 1: Build =================
FROM node:22-slim AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm ci

# Copier le code source
COPY src ./src

# Compiler NestJS
RUN npm run build

# ================= Stage 2: Production =================
FROM node:22-slim

WORKDIR /app

# Copier package.json et installer uniquement les dépendances prod
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier le build compilé depuis le builder
COPY --from=builder /app/dist ./dist

# Créer un utilisateur non-root
RUN groupadd -r nodejs && useradd -r -g nodejs nestjs && \
    chown -R nestjs:nodejs /app
USER nestjs

# Ports et variables d'environnement
EXPOSE 8040
ENV NODE_ENV=production
ENV PORT=8040

# Lancer l'application
CMD ["node", "dist/main"]
