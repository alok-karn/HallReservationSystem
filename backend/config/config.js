const dotenv = require("dotenv");
const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    mysqlUsername: process.env.MYSQL_USERNAME,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    mysqlDatabase: process.env.MYSQL_DATABASE,
    mysqlPort: process.env.MYSQL_PORT,
};
