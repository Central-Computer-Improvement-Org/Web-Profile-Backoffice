FROM node:20-alpine

ENV NODE_ENV=development
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
