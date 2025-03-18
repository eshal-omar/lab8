const express = require("express");
const app = express();
app.use(express.json());

// Sample Routes
app.post("/api/auth/register", (req, res) => {
  res.status(200).json({ message: "User registered successfully" });
});

app.post("/api/auth/login", (req, res) => {
  res.status(200).json({ token: "fake-jwt-token" });
});

app.post("/api/events", (req, res) => {
  res.status(200).json({ name: req.body.name, message: "Event created" });
});

app.get("/api/events", (req, res) => {
  res.status(200).json([{ name: "Meeting", date: "2025-04-01" }]);
});


module.exports = app;


if (require.main === module) {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
