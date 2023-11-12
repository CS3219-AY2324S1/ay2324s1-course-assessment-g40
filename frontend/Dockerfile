# LTS version
FROM node:18 as build

WORKDIR /usr/src/frontend

COPY package*.json ./

RUN npm install

# Uncomment following for production
# RUN npm ci --omit=dev

COPY . .

# Add --prod flag for production
RUN npm run build --configuration=development

FROM nginx:alpine

COPY --from=build /usr/src/frontend/dist/* /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
