// import mongoose from "mongoose";
// import validator from "validator";
// import bcryptjs from 'bcryptjs'
// import jwt from 'jsonwebtoken'

// const UserShema = new mongoose.Schema({
//     firstName:{
//         type:String,
//         required:[true,'Please provide first name'],
//         trim:true
//     }, 
//     lastName:{
//         type:String,
//         required:[true,'Please provide last name'],
//         index:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true,
//         validate:{
//             validator:validator.isEmail,
//             message:'Please provide a valide email adress'
//         }
//     },
//     role:{
//         type:String,
//         required:true
//     },
//     password:{
//         type:String,
//         required:[true,'Please provide password'],
//         minlength:6,
//         select:false
//     },
//     created_at:{
//         type:String
//     }

// },{
//     toJSON:{virtuals:true} ,
//     toObject:{virtuals:true}
//  }
// );
// UserShema.pre('save',async function(){
//     const salt = await bcryptjs.genSalt(10)
//     this.password = await bcryptjs.hash(this.password,salt)
    
//     const date_info = new Date();
//     const date_into =date_info.getDate() + '/' + (date_info.getMonth()+1)+'/'+date_info.getFullYear()
//     this.created_at = await date_into
// })
// UserShema.methods.comparePassword = async function(candidate){
//     const isMatch = await bcryptjs.compare(candidate,this.password)
//     return isMatch
// }
// UserShema.methods.createJWT = function(){
//     return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
// }

// UserShema.virtual('appointments',{
//     ref:'appointment',
//     localField:'_id',
//     foreignField:'UserId',
//     justOne:false
// })

// export default mongoose.model('User',UserShema)


import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
firstName: {
type: String,
required: [true, "Please provide first name"],
index: true
},
lastName: {
type: String,
required: [true, "Please provide last name"],
index: true
},
email: {
type: String,
required: true,
unique: true,
validate: {
validator: validator.isEmail,
message: "Please provide a valid email address"
}
},
role: {
type: String,
required: true
},
password: {
type: String,
required: [true, "Please provide password"],
minlength: 6,
select: false
},
createdAt: {
type: Date,
default: new Date()
}

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

UserSchema.pre("save", async function() {
const salt = await bcryptjs.genSalt(10);
this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.createJWT = function() {
return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
};

UserSchema.methods.comparePassword = async function(candidate) {
const isMatch = await bcryptjs.compare(candidate, this.password);
return isMatch;
};


UserSchema.virtual("Appointments", {
ref: "appointment",
localField: "_id",
foreignField: "UserId",
justOne: false
});

export default mongoose.model("user", UserSchema);