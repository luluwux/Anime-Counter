FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/assets ./assets

USER node

EXPOSE 3000
ENV PORT=3000

CMD ["node", "dist/index.js"]
