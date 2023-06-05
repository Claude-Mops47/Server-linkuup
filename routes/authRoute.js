import express from 'express'
import {login, addUser, getAllUsers, getUserById, updateUserById, deleteUserById} from '../controllers/authController.js'
import verifyAuth  from '../middleware/verifyAuth.js'

const router = express.Router()

router.route('/authenticate').post(login)
router.route('/users/add-user').post(addUser)
router.route('/users').get(verifyAuth, getAllUsers)
router.route('/users/:id').get(verifyAuth,getUserById)
router.route('/users/:id').put(verifyAuth,updateUserById)
router.route('/users/:id').delete(verifyAuth,deleteUserById)

export default router
