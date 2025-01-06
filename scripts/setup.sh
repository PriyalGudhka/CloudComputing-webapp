#!/bin/bash


# Installing mariadb server
sudo yum install -y mariadb-server

# Enabling service
sudo systemctl start mariadb
sudo systemctl enable mariadb

sudo mysql_secure_installation <<EOF

y
root
root
y
y
y
y
EOF

MYSQLUSERNAME=root
DATABASE_PASSWORD=root

sudo mysql -u $MYSQLUSERNAME -p"$DATABASE_PASSWORD"

sudo mysql -u $MYSQLUSERNAME -p"$DATABASE_PASSWORD" -e "SHOW DATABASES;"

 sudo yum clean all