import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:4000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Fetch all tasks on mount ──────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks. Is the backend running?");
    }
  };

  // ── Add a new task ────────────────────────────────────────
  const addTask = async () => {
    if (!text.trim()) return setError("Task cannot be empty!");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/add`, { text });
      setTasks([res.data, ...tasks]);   // prepend newest task
      setText("");
    } catch (err) {
      setError("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete a task ─────────────────────────────────────────
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  // ── Toggle completed ──────────────────────────────────────
  const toggleTask = async (id) => {
    try {
      const res = await axios.patch(`${API}/tasks/${id}`);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  // ── Submit on Enter key ───────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  const pending = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="card">
        {/* Header */}
        <div className="header">
          <h1>📝 MERN To-Do</h1>
          <span className="badge">{pending} pending</span>
        </div>

        {/* Input */}
        <div className="input-row">
          <input
            type="text"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={addTask} disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="error">⚠️ {error}</p>}

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above!</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className={`task-item ${task.completed ? "done" : ""}`}>
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                />
                {/* Task Text */}
                <span className="task-text">{task.text}</span>
                {/* Delete Button */}
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="footer">
          <span>{tasks.length} total tasks</span>
          <span>{tasks.filter((t) => t.completed).length} completed</span>
        </div>
      </div>
    </div>
  );
}

export default App;
