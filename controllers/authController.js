import User from "../models/User.js";
import { ObjectId } from "mongoose";
import Boom from "@hapi/boom";
import Joi from "joi";
import jwt from "jsonwebtoken";

const addUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("User", "Admin", "Manager").required(),
});

// add-user
const addUser = async (req, res) => {
  try {
    const { error } = addUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { firstName, lastName, email, password, role } = req.body;
    // Check if the email address already exists.
    const existingUser = await User.findOne({ email });
    // If the email address already exists, return an error.
    if (existingUser) {
      res.status(400).json({ message: "Email address already exists." });
      return;
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    const token = user.createJWT();
    user.password = undefined;

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};
// login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all values" });
  }
  try {
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.userId = user._id.toString();

    const token = user.createJWT();
    const refresh = user.refreshJWT();

    user.password = undefined;

    res.cookie('authUser', user,{httpOnly: true})
    res.cookie('authToken', token,{httpOnly: true})
    res.cookie('refreshToken', refresh,{httpOnly: true})

    res.status(200).json({ user, token , refresh});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
}; 

// logout
const logout = async (req,res)=>{
  res.clearCookie('authToken');
  res.clearCookie('refreshToken');
  res.json({message:'Déconnexion réussie'})
}
// refres token
const refreshAccessToken = (req,res)=>{
  // const refreshToken = req.cookie.refreshToken;
  const refreshToken = req.headers["x-refresh-token"];

  if(!refreshToken){
    return res.status(403).json({message: 'Refresh token missing'})
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user)=>{
    if(err){
      return res.status(403).json({message:'Invalid refresh token'})
    }
    const token = user.createJWT();
    res.json({ token })
    console.log(token);
  })
}
// getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec();

    if (users.length === 0) {
      return res.status(204).end();
    }
    const userArray = users.map((user) => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }));

    res.status(200).json(userArray);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserByIdSchema = Joi.object({
  id: Joi.string().required(),
}).unknown();

const getUserById = async (req, res) => {
  try {
    const { error, value } = getUserByIdSchema.validate(req.params);
    if (error) {
      throw Boom.badRequest(error.message);
    } 
    const user = await User.findById(value.id);
    if (!user) {
      throw Boom.notFound("User not found");
    }
    if (
      req.session.user.role !== "Admin" &&
      req.session.user._id !== user._id.toString()
    ) {
      throw Boom.forbidden("You are not authorized to access this resource");
    }
    res.status(200).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (err) {
    if (err.isBoom) {
      res.status(err.output.statusCode).json({
        message: err.output.payload.message,
      });
    } else {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
};
// PUT UserById
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (updateUser) {
      res.status(200).json({ message: "User update successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUser = await User.findByIdAndDelete(userId);
    if (deleteUser) {
      res.status(200).json({ message: "User delete successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addUser,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getCurrentUser,
  refreshAccessToken,
};
