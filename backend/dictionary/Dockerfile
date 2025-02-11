# Use the official Ubuntu 24.04 LTS as a base image
FROM ubuntu:24.04

# Set the environment variable to prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install required packages
RUN apt-get update && \
    apt-get install -y gnupg curl wget

# --- Mongo DB (v8) part --- #

# Import the MongoDB public GPG key
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
    --dearmor



# Create the MongoDB source list
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# Reload the local package database
RUN apt-get update

# Install the MongoDB packages
RUN apt-get install -y mongodb-org

# vanilla Mongo 7 by default expects this dir to be present
# Create the default MongoDB data directory and ensure it's writable
RUN mkdir -p /data/db && chown -R mongodb:mongodb /data/db

# at least the log dir is handy
# Create MongoDB data and log directories
RUN mkdir -p /var/log/mongodb && \
    chown -R mongodb:mongodb /var/log/mongodb


# --- nodejs part --- #

# official source of node 18, i found it manually
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
    
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
    
# Install app dependencies
RUN npm install
RUN npm uninstall kuroshiro
RUN npm install kuroshiro@1.1.2

# mecab has to be installed system wide
RUN apt-get install -y mecab libmecab-dev mecab-jumandic mecab-jumandic-utf8
# there is more advanced dict than jumandic for mecab, it recognizes phrases, just forgot the name, lol

# Copy the Express app files to the container
COPY . .

# when we have express API listener daemonized to interact with DB
EXPOSE 5200

# start mongo, seed static data, start express server wrapper daemon
CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log && node seed_jmdict_data.js && sleep 2 && node main_server.js"]
