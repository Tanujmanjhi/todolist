const Todo = require("../models/Todo");

// GET UI + Todos
exports.renderTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // tasks per page
    const skip = (page - 1) * limit;

    // Build query based on filters
    let query = {};

    if (req.query.filter) {
      switch (req.query.filter) {
        case "completed":
          query.completed = true;
          break;
        case "pending":
          query.completed = false;
          break;
        case "high":
          query.priority = "High";
          break;
      }
    }

    // Search
    if (req.query.search) {
      query.text = { $regex: req.query.search, $options: "i" };
    }

    // Count total for pagination
    const total = await Todo.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Fetch todos
    let todos = await Todo.find(query)
      .sort(getSortOption(req.query.sort))
      .skip(skip)
      .limit(limit);

    // Completed count
    const completed = await Todo.countDocuments({ ...query, completed: true });

    res.render("index", {
      todos,
      total,
      completed,
      page,
      totalPages,
      req
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Helper function
function getSortOption(sort) {
  switch (sort) {
    case "newest":
      return { createdAt: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "priority":
      return { priority: -1 };
    case "due":
      return { dueDate: 1 };
    default:
      return { createdAt: -1 };
  }
}
