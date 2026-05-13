const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ─── Task Schema & Model ──────────────────────────────────
const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Task text is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }   // adds createdAt & updatedAt automatically
);

const Task = mongoose.model("Task", taskSchema);

// ─── Routes ───────────────────────────────────────────────

// POST /add  → Create a new task
app.post("/add", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Task text cannot be empty" });
    }

    const newTask = new Task({ text });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// GET /tasks → Get all tasks (newest first)
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// DELETE /tasks/:id → Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// PATCH /tasks/:id → Toggle completed status
app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));