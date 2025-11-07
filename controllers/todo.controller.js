const Todo = require("../models/Todo");

// GET UI + Todos
// GET UI + Todos
// GET UI + Todos
exports.renderTodos = async (req, res) => {
  try {
    const filter = req.query.filter;
    const sort = req.query.sort;
    const search = req.query.search;

    const page = parseInt(req.query.page) || 1; // ✅ new
    const limit = 5; // ✅ show 5 per page

    let query = {};
    let sortOption = { createdAt: -1 };

    // ✅ Filter
    if (filter === "completed") query.completed = true;
    if (filter === "pending") query.completed = false;
    if (filter === "high") query.priority = "High";

    // ✅ Search
    if (search) query.text = { $regex: search, $options: "i" };

    // ✅ Sorting
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "priority") sortOption = { priority: -1 };
    if (sort === "due") sortOption = { dueDate: 1 };

    const todos = await Todo.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)   // ✅ new
      .limit(limit);              // ✅ new

    const total = await Todo.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render("index", {
      todos,
      req,
      page,
      totalPages
    });

  } catch (err) {
    res.status(500).send("Server Error");
  }
};



// POST Create Todo
exports.createTodo = async (req, res) => {
  try {
    const text = req.body.text.trim();
    const dueDate = req.body.dueDate || null;
    const priority = req.body.priority || "Low";

    // Validation
    if (!text || text === "") return res.redirect("/?error=empty");
    if (text.length < 3) return res.redirect("/?error=short");
    if (text.length > 50) return res.redirect("/?error=long");

    await Todo.create({ text, dueDate, priority });
    res.redirect("/");
  } catch (err) {
    res.status(400).send("Invalid Data");
  }
};

// PUT / Toggle Todo
exports.toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect("/");
  } catch (err) {
    res.status(404).send("Not Found");
  }
};

// UPDATE Todo
exports.updateTodo = async (req, res) => {
  try {
    const text = req.body.text.trim();
    const dueDate = req.body.dueDate || null;
    const priority = req.body.priority || "Low";

    // Validation
    if (!text || text === "") return res.redirect("/?error=empty");
    if (text.length < 3) return res.redirect("/?error=short");
    if (text.length > 50) return res.redirect("/?error=long");

    await Todo.findByIdAndUpdate(req.params.id, { text, dueDate, priority });
    res.redirect("/");
  } catch (err) {
    res.status(400).send("Unable to update");
  }
};

// DELETE Todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(404).send("Not Found");
  }
};
