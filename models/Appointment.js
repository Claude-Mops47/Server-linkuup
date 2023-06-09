import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: {
      type: Date,
    },
    name: {
      type: String,
    },
    phone: {
      type: Array,
    },
    address: {
      type: String,
    },
    commercial: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AppointmentSchema.virtual("posted_by", {
  ref: "user",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

AppointmentSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "appointmentId",
  justOne: false,
});

export default mongoose.model("appointment", AppointmentSchema);
