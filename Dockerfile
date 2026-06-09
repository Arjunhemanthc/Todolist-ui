# Stage 1: Build the Angular app inside Node
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the compiled app via Nginx
FROM nginx:alpine
# Copies the built production assets into the Nginx directory
COPY --from=build /app/dist/todo-api/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]