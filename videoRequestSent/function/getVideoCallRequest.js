const {runQuery, getVideoCallRequestDb} = require('../../db/query')

const getCallRequest = async(requestorId) => {
    return new Promise((resolve, reject) => {
        getVideoCallRequestDb(requestorId, (error, data) => {
            if(error){
                reject(error)
            }else{
                resolve(data);
            }
        })
    })
}

module.exports = {
    getCallRequest
}