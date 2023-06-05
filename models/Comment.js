import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  AppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment",
    required: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  statut: {
    type: Array,
    required: true,
  },
});
export default  mongoose.model("comment", CommentSchema);
