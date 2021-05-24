FROM node:alpine
COPY . /donatello
WORKDIR /donatello
RUN npm install 
EXPOSE 3000
CMD node appStart.js