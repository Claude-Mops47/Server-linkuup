import express from 'express'
import { addAppointment, getAll } from '../controllers/appointmentController.js'
import verifyAuth  from '../middleware/verifyAuth.js'

const router = express.Router()

router.route('/add-new').post(verifyAuth, addAppointment)
router.route('/getAll').get(verifyAuth, getAll)


export default router
