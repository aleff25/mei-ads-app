#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --prod
#stage 2
FROM nginx:alpine
EXPOSE 4200
COPY --from=node /app/dist/mei-ads-app /usr/share/nginx/html
