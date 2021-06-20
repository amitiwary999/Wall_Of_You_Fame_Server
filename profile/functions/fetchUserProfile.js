const {getUserProfileDb} = require('../../db/query')

const fetchProfile = async(input, userId) => {
    let id = ""
    let sql = ""
    if(userId){
        sql = "SELECT * FROM wallfame_user_table WHERE userId = ?"
        id = userId;
    }else{
        sql = "SELECT * FROM wallfame_user_table WHERE profileId = ?"
        id = input.profileId;
    }
    return new Promise((resolve, reject) => {
        getUserProfileDb(sql, id, (error, data) => {
            if(error){
                reject(error);
            }else{
                resolve(data);
            }
        })
    })
}

module.exports = {
    fetchProfile
}
