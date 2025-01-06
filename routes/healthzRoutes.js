import express from 'express';
import authorizeUser from '../middleware/basicAuthorizartion.js';
import * as healthzController from '../controllers/healthzController.js';
import * as userController from '../controllers/userController.js';

const Router = express.Router();

//Will redirect requests hitting /healthz endpoint
Router.route('/healthz')
    .all(healthzController.healthzCheck); 

Router.route('/v1/user')    
// .post(validateBody, userController.createNewUser);
.all(userController.createNewUser);

Router.route('/v1/user/self')
.get(authorizeUser,userController.retrieveUserInformation);

Router.route('/v1/user/self')
.put(authorizeUser,userController.updateUserInformation);

// Router.route('/verify/:username/:expirationTime')
Router.route('/account_verification')
.get(userController.verifyUser);

//Will redirect requests hitting  any endpoint except /healthz endpoint
Router.route('/*')
    .all(healthzController.validateIncorrectEndpoint)

export default Router;