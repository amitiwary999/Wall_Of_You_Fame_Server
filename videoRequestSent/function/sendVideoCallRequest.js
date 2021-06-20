const {runQuery, saveVideoCallRequestDb, getAlreadyRequestedOrNot} = require('../../db/query')
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

    const data = {requestorId: requestorId, inviteeId: inviteeId, id: hashId, roomName: roomNameHash, status: status, updatedAt: date}
    return new Promise((resolve, reject) => {
        saveVideoCallRequestDb(data, status, date, (error, data) => {
            if(error){
                reject(error)
            }else{
                resolve(data)
            }
        })
    })
}

const alreadyRequested = async(requestorId, inviteeId) => {
    let id =  requestorId+inviteeId
    let hashId = generateHashId(id);
    return new Promise((resolve, reject) => {
        getAlreadyRequestedOrNot(hashId, (error, data) => {
            if(error){
                reject(error)
            }else{
                if(data.length>0){
                    reject(new Error('You can make new request if your previous request rejected or completed'))
                }else{
                    resolve(1);
                }
            }
        })
    })
}

module.exports = {
    sendVideoCallRequest,
    alreadyRequested
}