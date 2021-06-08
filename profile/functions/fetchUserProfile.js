const {runQuery} = require('../../db/query')

const fetchProfile = async(input, userId) => {
    let profileId = input.profileId;
    let sql = ""
    if(userId){
        sql = "SELECT * FROM wallfame_user_table WHERE userId = '"+userId+"'"
    }else{
        sql = "SELECT * FROM wallfame_user_table WHERE profileId = '"+profileId+"'"
    }
    let res = await runQuery(sql)
    if(res){
        let profile = res[0];
        if(userId && profile.userId && profile.userId === userId){
            profile.selfProfile = 1;
        }
        return profile
    }else{
        throw new Error("Oops! something went wrong. May be profile doesn't exist")
    }
}

module.exports = {
    fetchProfile
}
