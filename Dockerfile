# Stage 1: Build the Angular app inside Node 22 (Updated from node:18)
FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the compiled app via Nginx
FROM nginx:alpine
# Copies the built production assets into the Nginx directory
# Note: Check if your distribution bundle names match 'todo-ui' based on your package log logs!
COPY --from=build /app/dist/todo-ui/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]