FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci
COPY . .

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
CMD ["npm", "start"]
