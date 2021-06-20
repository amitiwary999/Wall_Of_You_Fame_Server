const { addPostLike, deletePostLike } = require("../../db/query");

const updatePostLike = async(postId, userId, increment) => {
    return new Promise((resolve, reject) => {
        if(increment === 1){
            let data = {postId, userId};
            addPostLike(data, (error, data) => {
                if(error){
                    reject(error)
                }else{
                    resolve(data)
                }
            })
        }else{
            deletePostLike(postId, userId, (error, data) => {
                if(error){
                    reject(error)
                }else{
                    resolve(data)
                }
            })
        }
    })
}

module.exports = {
    updatePostLike
}