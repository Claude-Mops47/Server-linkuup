// import mongoose from "mongoose";
// const AppointmentSchema = new mongoose.Schema({
//     UserId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"user",
//         required:true
//     },
//     dateProg:{
//         type:String
//     },
//     name:{
//         type:String,
//     },
//     phone:{
//         type:Array
//     },
//     address:{
//         type:String
//     },
//     commercial:{
//         type:String
//     },
//     createdAt:{
//         type:Date,
//         default: new Date()
//     }
// },
// {
//     toJSON:{virtuals:true},
//     toObject:{virtuals:true}
// }
// );
// AppointmentSchema.pre('save', async function(){
   
// })
// AppointmentSchema.virtual('posted_by',{
//     ref:'user',
//     localField:"UserId",
//     foreignField:"_id",
//     justOne:true
// })
// AppointmentSchema.virtual('comments',{
//     ref:'comment',
//     localField:"_id",
//     foreignField:"AppointmentId",
//     justOne:false
// })
// export default mongoose.model('appointment', AppointmentSchema)

import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  dateProg: {
    type: String,
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
    default: new Date(),
  },
});

AppointmentSchema.pre("save", async function() {
  // Do something before saving the appointment
  let date_info = new Date();
  let date_into =
    date_info.getDate() +
    "/" +
    (date_info.getMonth() + 1) +
    "/" +
    date_info.getFullYear();
  this.createdAt = await date_into;
});

AppointmentSchema.virtual("posted_by", {
  ref: "user",
  localField: "UserId",
  foreignField: "_id",
  justOne: true,
});

AppointmentSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "AppointmentId",
  justOne: false,
});

export default mongoose.model("appointment", AppointmentSchema);
