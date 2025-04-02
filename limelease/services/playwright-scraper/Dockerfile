FROM node:22-slim

WORKDIR /app

# Install dependencies for Puppeteer/Chromium
RUN apt-get update && \
    apt-get install -y \
    chromium \
    xvfb \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    ca-certificates \
    curl \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "index.mjs"]