FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir -p /app
WORKDIR /app

COPY . .

FROM base AS build
RUN  npm i -g corepack@latest
RUN  pnpm install
RUN  pnpm run build

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT [ "node", ".output/server/index.mjs" ] 