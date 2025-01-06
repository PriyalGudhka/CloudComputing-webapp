import dotenv from 'dotenv';
dotenv.config();

const config = {
    env: process.env['ENV'] ?? 'dev',
    port: process.env['PORT'] ?? 8080,
    host: process.env['HOST'],
    user: process.env['MYSQLUSERNAME'],
    password: process.env['PASSWORD'],
    database: process.env['DATABASE'],
    dialect: "mysql"
};

export default config;