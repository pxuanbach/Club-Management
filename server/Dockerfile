# STAGE: 1
FROM node:16-alpine as build

COPY package.json /app-stage-1/

WORKDIR /app-stage-1

ENV NODE_ENV=production

RUN apk --no-cache add yarn curl

RUN yarn add bcrypt

RUN yarn install

COPY . /app-stage-1

# run node prune to prune dependencies. It Helped me to save ~38 MB. 
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

RUN /usr/local/bin/node-prune

# STAGE: 2
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app-stage-1/ /app/

# ENV NODE_ENV production

CMD ["npm", "start"]