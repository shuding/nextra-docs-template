# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory within the container
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml files to the container
COPY . /app

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install

# Expose the port your application will run on (if applicable)
EXPOSE 3000

# Define the command to start your application
CMD ["pnpm", "dev"]

