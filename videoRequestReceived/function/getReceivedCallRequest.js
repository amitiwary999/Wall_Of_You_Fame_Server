const {runQuery} = require('../../db/query')

const getCallRequest = async(inviteeId) => {
    let sql = "SELECT * FROM wallfame_video_requests_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_video_requests_table.requestorId WHERE inviteeId = '"+ inviteeId+"' AND status != 2";
    let result = await runQuery(sql);
    if(result ? result.affectedRows : false){
        return result
    }else{
        throw "No video request"
    }
}

module.exports = {
    getCallRequest
}