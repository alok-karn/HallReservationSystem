const mysql = require("mysql2");
const config = require("./config");

const pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: config.mysqlUsername,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    port: config.mysqlPort,
});

const promisePool = pool.promise();

console.log(promisePool);

const executeQuery = async (query, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await promisePool.execute(query, params);
            return resolve(rows);
        } catch (error) {
            console.log(error.message);
            return reject(error);
        }
    });
};

module.exports = {
    query: executeQuery,
};
