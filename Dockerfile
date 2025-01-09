FROM node:20.16-alpine3.19 AS base

# Development stage
FROM base AS development

WORKDIR /node

COPY package*.json ./

RUN npm ci && npm cache clean --force


WORKDIR /node/app

# Run the `dev` script for auto-reloading
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

WORKDIR /build

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

ENV PORT=3000

EXPOSE ${PORT}
CMD [ "node", "app.js" ]