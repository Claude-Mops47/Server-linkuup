import Appointment from "../models/Appointment.js";

let appointmentsVersion = null;

const generateVersion = (appointments) => {
  let version = 0;
  for (const appointment of appointments) {
    version += appointment.version || 0;
  }
  return version.toString();
};

// Fonction pour récupérer tous les rdv
const getAllAppointments = async () => {
  return await Appointment.find().populate("posted_by");
};

// Fonction pour générer la version des rdv
const generateAppointmentsVersion = async () => {
  const appointments = await getAllAppointments();
  return generateVersion(appointments);
};

// Middleware pour définir l'en-tête Etag
export const setETagHeader = async (req, res, next) => {
  if (!appointmentsVersion) {
    appointmentsVersion = await generateAppointmentsVersion();
  }
  res.setHeader("ETag", appointmentsVersion);
  next();
};
