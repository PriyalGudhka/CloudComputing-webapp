import config from '../config/config.js';
import { Sequelize, DataTypes } from 'sequelize';
import User from './users.js'; 
import UserVerification from './userVerifications.js';
import mysql from 'mysql2/promise';


const { host, user, password, database, dialect } = config;
const connection = await mysql.createConnection({ host, user, password });
await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

const sequelize = new Sequelize(database, user, password, { host: host, dialect: dialect });

const db = {
    Sequelize,
    sequelize,
    Users: User(sequelize, Sequelize.DataTypes),
    UserVerifications: UserVerification(sequelize, Sequelize.DataTypes),
}




db.Users.sync({ alter: true }).then(() => {
   console.log("User table created successfully");
  }).catch(() => {
    console.log("User table not created successfully");
  }
    
  )

  db.UserVerifications.sync({ alter: true }).then(() => {
    console.log("User Verification table created successfully");
   }).catch(() => {
     console.log("User Verification table not created successfully");
   }
     
   )

export { db as default };
