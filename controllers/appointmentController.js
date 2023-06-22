import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { generateVersion } from "../middleware/utils.js";

let appointmentsVersion = null

// Fonction pour récupérer tout les rdv
const getAllAppointments = async () =>{
  return await Appointment.find().populate("posted_by")
}
// Fonction pour générer la version
const generateAppointmentsVersion = async ()=>{
  const appointments = await getAllAppointments();
  return generateVersion(appointments)
}
// Middleware pour définir l'en-tête Etag
const setETagHeader = async (req, res, next)=>{
  if(!appointmentsVersion){
     appointmentsVersion = await generateAppointmentsVersion();
  }
  res.setHeader('ETag', appointmentsVersion);
  next()
}



const addAppointment = async (req, res) => {
  const userId = req.headers["user-id"];
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAppointment = await Appointment.create({
      userId: userId, // `UserId` should be `_id`
      date: req.body.date,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      commercial: req.body.commercial,
      comment: req.body.comment,
    });
    // await setETagHeader(req, res, ()=>{})
    res.status(201).json({
      newAppointment,
    });
  } catch (error) {
    res.status(400).json({
      message: "ERROR ADD",
    });
  }
};

// const getAllAppointment = async (req, res) => {
//   try {
//     const appointments = await Appointment.find().populate("posted_by");
//     await setETagHeader(req, res, ()=>{})
//     res.status(200).json(appointments);
//   } catch (error) {
//     res.status(400).json({ message: "ERROR GET ALL" });
//   }
// };
const getAllAppointment = async (req, res) => {
  try {
    let appointments;
    const currentDate = new Date();

    if (req.query.date) {
      const date = new Date(req.query.date);
      const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      appointments = await Appointment.find({
        createdAt: { $gte: startDate, $lt: endDate },
      }).populate("posted_by");
    } else {
      appointments = await Appointment.find().populate("posted_by");
      if (currentDate) {
        const currentAppointments = await Appointment.find({
          createdAt: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 86400000) }, // Filtrer pour les rendez-vous de la journée
        }).populate("posted_by");
        appointments = appointments.concat(currentAppointments);
      }
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: "ERROR GET ALL" });
  }
};




const getAppointmentByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const appointments = await Appointment.find({ userId }).populate(
      "posted_by"
    );
    // await setETagHeader(req, res, ()=>{})
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
    // await setETagHeader(req, res, ()=>{})
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
      res.status(404).json({ message: "Appointment not found" });
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
    // await setETagHeader(req, res, ()=>{})
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: "ERROR UPDATE" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
    }
    await Appointment.findByIdAndDelete(appointmentId);
    // await setETagHeader(req, res, ()=>{})
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
