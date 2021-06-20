const { runQuery, updateProfileDb } = require("../../db/query");

const updateProfile = async(input, userId) => {
    let name = input.userName;
    let dp = input.userDp;
    let about  = input.userBio ? input.userBio : ""
    return new Promise((resolve, reject) => {
        updateProfileDb(name, dp, about, userId, (error, data) => {
            if(error){
                reject(error)
            }else{
                resolve(data)
            }
        })
    })
}

module.exports = {
    updateProfile
}