const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateToken } = require("../middlewares/authMiddleware");
const saltRounds = 10;
// Register route
async function register(req, res) {
  const { email, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword, // In a real application, you should hash the password securely
      },
    });

    const token = await generateToken(newUser);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Login route
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // Check if user exists and verify hashed password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate and send JWT token
    const token = await generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function protectedRoute(req, res) {
  res.json({ message: "Protected Route", user: req.user });
}

module.exports = {
  register,
  login,
  protectedRoute,
};
