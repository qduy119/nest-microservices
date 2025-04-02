# Multi-stage Dockerfile for pnpm monorepo with libraries
FROM node:18-alpine AS base

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Don't need to run build for app because npm run start already did that thing.
RUN npm run build:libs
CMD ["npm", "run", "start:all"]