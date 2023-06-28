
import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      index: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: props =>`${props.value} is not a valid email address`
      },
    },
    role: {
      type: String,
      required: true,
      enum:['Admin','User','Manager']
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  }); 
};

userSchema.methods.comparePassword = async function (candidate) {
  const isMatch = await bcryptjs.compare(candidate, this.password);
  return isMatch;
};

userSchema.virtual("appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

export default mongoose.model("User", userSchema);
