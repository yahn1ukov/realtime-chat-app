FROM node:20-alpine AS build-stage

RUN apk add --no-cache libc6-compat && npm i -g pnpm turbo

WORKDIR /app

COPY . .

RUN turbo prune app --docker


FROM node:20-alpine AS install-stage

RUN apk add --no-cache libc6-compat && npm i -g pnpm turbo

WORKDIR /app

COPY --from=build-stage /app/out/json/ .
COPY --from=build-stage /app/out/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --from=build-stage /app/out/full/ .

ARG VITE_BASE_HTTP_URL
ARG VITE_BASE_WS_URL

ENV VITE_BASE_HTTP_URL=$VITE_BASE_HTTP_URL
ENV VITE_BASE_WS_URL=$VITE_BASE_WS_URL

RUN turbo run build --filter=app


FROM node:20-alpine AS production-stage

RUN npm i -g serve

WORKDIR /app

COPY --from=install-stage /app/apps/app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
