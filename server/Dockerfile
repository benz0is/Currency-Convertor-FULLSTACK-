FROM node:12-alpine as builder
WORKDIR /server
COPY package.json .
RUN npm install
COPY . /server
EXPOSE 3001
USER node
CMD ["npm", "start"]