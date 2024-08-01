# Stage 1: Base setup
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 2: Install and Build
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# Copy workspace configuration and lockfile to leverage Docker cache
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY .npmrc ./
COPY nx.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build:libs
RUN pnpm nx build "@pos/auth" --verbose

# Prune non-production dependencies
RUN pnpm --filter=@pos/auth deploy --prod /prod

# Stage 3: Production
FROM base AS production
COPY --from=build /prod /prod
WORKDIR /prod

EXPOSE 4001
CMD ["pnpm", "start"]
