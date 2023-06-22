import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const addAppointment = async (req, res) => {
  const userId = req.headers["user-id"];
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAppointment = await Appointment.create({
      userId,
      date: req.body.date,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      commercial: req.body.commercial,
      comment: req.body.comment,
    });
    res.status(201).json({ newAppointment });
  } catch (error) {
    res.status(400).json({ message: "ERROR ADD" });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    let appointments;

    if (req.query.date) {
      const date = new Date(req.query.date);
      const startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );
      appointments = await Appointment.find({
        createdAt: { $gte: startDate, $lt: endDate },
      }).populate("posted_by");
    } else {
      appointments = await Appointment.find().populate("posted_by");
      ;
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: "ERROR GET ALL" });
  }
};

const getAppointmentByUserId = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    // const userId = req.params.id;
    const appointments = await Appointment.find({ userId }).populate(
      "posted_by"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: "ERROR GET BY USER ID" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "posted_by"
    );
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: "ERROR GET BY ID" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        date: req.body.date,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        commercial: req.body.commercial,
        comment: req.body.comment,
        status: req.body.status,
      },
      { new: true }
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: "ERROR UPDATE" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // const appointment = await Appointment.findById(appointmentId);
    // if (!appointment) {
    //   return res.status(404).json({ message: "Appointment not found" });
    // }
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "ERROR DELETE" });
  }
};

export {
  addAppointment,
  getAllAppointment,
  getAppointmentById,
  getAppointmentByUserId,
  updateAppointment,
  deleteAppointment,
};
