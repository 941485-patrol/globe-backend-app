# syntax=docker.io/docker/dockerfile:1

FROM node:22-bullseye

# Install libc6-compat (needed by some Node packages)
#RUN apk add --no-cache libc6-compat
#RUN apk add --no-cache python3 make g++
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only package.json and install dependencies
COPY package.json ./
RUN npm install --include=dev

# Copy rest of the project files
COPY . .

# Compile TypeScript files
RUN npm run compile

# Expose port
EXPOSE 3000
# EXPOSE 3032
EXPOSE 9229

# Set environment variables
ENV HOSTNAME=0.0.0.0

# Run in development mode
#CMD ["npm", "run", "dev"]
#CMD ["node", "--inspect=0.0.0.0:9229", "node_modules/next/dist/bin/next", "dev"]
# CMD ["node", "--inspect=0.0.0.0:9229", "dist/app.js"]
# CMD ["/bin/sh", "-c", "npm install --include=dev && npm run compile && npm run dev"]
CMD ["/bin/sh", "-c", "npm install --include=dev && npm run compile && npm run dev"]