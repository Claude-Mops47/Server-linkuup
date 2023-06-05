import User from "../models/User.js";

// add-user
const addUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate the input.
    if (!firstName || !lastName || !email || !role || !password) {
      res.status(400).json({ message: "Pease provide all required fiels." });
      return;
    }
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
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isCorrect = await user.comparePassword(password);

    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.createJWT();
    user.password = undefined;
    res.cookie("jwt", token, { maxAge: 3600000 });

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

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

// getUserById
const getUserById = async (req, res) => {
  try {
    // const userId = parseInt(req.params.id)
    const user = await User.findById(req.params.id);
    res.status(200).json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    if (error.code === 404) {
      res.status(404).json({
        message: "User not found",
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
      res.status(200).json({message:"User update successfully"});
    } else {
      res.status(404).json({ message: "User not found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserById = async (req, res)=>{
  try {
    const userId = req.params.id;

    const deleteUser = await User.findByIdAndDelete(userId)

    if(deleteUser){
      res.status(200).json({message:"User delete successfully"})
    }
    else{
      res.status(404).json({message: "User not found"})
    }
  } catch (error) {
    res.status(500).json({message:"Server error"})
    
  }
}

export { addUser, login, getAllUsers, getUserById, updateUserById, deleteUserById };
