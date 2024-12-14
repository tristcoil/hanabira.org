FROM ubuntu:20.04

# Avoid prompts from apt.
ENV DEBIAN_FRONTEND=noninteractive

# Install snapd
RUN apt-get update
#RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl wget gnupg

RUN apt-get install -y python3-pip
RUN pip3 install flask flask-cors flask-pymongo

# Set working directory
WORKDIR /app

# Copy the Express app files to the container
COPY . .

# mongo installation from official source, manually checked
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update
RUN apt-get install -y mongodb-org=4.4.19 mongodb-org-server=4.4.19 mongodb-org-shell=4.4.19 mongodb-org-mongos=4.4.19 mongodb-org-tools=4.4.19

RUN mkdir -p /var/lib/mongodb

# when only mongo running
#EXPOSE 27017

# when we have express API listener daemonized to interact with DB
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

#CMD ["sh", "-c", "python -m flask run"]
CMD ["sh", "-c", "mongod --dbpath /var/lib/mongodb --bind_ip_all --fork --logpath /var/log/mongodb/mongod.log; python3 -m flask run"]