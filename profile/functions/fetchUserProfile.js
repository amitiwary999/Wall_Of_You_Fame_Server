const {runQuery} = require('../../db/query')

const fetchProfile = async(input) => {
    let profileId = input.profileId;
    let sql = "SELECT * FROM wallfame_user_table WHERE profileId = '"+profileId+"'"
    let res = await runQuery(sql)
    if(res){
        return res[0]
    }else{
        throw "Oops! something went wrong. May be profile doesn't exist"
    }
}

module.exports = {
    fetchProfile
}
