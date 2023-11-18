# LTS version
FROM node:18

WORKDIR /usr/src/question

COPY package*.json ./

RUN npm install

# Uncomment following for production
# RUN npm ci --omit=dev

COPY . .

EXPOSE 8002

CMD ["node", "index.js"]
