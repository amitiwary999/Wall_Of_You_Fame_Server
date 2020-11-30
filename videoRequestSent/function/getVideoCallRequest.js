const {runQuery} = require('../../db/query')

const getCallRequest = async(requestorId) => {
    let sql = "SELECT * FROM wallfame_video_requests_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_video_requests_table.inviteeId WHERE requestorId = '"+ requestorId+"'";
    let result = await runQuery(sql);
    if(result){
       return result;
    }else{
        throw "No video request"
    }
}

module.exports = {
    getCallRequest
}