import express from 'express'
import { addComment } from '../controllers/CommentController.js'
import verifyAuth  from '../middleware/verifyAuth.js'

const router = express.Router()

router.route('/add-com').post(verifyAuth,addComment)


export default router
