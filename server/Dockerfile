# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.9.0

# Set a non-root user
FROM node:latest

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/node_modules/.cache && chown -R node:node /usr/src/app/node_modules/.cache


# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
    RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 4000

# Run the application.
CMD node index.js
