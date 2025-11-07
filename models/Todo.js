// models/Todo.js
const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Todo must be at least 3 characters"],
      maxLength: [50, "Todo must be less than 50 characters"]
    },

    completed: {
      type: Boolean,
      default: false
    },

    dueDate: {
      type: Date,
      required: false
    },

    // ✅ new feature
    priority: {
      type: String,
      default: "Low",
      enum: ["Low", "Medium", "High"]
    },

    // ✅ new feature
    category: {
      type: String,
      default: "Home",
      enum: ["Work", "Home", "Important"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", TodoSchema);
