require('dotenv').config()
const mysql = require('mysql');

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

const executeQuery = (sql, values, callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return callback(err);
      }
      if (connection) {
        connection.query(sql, values, (error, results) => {
          connection.release();
          if (error) {
            return callback(error);
          }
          return callback(null, results);
        });
      }
    });
}

const saveFamousPostDb = (data, callback) => {
    const query = 'INSERT INTO wallfame_post_table SET ?'
    executeQuery(query, data, (error, data) => {
        if(error){
            return callback(error);
        }
        return callback(null, data);
    })
}

const getFamousPostDb = (userId, callback) => {
    const query = "SELECT wallfame_post_table.*, (CASE WHEN isl.postId IS NULL THEN 0 ELSE 1 END) as isLiked, (CASE WHEN bookmark.postId IS NULL THEN 0 ELSE 1 END) as isBookmarked, userName, userDp, profileId FROM wallfame_post_table INNER JOIN (SELECT userId, userName, userDp, profileId FROM wallfame_user_table)u ON u.userId = wallfame_post_table.creatorId LEFT JOIN (Select postId, userId FROM wallfame_post_like_table WHERE userId = ?)isl ON  isl.postId = wallfame_post_table.postId LEFT JOIN (Select postId, userId FROM wallfame_bookmark_table WHERE userId = ?)bookmark ON  bookmark.postId = wallfame_post_table.postId ORDER BY wallfame_post_table.postId DESC"
    executeQuery(query, [userId, userId], (error, data) => {
        if(error){
            return callback(error);
        }
        return callback(null, data);
    })
}

const saveUserDb = (data, callback) => {
  const query = "INSERT IGNORE INTO wallfame_user_table SET ?"
  executeQuery(query, data, (error, data) => {
    if(error){
      return callback(error);
    }
    return callback(null, data);
  })
}

const getUserProfileDb = (query, id, callback) => {
  executeQuery(query, id, (error, data) => {
    if(error){
      return callback(error);
    }
    return callback(null, data);
  })
}

const updateProfileDb = (name, dp, about, userId, callback) => {
  const query = "UPDATE wallfame_user_table SET userName = ?, userDp = ?, userBio = ? WHERE userId = ?"
  executeQuery(query, [name, dp, about, userId], (error, data) => {
    if(error){
      return callback(error);
    }
    return callback(null, data);
  }) 
}

const addPostLike = (data, callback) => {
  const query = "INSERT INTO wallfame_post_like_table SET ? "
  executeQuery(query, data, (error, data) => {
    if(error){
      return callback(error);
    }else{
      return callback(null, data)
    }
  })
}

const deletePostLike = (postId, userId, callback) => {
  const query = "DELETE FROM wallfame_post_like_table WHERE postId = ? AND userId = ?"
  executeQuery(query, [postId, userId], (error, data) => {
    if(error){
      return callback(error);
    }
    return callback(null, data);
  })
}

const getReceivedCallRequestDb = (inviteeId, callback) => {
  const query = "SELECT * FROM wallfame_video_requests_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_video_requests_table.requestorId WHERE inviteeId = ? AND status != 2"
  executeQuery(query, [inviteeId], (error, data) => {
    if(error){
      return callback(error);
    }
    return callback(null, data)
  })
}

const deleteRequestDb = (id, callback) => {
  const query = "DELETE FROM wallfame_video_requests_table WHERE id = ?"
  executeQuery(query, [id], (error, data) => {
    if(error){
      return callback(error)
    }
    return callback(null, data)
  })
}

const getVideoCallRequestDb = (id, callback) => {
  const query = "SELECT * FROM wallfame_video_requests_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_video_requests_table.inviteeId WHERE requestorId = ?"
  executeQuery(query, [id], (error, data) => {
    if(error){
      return callback(error)
    }
    return callback(null, data)
  })
}

const saveVideoCallRequestDb = (data, status, updatedAt, callback) => {
  const query = "INSERT INTO wallfame_video_requests_table SET ? ON DUPLICATE KEY UPDATE status = ?, updatedAt = ?;"
  executeQuery(query, [data, status, updatedAt], (error, result) => {
    if(error){
      return callback(error);
    }
    return callback(null, result)
  })
}

const getAlreadyRequestedOrNot = (id, callback) => {
  const query = "SELECT * FROM wallfame_video_requests_table WHERE status = 0 AND id=? OR status=1 AND updatedAt > CURRENT_TIMESTAMP"
  executeQuery(query, id, (error, result) => {
    if(error){
      return callback(error);
    }
    return callback(null, result)
  })
}

module.exports = {
    executeQuery,
    saveFamousPostDb,
    getFamousPostDb,
    saveUserDb,
    getUserProfileDb,
    updateProfileDb, 
    addPostLike,
    deletePostLike,
    getReceivedCallRequestDb,
    deleteRequestDb,
    getVideoCallRequestDb,
    saveVideoCallRequestDb,
    getAlreadyRequestedOrNot
}