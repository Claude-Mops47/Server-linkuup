
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
    console.log("OOP",error);
    res.status(400).json({
      msg: "ERROR ADD"
    });
  }
};
const getAll = async(req, res)=>{
    try {
        const appointment = await Appointment.find().populate("posted_by");
        return res.status(200).json({ appointment})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:"ERROR GET ALL"})
    }
}

export { addAppointment , getAll};
