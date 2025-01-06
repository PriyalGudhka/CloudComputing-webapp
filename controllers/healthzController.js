import config from '../config/config.js';
import { Sequelize } from 'sequelize';
import { logger } from '../middleware/logger.js'

const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: config.dialect
});

//Function to check if Request body is empty and there are no query parameters
export function validateRequestBody(req) {

    const payloadType = req.headers['content-type'];

    if ((req.body.toString().trim() == '' || payloadType)) {
        console.log("Inside body");
        return false;
    }

    if (Object.keys(req.query).length > 0) {
        logger.error("Query parameters are not allowed");
        console.log("Inside query params");
        return false
    }

    return true;
}

//Handles logic when /healthz endpoint is hit
export const healthzCheck = async (req, res) => {
    res.setHeader('cache-control', 'no-cache, no-store, must-revalidate'); //sets the header

    try {
        //Checks if enpoint is hit only by GET request method type otherwise returns 405
        if (req.method !== 'GET')
            return res.status(405).end();

        //Validates if there are no query params and request body otherwise returns 400
        if (!validateRequestBody(req))
            return res.status(400).end();

        await sequelize.authenticate();
        console.log('Connection Established successfully.');
        logger.info('Connection Established successfully.');
        return res.status(200).end();
    }

    catch (error) {
        console.error('Could not connect to database', error);
        logger.error('Could not connect to database');
        return res.status(503).end();
    }
}

//Handles logic when any other endpoints except /healthz endpoint is hit
export const validateIncorrectEndpoint = async (req, res) => {
    logger.debug("Requested url is invalid")
    res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
    return res.status(404).end();

}
