Network Structures and Cloud Computing

Name: Priyal Vimal Gudhka
NU ID No.: 002747680
Email Id: gudhka.p@northeastern.edu
Assignment Number: 09

Packer Commands

1. packer init packer/gcp.pkr.hcl
2. packer validate packer/gcp.pkr.hcl
3. packer fmt -check packer/gcp.pkr.hcl
   
Service Account roles granted

1. Compute Engine Instance Admin (v1)
2. Service Account User

About the Assignment : -

As a part of this assignment, I have created various methods for handling below scenarios: -

1. Check Database connectivity
2. Ensure only GET method is supported
3. Request and Response doesn't contain any payload 

Following is the folder strcuture of the project :

1. controller folder contains the healthzController.js file having methods such as validateRequestBody, healthzCheck, validateIncorrectEndpoint which ensures correct status code is returned

2. routes folder contains healthzRoutes.js filewhich invokes the various methods defined in controller for performing different operations

3. config folder contains config.js to fetch the variables defined in .env file (.env file contains database credentials and other environment variables)

4. server.js is used for setting the port number to be used

5. node_modules, package.json & package-lock.json is generated using following commands

Steps for generating the various folders: -

1. Open terminal

2. Type "npm init" to generate package.json

3. Then enter "npm i express cors debug mongoose --save" to generate the package-lock.json and node_modules folder

4. To run enter "npm start"

References: -

1. https://sequelize.org/docs/v7/getting-started/#:~:text=You%20can%20use%20the%20.,which%20SQL%20features%20are%20available.

2. https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

3. https://www.chaijs.com/plugins/chai-http/

4. https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai

5. https://github.com/marketplace/actions/setup-hashicorp-packer

6. https://www.baeldung.com/linux/create-non-login-user
 
7. https://linuxhandbook.com/create-systemd-services/

8. https://cloud.google.com/pubsub/docs/publisher#node.js

