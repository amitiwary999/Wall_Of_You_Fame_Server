const { runQuery } = require("../../db/query");

const updatePostLike = async(postId, userId, increment) => {
    let sql
    if (increment === 1) {
        sql = "INSERT INTO wallfame_post_like_table (postId, userId) VALUES (\"" + postId + "\", \"" + userId + "\");"
    } else {
        sql = "DELETE FROM wallfame_post_like_table WHERE postId = \"" + postId + "\" AND userId = \"" + userId + "\";"
    }
    try{
        let result = await runQuery(pool, sql);
        if(result !== null && result !== undefined){
            return 1;
        }else{
            throw new Error("can't like the post")
        }
    }catch(error){
        throw error;
    }
}

module.exports = {
    updatePostLike
}