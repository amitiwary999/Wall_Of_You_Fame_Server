const {runQuery} = require('../../db/query')

const fetchFamousPost = async(userId="") => {
    let sql = "SELECT wallfame_post_table.*, (CASE WHEN isl.postId IS NULL THEN 0 ELSE 1 END) as isLiked, (CASE WHEN bookmark.postId IS NULL THEN 0 ELSE 1 END) as isBookmarked FROM wallfame_post_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_post_table.creatorId LEFT JOIN (Select postId, userId FROM wallfame_post_like_table WHERE userId = \"" + userId + "\")isl ON  isl.postId = wallfame_post_table.postId LEFT JOIN (Select postId, userId FROM wallfame_bookmark_table WHERE userId = \"" + userId + "\")bookmark ON  bookmark.postId = wallfame_post_table.postId ORDER BY wallfame_post_table.postId DESC"
    let result = await runQuery(sql);
    if(result){
        return result
    }else{
        throw "there is no post"
    }
}

module.exports = {
    fetchFamousPost
}