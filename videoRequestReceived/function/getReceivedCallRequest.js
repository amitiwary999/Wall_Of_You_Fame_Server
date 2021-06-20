const {runQuery, getVideoCallRequestDb} = require('../../db/query')

const getCallRequest = async(inviteeId) => {
    return new Promise((resolve, reject) => {
        getVideoCallRequestDb(inviteeId, (error, data) => {
            if(error){
                reject(new Error('No video request'))
            }else{
                resolve(data)
            }
        })
    })
}

module.exports = {
    getCallRequest
}