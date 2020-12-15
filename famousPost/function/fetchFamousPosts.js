const {runQuery} = require('../../db/query')

const fetchFamousPost = async(userId="") => {
    let  sql = "SELECT group_concat(mediaUrl) as mediaUrl, group_concat(mediaThumbUrl) as mediaThumbUrl, group_concat(wallfame_post_table.postId) as postId, group_concat(date) as date, group_concat(description) as description, group_concat(mimeType) as mimeType, MAX(userName) as userName, MAX(userDp) as userDp, wallfame_post_table.creatorId, (CASE WHEN isl.famousUserId IS NULL THEN 0 ELSE 1 END) as isLiked, group_concat((CASE WHEN bookmark.postId IS NULL THEN 0 ELSE 1 END)) as isBookmarked FROM wallfame_post_table INNER JOIN (SELECT userId, userName, userDp FROM wallfame_user_table)u ON u.userId = wallfame_post_table.creatorId LEFT JOIN (Select famousUserId, userId FROM wallfame_post_like_table WHERE userId = \"" + userId + "\")isl ON  isl.famousUserId = wallfame_post_table.creatorId LEFT JOIN (Select postId, userId FROM wallfame_bookmark_table WHERE userId = \"" + userId + "\")bookmark ON  bookmark.postId = wallfame_post_table.postId GROUP BY creatorId having count(*) >0 ORDER BY group_concat(wallfame_post_table.postId) DESC;";
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