# STAGE: 1
FROM node:14-alpine as build

COPY package.json /app-stage-1/

WORKDIR /app-stage-1

RUN npm install --legacy-peer-deps

COPY . /app-stage-1

# We need this to download node-prune. size ~1.5 MB
RUN apk --no-cache add curl

# run node prune to prune dependencies. It Helped me to save ~38 MB. 
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

RUN /usr/local/bin/node-prune

# STAGE: 2
FROM node:14-alpine

WORKDIR /app

COPY --from=build /app-stage-1/ /app/

# ENV NODE_ENV production

CMD ["npm", "start"]