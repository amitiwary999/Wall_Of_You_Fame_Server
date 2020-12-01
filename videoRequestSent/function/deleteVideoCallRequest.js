const {runQuery} = require('../../db/query')

const deleteRequest = async(id) => {
    let sql = "DELETE FROM wallfame_video_requests_table WHERE id = '"+id+"'";
    let result = await runQuery(sql);
    if(result? result.affectedRows : false){
        return "deleted successfully"
    }else{
        throw "something went wrong"
    }
}

module.exports = {
    deleteRequest
}