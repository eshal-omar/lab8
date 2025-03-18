const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

let users = [];
let events = [];

// Default route to check if server is running
app.get("/", (req, res) => {
  res.send("Welcome to the Event Planner API! 🎉");
});

// Middleware for Authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// User Registration
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(newUser);
  res.json({ message: "User registered successfully" });
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Create Event
app.post("/api/events", authMiddleware, (req, res) => {
  const event = { id: events.length + 1, ...req.body, userId: req.user.userId };
  events.push(event);
  res.json(event);
});

// View All Events for Logged-in User
app.get("/api/events", authMiddleware, (req, res) => {
  const userEvents = events.filter((event) => event.userId === req.user.userId);
  res.json(userEvents);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
