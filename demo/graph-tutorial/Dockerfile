FROM node:12.17-buster-slim

RUN mkdir /sample-teams-bot

WORKDIR /sample-teams-bot

ADD package-lock.json package.json /sample-teams-bot/

RUN npm install --production

ADD src/ /sample-teams-bot/src

EXPOSE 3978
