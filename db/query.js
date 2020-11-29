/* eslint-disable promise/no-nesting */
require('dotenv').config()
const mysql = require('promise-mysql');

const pool = mysql.createPool({
  user: process.env.sqlUser,
    host: '34.93.68.9',
  password: process.env.sqlPassword,
  database: process.env.sqlDatabase,
//   socketPath: "/cloudsql/expinf:asia-south1:famouswall",
  connectionLimit: 100,
  connectTimeout: 10000, //  10 seconds
  acquireTimeout: 10000, //  10 seconds
  waitForConnections: true, //  Default: true
  queueLimit: 0,
  charset: "utf8mb4_unicode_ci", //  for special characters and emoji, else error
  supportBigNumbers: true,
  bigNumberStrings: true,
});

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