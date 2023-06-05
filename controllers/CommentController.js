import Comment from "../models/Comment.js";
import User from "../models/User.js";

const addComment = async (req, res)=>{
    try {
        const comment = await Comment.create({
            AppointmentId: req.params.id,
            UserId:req.user.id,
            comment:req.body.comment,
            statut:req.body.status
        })
        if(!comment){
            return res.status(400).json({msg:"ERROR COMMENT"})
        }
        res.status(200).json({comment})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:"ERROR POST COMMENT."})
    }
}

export {addComment}