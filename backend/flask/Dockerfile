FROM ubuntu:22.04

# Avoid prompts from apt.
ENV DEBIAN_FRONTEND=noninteractive

# Define environment variable
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=prod


RUN apt-get update
#RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl wget gnupg

RUN apt-get install -y python3-pip
RUN pip3 install flask flask-cors flask-pymongo requests
RUN pip3 install pymongo

# Set working directory
WORKDIR /app



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
#RUN mkdir -p /data/db && chown -R mongodb:mongodb /data/db

# at least the log dir is handy
# Create MongoDB data and log directories
RUN mkdir -p /data/db /var/log/mongodb && \
    chown -R mongodb:mongodb /data/db /var/log/mongodb


# ---

# Copy the app files to the container
COPY . .


# when we have API listener daemonized to interact with DB
EXPOSE 5100


#CMD ["sh", "-c", "python -m flask run"]
CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log; python3 server.py"]