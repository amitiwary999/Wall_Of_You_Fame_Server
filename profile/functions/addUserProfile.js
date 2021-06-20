const { saveUserDb } = require("../../db/query");

const addProfile = async(input, userId) => {
    const data = {userId, profileId: input.profileId, userName: input.name, userDp: input.dp, userEmail: input.email}
    return new Promise((resolve, reject) => {
        saveUserDb(data, (error, result) => {
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        })
    })
}

module.exports = {
    addProfile
}