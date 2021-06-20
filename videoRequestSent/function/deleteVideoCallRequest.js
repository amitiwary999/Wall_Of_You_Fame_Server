const {deleteRequestDb} = require('../../db/query')

const deleteRequest = async(id) => {
    return new Promise((resolve, reject) => {
        deleteRequestDb(id, (error, data) => {
            if(error){
                reject(error);
            }else{
                resolve(data)
            }
        })
    })
}

module.exports = {
    deleteRequest
}