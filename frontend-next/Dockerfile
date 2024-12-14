# https://www.locofy.ai/blog/create-a-docker-image-of-your-nextjs-app

FROM node:18-alpine
#ENV  REACT_APP_HOST_IP=$(hostname -I | awk '{print $1}')
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install sharp
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
#CMD ["/bin/sh", "-c", "sleep 120 && npm start"]
