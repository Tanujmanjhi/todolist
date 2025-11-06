// src/routes/todoRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/todoController");

router.get("/", controller.renderTodos);
router.post("/add", controller.createTodo);
router.get("/toggle/:id", controller.toggleTodo);
router.get("/delete/:id", controller.deleteTodo);

module.exports = router;
