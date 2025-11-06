// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// DB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.use(expressLayouts); // ✅ Add this
app.set("layout", "layout"); // ✅ Set default layout

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Routes
app.use("/", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
