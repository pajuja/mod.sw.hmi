FROM node:14-slim
RUN apt-get update && apt-get install -y netcat curl
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 8081

