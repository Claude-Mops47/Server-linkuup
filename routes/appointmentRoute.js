import express from "express";
import {
  addAppointment,
  deleteAppointment,
  getAllAppointment,
  getAppointmentById,
  getAppointmentByUserId,
  updateAppointment,
} from "../controllers/appointmentController.js";
import verifyAuth from "../middleware/verifyAuth.js";
import { setETagHeader } from "../middleware/utils.js";

const router = express.Router();

router.route("/add-new").post(verifyAuth, addAppointment);
router.route("/").get(verifyAuth, getAllAppointment);

router
  .route("/user/:id")
  .get(verifyAuth, setETagHeader, getAppointmentByUserId);

router.route("/:id").get(verifyAuth, setETagHeader, getAppointmentById);
router.route("/:id").put(verifyAuth, setETagHeader, updateAppointment);
router.route("/:id").delete(verifyAuth, setETagHeader, deleteAppointment);

export default router;
