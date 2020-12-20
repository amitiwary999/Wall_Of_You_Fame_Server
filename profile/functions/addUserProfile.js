const { runQuery } = require("../../db/query");

const addProfile = (input, userId) => {
    let sql = "INSERT IGNORE INTO wallfame_user_table (userId, profileId, userName, userDp, userEmail) VALUES ('" + userId + "', '" + input.profileId + "',  '" + input.name + "', '" + input.dp + "', '" + input.email + "');";
    let result = await runQuery(sql);
    return result
}

module.exports = {
    addProfile
}