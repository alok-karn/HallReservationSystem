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
// console.log("Connected to MySQL database successfully!");
// console.log(typeof promisePool);

// if (promisePool) {
//     console.log("Connected to MySQL database successfully!");
// } else {
//     console.log("Connection to MySQL database failed!");
// }

pool.getConnection((err, connection) => {
    if (err) {
        console.log("Connection to MySQL database failed!");
        console.log(err);
    } else {
        console.log("Connected to MySQL database successfully!");
        connection.release(); // release the connection to the pool
    }
});

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
