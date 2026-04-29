FROM node:20-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

WORKDIR /app
COPY server/ ./server/
COPY --from=build-client /app/client/dist ./client/dist

WORKDIR /app/server
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
