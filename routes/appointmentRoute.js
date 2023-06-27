import express from "express";
import {
  addAppointment,
  deleteAppointment,
  // getAllAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByUserId,
  updateAppointment,
} from "../controllers/appointmentController.js";
import verifyAuth from "../middleware/verifyAuth.js";

const router = express.Router();

router.route("/add-new").post(verifyAuth, addAppointment);
router.route("/").get(verifyAuth, getAllAppointments);

router.route("/user/:id").get(verifyAuth, getAppointmentByUserId);

router.route("/:id").get(verifyAuth, getAppointmentById);
router.route("/:id").put(verifyAuth, updateAppointment);
router.route("/:id").delete(verifyAuth, deleteAppointment);

export default router;
