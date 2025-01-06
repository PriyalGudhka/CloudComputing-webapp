import db from '../models/index.js';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import { Sequelize, DataTypes } from 'sequelize';
import { logger } from './logger.js';

const authorizeUser = async (req, res, next) => {
    console.log("In Basic Authozization");

    try {

        const sequelize = new Sequelize(config.database, config.user, config.password, { host: config.host, dialect: config.dialect });
        await sequelize.authenticate();
        console.log('Connection Established successfully.');
        logger.info("Connection Established successfully.");
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            logger.warn("Authorization header is missing")
            return res.status(401).end();
        }
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        const user = await db.Users.findOne({ where: { username: username } });

        if (user) {
            console.log("User found: " + user.password);
            const validateUserPassword = await isPasswordValid(user.password, password)

            console.log("validateUserPassword: " + validateUserPassword)
            if (validateUserPassword) {
                logger.info("User authenticated successfully");
                req.userDetails = user
                next()
            }
            else
                return res.status(401).end();
        }
        else
            return res.status(401).end();

    }
    catch (error) {
        console.error('Could not connect to database', error);
        return res.status(503).end();
    }
}

async function isPasswordValid(hash, password) {
    const isPasswordMatching = await bcrypt
        .compare(password, hash) ? true : false

    return isPasswordMatching

}

export default authorizeUser;

