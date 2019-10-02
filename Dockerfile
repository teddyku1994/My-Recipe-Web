FROM node:10.16.13
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 8000
CMD npm start