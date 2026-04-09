# Build the React app
FROM node:22.3-alpine AS builder

WORKDIR /usr/src/stans-app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Build app for production
FROM nginx:latest AS prod

WORKDIR /usr/share/nginx/static

COPY --from=builder /usr/src/stans-app/dist /usr/share/nginx/static

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]