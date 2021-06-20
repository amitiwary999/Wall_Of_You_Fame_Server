const { user } = require('firebase-functions/lib/providers/auth')
const {saveFamousPostDb} = require('../../db/query')

const saveFamousPost = async(userId, input) => {
    var description = input.desc
    var mediaUrl = input.mediaUrl
    var mediaThumbUrl = input.mediaThumbUrl
    var postId = input.postId
    var mimeType = input.mimeType
    const data = {postId, description, mediaUrl, mediaThumbUrl, mimeType, creatorId: userId}
    return new Promise((resolve, reject) => {
        saveFamousPostDb(data, (error, result) => {
            if(error){
                reject(error)
            }else{
                resolve("saved your famous post successfully")
            }
        })
    })
}

module.exports = {
    saveFamousPost
}