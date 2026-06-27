        FROM node:20
        WORKDIR /app
        COPY package*.json ./
        RUN npm install --only=production
        COPY . /app
        CMD ["node", "index.js"]
