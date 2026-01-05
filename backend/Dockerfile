FROM node:22-alpine

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

WORKDIR /src

COPY package.json package-lock.json ./ 

RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh" , "-c" , "npm run db:deploy && npm run start"]