FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the TypeScript code
RUN npm run pre-start

# Expose the port your app runs on
EXPOSE 9000

# Command to run your application
CMD ["npm", "start"]
