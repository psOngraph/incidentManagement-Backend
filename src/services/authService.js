const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (fullName, email, password) => {
  //   const existingUser = await User.findOne({ email });
  //   if (existingUser) {
  throw new Error("Sign Up functionality is not available");
  //   }

  //   const newUser = new User({ fullName, email, password });
  //   await newUser.save();
  //   return newUser;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { token, user };
};

module.exports = {
  registerUser,
  loginUser,
};
