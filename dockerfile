FROM node:20-alpine

WORKDIR /app

# Copy only dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy rest of the app
COPY . .

# Build Next.js
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]