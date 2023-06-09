import User from "../models/User.js";
import Appointment from "../models/Appointment.js";


const addAppointment = async (req, res) => {
  // const userId = req.headers["user-id"];
  const userId = req.params.id;
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

// const getAllAppointments = async (req, res) => {
//   try {
//     let appointments;
//     let query = {};


//     if (req.query.date) {
//       const date = new Date(req.query.date);
//       const startDate = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         date.getDate()
//       );
//       const endDate = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         date.getDate() + 1
//       );

//       query.createdAt = { $gte: startDate, $lt: endDate };
//     }

//     const startDate = req.query.startDate;
//     const endDate = req.query.endDate;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
    
//     query.createdAt = { $gte: startDate, $lt: endDate };

//     if (!req.query.page && !req.query.limit && !req.query.date) {
//       // Aucun paramètre de requête n'a été fourni, retourne la liste globale
//       appointments = await Appointment.find().populate("posted_by").exec();
//     } else {
//       // Un ou plusieurs paramètres de requête ont été fournis, utilise la requête avec les filtres appropriés
//       appointments = await Appointment.find(query)
//         .populate("posted_by")
//         .skip(skip)
//         .limit(limit)
//         .exec();
//     }
//     res.set('Cache-Control','public, stale-while-revalidate=3600')

//     res.status(200).json(appointments);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Erreur lors de la récupération des rendez-vous." });
//   }
// };

const getAllAppointments = async (req, res) => {
  try {
    let query = {};
    const { startDate, endDate, page, limit } = req.query;

    if (startDate && endDate) {
      const startOfDay = new Date(startDate);
      const endOfDay = new Date(endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      query.createdAt = { $gte: startOfDay, $lt: endOfDay };
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageSize;

    let appointments;

    if (!page && !limit && !startDate && !endDate) {
      // Aucun paramètre de requête n'a été fourni, retourne la liste globale
      appointments = await Appointment.find().populate("posted_by").exec();
    } else {
      // Un ou plusieurs paramètres de requête ont été fournis, utilise la requête avec les filtres appropriés
      appointments = await Appointment.find(query)
        .populate("posted_by")
        .skip(skip)
        .limit(pageSize)
        .exec();
    }

    res.set('Cache-Control', 'public, stale-while-revalidate=3600');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la récupération des rendez-vous." });
  }
};


const getAppointmentByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    let appointments;
    const date = req.query.date; // Récupère la date du paramètre de requête

    let query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query = {
        userId,
        createdAt: { $gte: startDate, $lt: endDate }
      };
    } else {
      query = { userId };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!req.query.page && !req.query.limit && !req.query.date) {
      // Aucun paramètre de requête n'a été fourni, retourne la liste globale
      appointments = await Appointment.find({ userId })
        .populate("posted_by")
        .exec();
    } else {
      // Un ou plusieurs paramètres de requête ont été fournis, utilise la requête avec les filtres appropriés
      appointments = await Appointment.find(query)
        .populate("posted_by")
        .skip(skip)
        .limit(limit)
        .exec();
    }

    res.set('Cache-Control','public, stale-while-revalidate=3600')
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).json({ message: "ERROR GET BY USER ID" });
  }
};


const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("posted_by")
      .exec();
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: "ERROR GET BY ID" });
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
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "ERROR DELETE" });
  }
};

export {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByUserId,
  updateAppointment,
  deleteAppointment,
};
