// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const Todo = require("./models/Todo");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("layout", "layout");

// ✅ Home Route With Pagination, Search, Sort, Filters
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  const filter = {};
  const sort = {};

  // ✅ Filtering
  if (req.query.filter === "completed") filter.completed = true;
  if (req.query.filter === "pending") filter.completed = false;
  if (req.query.filter === "high") filter.priority = "High";

  // ✅ Searching
  if (req.query.search) {
    filter.text = { $regex: req.query.search, $options: "i" };
  }

  // ✅ Sorting
  if (req.query.sort === "newest") sort.createdAt = -1;
  if (req.query.sort === "oldest") sort.createdAt = 1;
  if (req.query.sort === "priority") sort.priority = 1;
  if (req.query.sort === "due") sort.dueDate = 1;

  const total = await Todo.countDocuments(filter);
  const completed = await Todo.countDocuments({ completed: true });

  const todos = await Todo.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  res.render("index", {
    todos,
    page,
    totalPages,
    total,
    completed,
    req
  });
});

// ✅ Add Todo
app.post("/add", async (req, res) => {
  try {
    const text = req.body.text.trim();
    const dueDate = req.body.dueDate || null;
    const priority = req.body.priority || "Low";
    const category = req.body.category || "Home";

    if (!text) return res.redirect("/?error=empty");
    if (text.length < 3) return res.redirect("/?error=short");
    if (text.length > 50) return res.redirect("/?error=long");

    await Todo.create({ text, dueDate, priority, category });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// ✅ Toggle
app.put("/toggle/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.redirect("/");
});

// ✅ Delete
app.delete("/delete/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// ✅ Update
app.put("/update/:id", async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, { text: req.body.text });
  res.redirect("/");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
