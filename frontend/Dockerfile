# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the rest of the code
COPY . /app/

# Build the React app
RUN npm run build

# Serve the build folder
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose the port React runs on
EXPOSE 3000
