#!/bin/bash

# Get the environment variables from config.js using Node.js
NODE_CONTENT=$(node -e "
import config from '../config/config.js';

// Generate the content to be written to the .env file
const envContent = \`
ENV=\${config.env}
PORT=\${config.port}
HOST=\${config.host}
MYSQLUSERNAME=\${config.user}
PASSWORD=\${config.password}
DIALECT=\${config.dialect}
DATABASE=\${config.database}
\`;

console.log(envContent);
")

# Inject the dynamically generated content into the .env file
echo "$NODE_CONTENT" | sudo tee /opt/dist/webapp/.env >/dev/null

# Ensure the .env file has the correct permissions
sudo chmod 600 /opt/dist/webapp/.env
