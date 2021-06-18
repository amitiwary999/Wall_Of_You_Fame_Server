const {runQuery, getFamousPostDb} = require('../../db/query')

const fetchFamousPost = async(userId="") => {
    return new Promise((resolve, reject) => {
        getFamousPostDb(userId, (error, posts) => {
            if(error){
                reject(error)
            }else{
                resolve(posts)
            }
        })
    })
}

module.exports = {
    fetchFamousPost
}