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

# Set working directory
WORKDIR /app

# ---

# Copy the app files to the container
COPY . .

# --- flask part ---

# Define environment variable
#ENV FLASK_APP=server.py
ENV FLASK_RUN_HOST=0.0.0.0
    
ENV APP_ENV=prod
    
RUN apt-get update
#RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl wget gnupg
RUN apt-get install -y python3-pip python3-venv


# Create a virtual environment
RUN python3 -m venv venv

# Activate the virtual environment and install Python dependencies
# It's necessary to use the full path to the pip inside the venv
RUN ./venv/bin/pip install --upgrade pip && \
    ./venv/bin/pip install flask flask-cors flask-pymongo requests pymongo gunicorn

# when we have API listener daemonized to interact with DB
EXPOSE 5100

#CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log; python3 server.py"]
# Start MongoDB and Gunicorn using the virtual environment
CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log && ./venv/bin/gunicorn -w 4 -b 0.0.0.0:5100 server:app"]