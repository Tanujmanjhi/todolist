// src/controllers/todoController.js
const Todo = require("../models/Todo");

// GET UI + Todos
exports.renderTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.render("index", { todos });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// POST Create Todo
exports.createTodo = async (req, res) => {
  try {
    await Todo.create({ text: req.body.text });
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

// DELETE Todo
exports.deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.status(404).send("Not Found");
  }
};
