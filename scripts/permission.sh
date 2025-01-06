#!/bin/bash

APPLICATION_NAME="WebApplication"
APPLICATION_DIRECTORY="/opt/dist/webapp"
USER="csye6225"
GROUP="csye6225"

# This will create a system group
sudo groupadd ${GROUP}

sudo chmod +x /opt/dist/webapp/scripts/startApplication.sh

# This will create a system user

sudo useradd --system --shell /usr/sbin/nologin --no-create-home -g $GROUP $USER


sudo mkdir -p /var/log/$APPLICATION_NAME.service

sudo touch /var/log/$APPLICATION_NAME.service/out.log /var/log/$APPLICATION_NAME.service/error.log /var/log/myapp.log

cat <<EOF | sudo tee /etc/systemd/system/$APPLICATION_NAME.service
[Unit]
Description=$APPLICATION_NAME
ConditionPathExists=/opt/dist/webapp
After=network.target
[Service]
Type=simple
EnvironmentFile=-/etc/environment
WorkingDirectory=/opt/dist/webapp
ExecStart=$APPLICATION_DIRECTORY/scripts/startApplication.sh start
ExecStop=$APPLICATION_DIRECTORY/scripts/startApplication.sh stop
Restart=always
User=$USER
Group=$GROUP
Environment=NODE_ENV=production
StandardOutput=file:/var/log/$APPLICATION_NAME.service/out.log
StandardError=file:/var/log/$APPLICATION_NAME.service/error.log
SyslogIdentifier=csye6225
[Install]
WantedBy=multi-user.target
WantedBy=cloud-init.target
EOF

# Used for setting the permissions on service file
sudo chmod 664 "/etc/systemd/system/$APPLICATION_NAME.service"
sudo chown $USER:$GROUP /var/log/myapp.log
sudo chmod 755 /var/log/myapp.log
sudo chown $USER:$GROUP /var/log/$APPLICATION_NAME.service/
sudo chmod 755 /var/log/$APPLICATION_NAME.service/

sudo chown -R $USER:$GROUP /opt/dist/webapp
sudo chmod -R 755 /opt/dist/webapp

# Starts the WebApplication service
sudo systemctl daemon-reload
sudo systemctl enable WebApplication
