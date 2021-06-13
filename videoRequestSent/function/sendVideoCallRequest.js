const {runQuery} = require('../../db/query')
const {generateHashId} = require('../../util/getHashId')

const sendVideoCallRequest = async(input, userId) =>{
    let inviteeId = input.inviteeId
    let status = input.status
    let date = input.callTime;
    let requestorId = userId; 
    if(status === 1){
        requestorId = input.inviteeId;
        inviteeId = userId; 
    }else{
        try{
            await alreadyRequested(requestorId, inviteeId)
        }catch(error){
            console.error(error);
            throw error
        }
    }
    let id =  requestorId+inviteeId
    let hashId = generateHashId(id);
    let roomNameId = String(String(requestorId)+Date.now())+inviteeId;
    let roomNameHash = generateHashId(roomNameId);

    let sql = "INSERT INTO wallfame_video_requests_table(id, requestorId, inviteeId, roomName, status, updatedAt) VALUES ('"+hashId+"', '"+ requestorId + "', '" + inviteeId + "','"+roomNameHash+"', '"+ status +"', '" + date + "') ON DUPLICATE KEY UPDATE status = '"+status+"', updatedAt = '"+date+"';"
    let result = await runQuery(sql);
    if(result? result.affectedRows : false){
        return 'successfully updated the call request'
    }else{
        throw "can't make video request"
    }

}

const alreadyRequested = async(requestorId, inviteeId) => {
    let id =  requestorId+inviteeId
    let hashId = generateHashId(id);
    let alreadyRequestedQuery =  "SELECT * FROM wallfame_video_requests_table WHERE status = 0 AND id='"+hashId+"' OR status=1 AND updatedAt > CURRENT_TIMESTAMP";
    let result =  await runQuery(alreadyRequestedQuery);
    if(result.length>0){
        throw 'You can make new request if your previous request rejected or completed'
    }else{
        return 1;
    }
}

module.exports = {
    sendVideoCallRequest,
    alreadyRequested
}