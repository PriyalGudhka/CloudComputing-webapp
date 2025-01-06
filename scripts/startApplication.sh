#!/bin/bash

USER="csye6225"
GROUP="csye6225"

sudo chown -R $USER:$GROUP /etc/environment
sudo chmod 644 /etc/environment

# Used to source the environment variables
source /etc/environment

cd /opt/dist/webapp || exit

npm start
