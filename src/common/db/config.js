require('dotenv').config();

const path = require('node:path');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    modelPaths: [path.resolve('src/features/**/entity/*.entity.ts')],
  },
};
