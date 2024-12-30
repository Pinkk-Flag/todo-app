# Use an official nodejs runtime as a parent image

FROM node:22-alpine

# Set working directory

WORKDIR /app

# Copy the package.json and package-lock.json

COPY package*.json .

# Install the dependencies

RUN npm install

# Copy the rest of the application across

COPY . .

# Expose the port it runs on

EXPOSE 8003

# Run the commands

CMD ["node", "./src/server.js"]


