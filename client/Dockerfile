# module install
FROM node:16-alpine as module-install-stage
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN apk add yarn curl

RUN yarn add node-sass

RUN yarn install --production

# build
FROM node:16-alpine as build-stage
COPY --from=module-install-stage /app/node_modules/ /app/node_modules
WORKDIR /app
COPY . .
RUN yarn build

# serve
# FROM node:18-alpine

# WORKDIR /app

# COPY --from=build-stage /app/build/ /app
# COPY .env /app

# RUN npm install -g serve

# # start app
# CMD serve -s /app -l 3000

FROM nginx:1.16.0-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache bash

COPY configure-runtime.sh .

COPY .env .

COPY --from=build-stage /app/build/ /usr/share/nginx/html

RUN chmod +x configure-runtime.sh

EXPOSE 80

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/configure-runtime.sh && nginx -g \"daemon off;\""]