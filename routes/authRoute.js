import express from 'express'
import {login, addUser, getAllUsers, getUserById, updateUserById, deleteUserById, getCurrentUser, logout} from '../controllers/authController.js'
import verifyAuth  from '../middleware/verifyAuth.js'

const router = express.Router()

router.route('/authenticate').post(login)
router.route('/logout').post(logout)
router.route('/add-user').post(addUser)
router.route('/').get(verifyAuth, getAllUsers)
router.route('/:id').get(verifyAuth,getUserById)
router.route('/current').get(verifyAuth,getCurrentUser)
router.route('/:id').put(verifyAuth,updateUserById)
router.route('/:id').delete(verifyAuth,deleteUserById)

export default router
