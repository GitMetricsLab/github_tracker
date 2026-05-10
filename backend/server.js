const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

// Passport configuration
require("./config/passportConfig");

const app = express();

// CORS configuration
//Ok so this needs to be taken care of, Cannot expose the BE like that, only FE can call it, else you'll face issues
// For testing, if anyone else uses any other port, pls change the default vite port to that port, and also change the FRONTEND_URL in .env to that port, else you'll face CORS issues, and you won't be able to call the BE from the FE.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
