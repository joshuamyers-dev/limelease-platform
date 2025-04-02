FROM node:18-alpine

WORKDIR /app

RUN apt-get update && apt-get install -y xvfb

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.mjs"]
