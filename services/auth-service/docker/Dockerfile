# Stage 1: Base setup
FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Stage 2: Install dependencies
FROM base AS dependencies
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY services/auth-service/package.json services/auth-service/
COPY libs/ ./libs/
COPY configs/ ./configs/
RUN pnpm install --frozen-lockfile

# Stage 3: Build
FROM dependencies AS build
COPY . .
WORKDIR /app/services/auth-service
RUN pnpm run build

# Stage 4: Prune non-production dependencies
FROM base AS pruned
COPY --from=build /app /app
WORKDIR /app/services/auth-service
RUN pnpm --filter=auth-service --prod deploy pruned

# Stage 5: Production image
FROM node:20-alpine AS production
WORKDIR /app
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN npm install -g pnpm

# COPY --from=build /app/services/auth-service/dist /app
# COPY --from=build /app/services/auth-service/package.json /app/package.json
# COPY --from=build /app/pnpm-workspace.yaml /pnpm-workspace.yaml
# COPY --from=build /pnpm /pnpm
# RUN pnpm install --prod

ENV NODE_ENV=production
COPY --from=pruned /app/services/auth-service/pruned /app

EXPOSE 3000
CMD ["node", "dist/index.js"]
