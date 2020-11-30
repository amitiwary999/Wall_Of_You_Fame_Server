const {runQuery} = require('../../db/query')

const saveFamousPost = async(userId, input) => {
    var date = Date.now();
    var description = input.desc
    var mediaUrl = input.mediaUrl
    var mediaThumbUrl = input.mediaThumbUrl
    var postId = input.postId
    var mimeType = input.mimeType

    //let sql = "INSERT INTO wallfame_blog_table (postId, desc, date, imageUrl, creatorId) VALUES (\"" + postId + "\",\"" + date + "\",\"" + imageUrl + "\",\"" + creatorId + "\",\"" + desc + "\");";
    let s = "INSERT INTO wallfame_post_table (postId, date, description, mediaUrl, mediaThumbUrl, mimeType, creatorId) VALUES (\"" + postId + "\", " + date + ", \"" + description + "\", \"" + mediaUrl + "\", \"" + mediaThumbUrl + "\", \"" + mimeType + "\", \"" + userId + "\");";
    let result = await runQuery(s);
    if(result ? result.affectedRows : false){
        return "saved the famous post successfully"
    }else{
        throw "Oops! something went wrong. Try after sometime"
    }
}

module.exports = {
    saveFamousPost
}