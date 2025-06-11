# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install Python and build essentials for node-gyp
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm ci --verbose

# Copy project files
COPY . .

# Create the dist structure and build frontend
RUN echo "Building frontend..." && \
    mkdir -p dist && \
    NODE_ENV=production npx vite build && \
    echo "Frontend build output:" && \
    ls -la dist/public/ && \
    echo "Copying index.html to 404.html..." && \
    cp dist/public/index.html dist/public/404.html

# Build backend with all node_modules externalized
RUN echo "Building backend..." && \
    NODE_ENV=production npx esbuild server/production.ts \
    --bundle \
    --platform=node \
    --format=esm \
    --packages=external \
    --sourcemap \
    --keep-names \
    --outfile=dist/index.js

# Verify the build output
RUN ls -la dist/ && \
    ls -la dist/public/

# Production stage
FROM node:20-slim AS production

# Set working directory
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Verify the dist structure
RUN echo "Checking dist contents:" && \
    ls -la dist/ && \
    echo "Checking public contents:" && \
    ls -la dist/public/

# Create and configure upload directory
RUN mkdir -p uploads && \
    chmod 777 uploads

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"]
