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

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "index.mjs"]