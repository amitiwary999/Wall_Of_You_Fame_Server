/* eslint-disable promise/no-nesting */
require('dotenv').config()
const { config } = require('firebase-functions');
const mysql = require('promise-mysql');

let sqlConfig = {
    user: process.env.RDS_SQL_USER,
    password: process.env.RDS_SQL_PASSWORD,
    host: process.env.RDS_SQL_HOST,
    port: process.env.RDS_SQL_PORT,
    database: process.env.RDS_SQL_DATABASE,
    connectionLimit: parseInt(process.env.CONNECTION_LIMIT),
    connectTimeout: parseInt(process.env.CONNECT_TIMEOUT), //  10 seconds
    acquireTimeout: parseInt(process.env.ACQUIRE_TIMEOUT), //  10 seconds
    waitForConnections: true, //  Default: true
    queueLimit: 0,
    charset: "utf8mb4_unicode_ci", //  for special characters and emoji, else error
    supportBigNumbers: true,
}

const pool = mysql.createPool(sqlConfig);

async function runQuery(sqlQuery) {
    return pool.then(p => {
            return p.getConnection();
        })
        .then(connection => {
            return connection.beginTransaction()
                .then(() => {
                    return connection.query(sqlQuery)
                        .then(results => {
                            return connection.commit()
                                .then(() => {
                                    connection.release();
                                    return results;
                                })
                                .catch(_error => {
                                    connection.release();
                                    return results;
                                })
                        })
                        .catch(error => {
                            console.error("not able to run query", error);
                            console.error("query not able to run query is ", sqlQuery);
                            // eslint-disable-next-line promise/no-nesting
                            connection.rollback()
                                .then(() => {
                                    connection.release();
                                    return null;
                                })
                                .catch(error => {
                                    console.error("not able to rollback", error);
                                    connection.release();
                                    return null;
                                })
                                throw "not able to run query"
                        })
                })
                .catch(error => {
                    console.error("not able to begin transaction", error);
                    console.error("query not able to begin transaction is ", sqlQuery);
                    connection.rollback()
                        .then(() => {
                            connection.release();
                            return null;
                        })
                        .catch(error => {
                            console.error("not able to rollback", error);
                            connection.release();
                            return null;
                        })
                    throw "not able to begin transaction"    
                })
        })
        .catch(error => {
            console.error("not able to get connection", error);
            console.error("query not able to get connection is ", sqlQuery);
            return null
        })
}

module.exports = {
    runQuery
}