FROM node:12
USER node

WORKDIR /home/node

COPY package*.json ./

RUN npm ci --only=production

COPY *.js ./

CMD [ "node", "index.js" ]
