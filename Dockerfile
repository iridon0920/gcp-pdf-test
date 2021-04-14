FROM node:12

RUN apt-get update -y

RUN apt-get install -y openjdk-8-jre

RUN npm install -g  --no-optional firebase-tools
