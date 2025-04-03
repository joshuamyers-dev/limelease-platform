FROM node:22-slim

WORKDIR /app

# Install dependencies for Chromium and Xvfb
RUN apt-get update && apt-get install -y \
    chromium \
    xvfb \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    ca-certificates \
    curl \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV CHROMIUM_PATH="/usr/bin/chromium"
ENV PUPPETEER_EXECUTABLE_PATH="${CHROMIUM_PATH}"

# Create a wrapper script to start Xvfb before the application
RUN echo '#!/bin/bash\nXvfb :99 -screen 0 1280x1024x24 -ac &\nexport DISPLAY=:99\nexec "$@"' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 3000

# Start the application with Xvfb
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "index.mjs"]