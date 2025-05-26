# Use Node.js runtime
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the application code
COPY . ./

# Set the API URL build argument (can be overridden at build time)
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Expose port 3000
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
