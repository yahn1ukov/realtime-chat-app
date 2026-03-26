FROM node:20-alpine AS build-stage

RUN apk add --no-cache libc6-compat && npm i -g pnpm turbo

WORKDIR /app

COPY . .

RUN turbo prune server --docker


FROM node:20-alpine AS install-stage

RUN apk add --no-cache libc6-compat && npm i -g pnpm turbo

WORKDIR /app

COPY --from=build-stage /app/out/json/ .
COPY --from=build-stage /app/out/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --from=build-stage /app/out/full/ .

RUN turbo run build --filter=server


FROM node:20-alpine AS production-stage

WORKDIR /app

COPY --from=install-stage /app .

EXPOSE 3000

CMD ["node", "apps/server/dist/main.js"]
