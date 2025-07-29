# --- Stage 1: Build the React application ---
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
# This allows Docker to cache this layer if only code changes, not dependencies
COPY package.json ./
COPY package-lock.json ./ # Use package-lock.json if you have one, or yarn.lock

# Install dependencies
# Using npm ci is better for CI/CD as it uses package-lock.json exclusively
RUN npm ci

# Copy the rest of your application code
COPY . .

# Build the React application for production
# Assuming your package.json has a "build" script (e.g., "vite build")
RUN npm run build

# --- Stage 2: Serve the static files with Nginx ---
FROM nginx:alpine

# Copy the built assets from the 'builder' stage into Nginx's public directory
# The default build output for Vite is usually 'dist'
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (standard HTTP port)
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]