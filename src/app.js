const express = require("express");
const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api", userRoutes);
app.use("/api", postRoutes);

module.exports = app;
