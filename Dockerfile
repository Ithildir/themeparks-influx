FROM node:12

WORKDIR /usr/src/app

USER node

COPY package*.json ./

RUN npm ci --only=production

COPY *.js ./

CMD [ "node", "index.js" ]
