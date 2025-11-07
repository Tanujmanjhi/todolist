const express = require("express");
const router = express.Router();
const controller = require("../controllers/todo.controller");

// Render all todos
router.get("/", controller.renderTodos);

// Create a new todo
router.post("/add", controller.createTodo);

// Update text of a todo
router.put("/update/:id", controller.updateTodo);

// Toggle completed status
router.put("/toggle/:id", controller.toggleTodo);

// Delete a todo
router.delete("/delete/:id", controller.deleteTodo);

module.exports = router;
