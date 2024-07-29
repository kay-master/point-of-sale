# Stage 1: Base setup
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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
# COPY . .
# WORKDIR /app/services/auth-service
# RUN pnpm run build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm --filter=@pos/auth --prod deploy /prod

# Stage 4: Prune non-production dependencies
FROM base AS pruned
COPY --from=build /prod /prod
# WORKDIR /app/services/auth-service
# RUN pnpm --filter=@pos/auth --prod deploy pruned
WORKDIR /prod

EXPOSE 3000
CMD ["pnpm", "start"]

# Stage 5: Production image
# FROM node:20-alpine AS production
# WORKDIR /app
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN npm install -g pnpm

# COPY --from=build /app/services/auth-service/dist /app
# COPY --from=build /app/services/auth-service/package.json /app/package.json
# COPY --from=build /app/pnpm-workspace.yaml /pnpm-workspace.yaml
# COPY --from=build /pnpm /pnpm
# RUN pnpm install --prod

# ENV NODE_ENV=production
# COPY --from=pruned /app/pruned /app

# EXPOSE 3000
# CMD ["node", "dist/index.js"]
