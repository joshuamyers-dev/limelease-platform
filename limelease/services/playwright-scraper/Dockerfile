FROM node:22-alpine

WORKDIR /app

RUN apk add --update --no-cache \
            coreutils \
            git \
            bash \
            nodejs \
            npm \
            docker \
            openrc \
            chromium \
            xvfb \
            nss \
            freetype \
            harfbuzz \
            ca-certificates \
            ttf-freefont

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
ENV CHROMIUM_PATH="/usr/bin/chromium-browser"
ENV PUPPETEER_EXECUTABLE_PATH="${CHROMIUM_PATH}"

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "index.mjs"]