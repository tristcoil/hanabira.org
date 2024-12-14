# install instructions based on official mongo 7 docs
# https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# Use the official Ubuntu 22.04 LTS as a base image
FROM ubuntu:22.04

# Set the environment variable to prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install required packages
RUN apt-get update && \
    apt-get install -y gnupg curl wget

# --- Mongo DB part --- #

# Import the MongoDB public GPG key
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Create the MongoDB source list
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-7.0.list

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

# Copy the Express app files to the container
COPY . .

# when we have express API listener daemonized to interact with DB
EXPOSE 5200

# start mongo, seed static data, start express server wrapper daemon
CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log && node seed_jmdict_data.js && sleep 3 && node server_text_parser.js"]














# ------------------------------------- OLD ------------------------------------- #


# FROM ubuntu:20.04
#
# # Avoid prompts from apt.
# ENV DEBIAN_FRONTEND=noninteractive
#
# # Install snapd
# RUN apt-get update
# #RUN apt-get update && apt-get upgrade -y
# RUN apt-get install -y curl wget gnupg
#
# RUN apt-get install -y python3-pip
# RUN pip3 install flask flask-cors flask-pymongo requests
#
# # Set working directory
# WORKDIR /app

# # Copy the Express app files to the container
# COPY . .

# # mongo installation from official source, manually checked
# RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
# RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
# RUN apt-get update
# RUN apt-get install -y mongodb-org=4.4.19 mongodb-org-server=4.4.19 mongodb-org-shell=4.4.19 mongodb-org-mongos=4.4.19 mongodb-org-tools=4.4.19

# RUN mkdir -p /var/lib/mongodb

# # when only mongo running
# #EXPOSE 27017

# # when we have express API listener daemonized to interact with DB
# EXPOSE 5100

# # Define environment variable
# ENV FLASK_APP=app.py
# ENV FLASK_RUN_HOST=0.0.0.0
# ENV FLASK_ENV=prod

# #CMD ["sh", "-c", "python -m flask run"]
# CMD ["sh", "-c", "mongod --dbpath /var/lib/mongodb --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log; python3 server_kanji.py"]