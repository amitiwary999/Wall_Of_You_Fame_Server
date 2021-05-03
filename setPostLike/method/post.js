const {verifyInput} = require('../../util/verifyInput');
const {updatePostLike} = require('../functions/updatePostLike')

module.exports = async(req, res) => {
    let userId = req.user.uid;
    try{
        const postId = verifyInput(req.body.postId)
        const increment = verifyInput(req.body.increment)
        try{
            await updatePostLike(postId, userId, increment)
            res.status(200).send({message: "successfully updated the post"})
        }catch(error){
            return res.status(500).send({message: error})
        }
    }catch(error){
        return res.status(400).send({message: error})
    }
}