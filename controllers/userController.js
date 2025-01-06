import config from '../config/config.js';
import { Sequelize } from 'sequelize';
import db from '../models/index.js';
import bcrypt from 'bcrypt';
import { validateRequestBody } from './healthzController.js';
import validator from 'validator'; 
import winston from 'winston';
import {logger} from '../middleware/logger.js';
import { PubSub } from '@google-cloud/pubsub';
const projectId = 'plexiform-muse-414223';
const pubSubClient = new PubSub({projectId});


const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect
});

export const createNewUser = async (req, res) => {
    try {
        if (checkDataBaseConnection(res)) {
            await sequelize.sync();

            const userNameExists = await db.Users.findOne({ where: { username: req.body.username } });

            if (userNameExists || checkExtraParams(req) || validateBody(req)){
                logger.error("User already exists")
                return res.status(400).end();
            }
            const { first_name, last_name, password, username } = req.body
            const newUser = await db.Users.create({
                first_name,
                last_name,
                password,
                username,
                account_created: new Date(),
                account_updated: new Date(),
                isUserVerified: false
            });

            const userResponse = {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                username: newUser.username,
                account_created: newUser.account_created,
                account_updated: newUser.account_updated,
            };

            const newUserVerification = await db.UserVerifications.create({
                username: username,
                user_status: "",
            });

            const userResponseForVerification = {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                username: newUser.username,
            };

            logger.info("User created successfully!")

            const data = JSON.stringify(userResponseForVerification);
            const dataBuffer = Buffer.from(data);
            try {
                const messageId = await pubSubClient
                  .topic("verify_email")
                  .publishMessage({data: dataBuffer});
                console.log(`Message ${messageId} published.`);
              } catch (error) {
                console.error(`Received error while publishing: ${error.message}`);
                process.exitCode = 1;
              }

            res.status(201).json(userResponse);
        }
    } catch (error) {
        console.log("In error: " + error.message)
        logger.error("User creation unsuccessful")
        logger.error("User creation unsuccessful due to: " + error.message)
        res.status(400).end();
    }
};

export const retrieveUserInformation = async (req, res) => {

    if (checkDataBaseConnection(res)) {

        //Validates if there are no query params and request body otherwise returns 400
        if (!validateRequestBody(req))
            return res.status(400).end();

        // if (checkDataBaseConnection(res)) {
        const { id, first_name, last_name, username, account_created, account_updated, isUserVerified } = req.userDetails


        console.log("username: " + username )
        console.log("isUserVerified: " + isUserVerified )

        if(!isUserVerified){
            logger.error("User is not verified, please verify user before proceeding")
            console.log("User is not verified, please verify user before proceeding")
            return res.status(403).end();
        }

        const userResponse = {
            id,
            first_name,
            last_name,
            username,
            account_created,
            account_updated
        };
        logger.info("User information retrieved successfully!")
        return res.status(200).json(userResponse);
    }
}

export const updateUserInformation = async (req, res) => {

    if (checkDataBaseConnection(res)) {

    const userId = await db.Users.findOne({ where: { id: req.userDetails.id } });
    console.log("User Id: " + req.userDetails.username)
    console.log("User body: " + req.body.username)

    if(!req.userDetails.isUserVerified){
        logger.error("User is not verified, please verify user before proceeding")
        console.log("User is not verified, please verify user before proceeding")
        return res.status(403).end();
    }

    if (req.body.username || req.body.account_created || req.body.account_updated)
        return res.status(400).end();

    console.log("User Id: " + userId.id)
    console.log("User body: " + req.body.last_name)

    const updateUser = await db.Users.update({
        first_name: req.body.first_name || req.userDetails.first_name,
        last_name: req.body.last_name || req.userDetails.last_name,
        password: req.body.password ? await bcrypt.hash(req.body.password, 10) : req.userDetails.password,
        username: req.body.username
    }, {
        where: {
            id: userId.id,
        },
    });

    console.log("New user: " + updateUser.last_name)
    logger.info("User information is modified successfully!")
    return res.status(204).end();
}

}

async function checkDataBaseConnection(res) {

    try {
        const { host, user, password, database, dialect } = config;

        const sequelize = new Sequelize(database, user, password, { host: host, dialect: dialect });
        await sequelize.authenticate();
        console.log('Connection Established successfully.');
        logger.info("Connection Established successfully.");
        return true;
    }
    catch (error) {
        console.error('Could not connect to database', error);
        logger.error("Could not connect to database");
        return res.status(503).end();
    }
}

function checkExtraParams(req) {
    const keys = ['first_name', 'last_name', 'password', 'username'];
    logger.warn("No extra parameters are allowed")
    const extraKeys = Object.keys(req.body).filter(key => !keys.includes(key));
    if (extraKeys.length > 0)
        return true;
    else
        return false;

}

function validateBody(req) {
    const { password, first_name, last_name, username } = req.body;
    if (!password || !first_name || !last_name || !username || !validator.isEmail(username) || password.length < 5)
        return true;
    else
        return false;
};

export const verifyUser = async (req, res) => {
    try {
        console.log("In verifyUser");
        logger.info("Trying to verify the user");

        const { token } = await req.query;
        logger.info("Token generated: " + token)
        const userDetails = await db.UserVerifications.findOne({ where: { token: token } });
  
        logger.info("User Details: " + userDetails)

        const expirationTime = userDetails.token_expiry;
        logger.info("Expiration time: " + expirationTime);
        
        const currentTime = new Date();
        logger.info("Current Time: " + currentTime);
        logger.info("User Details username: " + userDetails.username)

        if (currentTime < expirationTime) {
            const updateUserVerificationTable = await db.UserVerifications.update({
                user_status: "User Verified"
            }, {
                where: {
                    username: userDetails.username,
                },
            });

            const updateUser = await db.Users.update({
                isUserVerified: true
            }, {
                where: {
                    username: userDetails.username,
                },
            });

            return res.send('User successfully verified!');
        } else {
            
            const updateUserVerificationTable = await db.UserVerifications.update({
                user_status: "User Not Verified"
            }, {
                where: {
                    username: userDetails.username,
                },
            });

            const updateUser = await db.Users.update({
                isUserVerified: false
            }, {
                where: {
                    username: userDetails.username,
                },
            });

            return res.send('Verification link has expired.');
        }
    } catch (error) {
        console.error("Error in verifyUser:", error.message);
        logger.error("Error in verifyUser: " + error.message);
        return res.status(500).send('An error occurred while verifying the user.');
    }
};



