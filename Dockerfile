FROM node:carbon

EXPOSE 3000 80
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV DB_NAME=${DB_NAME}
ENV DB_USER=${DB_USER}
ENV DB_PASS=${DB_PASS}
ENV DB_HOST=${DB_HOST}
ENV JWT_SECRET=${JWT_SECRET}
COPY package.json /app/package.json
RUN npm install
COPY . /app
CMD ["npm", "start"]
