#!/bin/bash

if [ "$PWD" == "/tmp/" ]; then
  echo "In temp directory"
else
  if cd "/tmp/"; then
    echo "Changed to tmp directory"
  else
    echo "Not in tmp directory"
    exit 1
  fi
fi

# Making another directory to store the application
sudo mkdir -p /opt/dist/webapp

# Moved webapp application to the new directory
sudo mv /tmp/webapp.zip /opt/dist/webapp/webapp.zip

ls -lrth /opt/dist/

# Used for unzipping the webapp application
if cd /opt/dist/webapp/ && sudo unzip -o "webapp.zip"; then
  echo "Webapp application is unzipped successfully!"

# Installing npm
  if sudo npm install; then
    echo "Dependemcies installed successfully"
  else
    echo "Unable to run npm install"
    exit 1
  fi
else
  echo "Web application wasn't unzipped"
  exit 1
fi

