FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]

# # Example
# # Stage 1: Build the app
# FROM node:14-alpine as builder

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package*.json ./

# RUN npm install

# # Bundle app source
# COPY . .

# # Build the app
# RUN npm run build

# # Stage 2: Create the production image
# FROM node:14-alpine

# # Create app directory
# WORKDIR /usr/src/app

# # Copy built app from previous stage
# COPY --from=builder /usr/src/app/dist ./dist

# # Install only production dependencies
# COPY package*.json ./

# RUN npm install --only=production

# # Expose the app's port
# EXPOSE 3000

# # Start the app
# CMD ["npm", "run", "start:prod"]