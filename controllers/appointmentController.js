import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const addAppointment = async (req, res) => {
  const userId = req.headers['user-id']
  
  try {
    const newAppointment = await Appointment.create({
      userId: userId, // `UserId` should be `_id`
      date: req.body.date,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      commercial: req.body.commercial
    });
    res.status(201).json({
      newAppointment
    });
  } catch (error) {
    res.status(400).json({
      message: "ERROR ADD"
    });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("posted_by");
    res.status(200).json( appointments );
  } catch (error) {
    res.status(400).json({ message: "ERROR GET ALL" });
  }
};

const getAppointmentByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const appointments = await Appointment.find({ userId }).populate('posted_by');
    res.status(200).json( appointments );
  } catch (error) {
    res.status(400).json({ message: "ERROR GET BY USER ID" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        date: req.body.date,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        commercial: req.body.commercial
      },
      { new: true }
    );
    res.status(200).json( updatedAppointment );
  } catch (error) {
    res.status(400).json({ message: "ERROR UPDATE" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "ERROR DELETE" });
  }
};

export {
  addAppointment,
  getAllAppointment,
  getAppointmentByUserId,
  updateAppointment,
  deleteAppointment
};
