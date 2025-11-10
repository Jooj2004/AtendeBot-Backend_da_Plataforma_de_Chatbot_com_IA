FROM node:22-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN chmod +x entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["sh", "./entrypoint.sh"]