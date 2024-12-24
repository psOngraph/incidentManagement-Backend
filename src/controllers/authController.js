const { registerUser, loginUser } = require("../services/authService");

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await registerUser(fullName, email, password);
    res.status(201).json({ message: "User registered successfully.", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.status(200).json({ message: "Login successful.", token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login };
