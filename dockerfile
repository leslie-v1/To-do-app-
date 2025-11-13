##use an official node.js runtime as a parent image
FROM node:20-alpine
#set the working directory in the container
WORKDIR /app

#copy package.json and package-lock.json to the working directory
COPY package*.json .

#install dependencies
RUN npm install

#copy the rest of the application code to the working directory
COPY . .

#expose the port the app runs on
EXPOSE 3000

#start the application
CMD ["node", "src/server.js"]