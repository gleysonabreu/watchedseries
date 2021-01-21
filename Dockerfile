FROM node:14.15-alpine

WORKDIR /home/watchedseries

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]
