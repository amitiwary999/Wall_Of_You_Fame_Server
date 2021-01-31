const { runQuery } = require("../../db/query");

const updateProfile = async(input, userId) => {
    let name = input.userName;
    let dp = input.userDp;
    let about  = input.userBio ? input.userBio : ""
    let sql = "UPDATE wallfame_user_table SET userName = '"+ name + "', userDp = '" + dp + "', userBio = '" + about +"' WHERE userId = '"+ userId + "'"
    let result = runQuery(sql)
    return result;
}

module.exports = {
    updateProfile
}