import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const addAppointment = async (req, res) => {
  try {
    const newAppointment = await Appointment.create({
      UserId: req.user.id, // `UserId` should be `_id`
      dateProg: req.body.dateProg,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      commercial: req.body.commercial
    });
    res.status(201).json({
      newAppointment
    });
  } catch (error) {
    console.log("OOP", error);
    res.status(400).json({
      msg: "ERROR ADD"
    });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("posted_by");
    res.status(200).json( appointments );
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "ERROR GET ALL" });
  }
};

const getAppointmentByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find({ UserId: userId });
    res.status(200).json( appointments );
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "ERROR GET BY USER ID" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        dateProg: req.body.dateProg,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        commercial: req.body.commercial
      },
      { new: true }
    );
    res.status(200).json( updatedAppointment );
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "ERROR UPDATE" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ msg: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "ERROR DELETE" });
  }
};

export {
  addAppointment,
  getAllAppointment,
  getAppointmentByUserId,
  updateAppointment,
  deleteAppointment
};
