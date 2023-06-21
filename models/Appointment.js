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
    comment: {
      type: String,
    },
    status: {
      type: String,
    },
    version: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AppointmentSchema.pre("save", function (next) {
  this.version += 1;
  next();
});

AppointmentSchema.virtual("posted_by", {
  ref: "user",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});


export default mongoose.model("appointment", AppointmentSchema);
