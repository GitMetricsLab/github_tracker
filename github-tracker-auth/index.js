const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const users = []; // Temporary in-memory storage

// 🔑 Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // check if user exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: "User registered successfully 🚀" });
});

// 🔑 Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // generate token
  const token = jwt.sign({ username }, "secretKey123", { expiresIn: "1h" });
  res.json({ message: "Login successful 🎉", token });
});

// Protected route
app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secretKey123", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    res.json({ message: `Welcome ${decoded.username} 🎉`, user: decoded });
  });
});

app.listen(3000, () => console.log("Server is running 🚀"));
