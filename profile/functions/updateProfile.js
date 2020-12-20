const { runQuery } = require("../../db/query");

const updateProfile = async(input, userId) => {
    let name = input.name;
    let dp = input.dp;
    let about  = input.about ? input.about : ""
    let sql = "UPDATE wallfame_user_table SET userName = '"+ name + "', userDp = '" + dp + "', userBio = '" + about +"' WHERE userId = '"+ userId + "'"
    let result = runQuery(sql)
    return result;
}

module.exports = {
    updateProfile
}