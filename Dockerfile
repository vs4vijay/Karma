FROM node:10.23.2-alpine

WORKDIR /app

COPY package*.json ./

# USER node

RUN npm install

COPY . ./
# COPY --chown=node:node . ./

ENV APP_PORT 9999

EXPOSE ${APP_PORT}

CMD ["node", "src/app.js"]
