import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      enum:['pending', 'confirmed','completed'], default:'pending'
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

appointmentSchema.pre("save", function (next) {
  this.version += 1;
  next();
});

appointmentSchema.virtual("posted_by", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});


export default mongoose.model("Appointment", appointmentSchema);
