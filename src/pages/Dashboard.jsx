import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  const fetchTasks = useCallback(async () => {
    const res = await axios.get("http://localhost:5002/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  }, [token]);

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post(
      "http://localhost:5002/api/tasks",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchTasks();
  };

  useEffect(() => {
    const load = async () => await fetchTasks();
    load();
  }, [fetchTasks]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const filtered = tasks.filter((t) => {
    const s = t.title.toLowerCase().includes(search.toLowerCase());
    const f =
      filter === "completed"
        ? t.completed
        : filter === "pending"
        ? !t.completed
        : true;

    return s && f;
  });

  return (
    <div className="dash-container">

      {/* Top Bar */}
      <div className="dash-navbar">
        <div className="dash-brand">
          <div className="logo-circle"></div>
          <span>Task Management System</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="dash-header">
        <h1>Task Manager</h1>
        <p>Stay organized and achieve your goals</p>
      </div>

      {/* Input Section */}
      <div className="dash-input-row">

        {/* Add Task */}
        <input
          className="task-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="add-btn" onClick={addTask}>+ Add</button>

        {/* Search */}
        <input
          className="task-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter */}
        <select
          className="task-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

      </div>

      {/* Task List */}
      <div className="task-list-container">
        {filtered.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon">✔</div>
            <h3>No tasks yet</h3>
            <p>Start being productive by adding your first task above</p>
          </div>
        ) : (
          filtered.map((task) => (
            <div className="task-item" key={task._id}>
              <div className="left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={async () => {
                    await axios.put(
                      `http://localhost:5002/api/tasks/toggle/${task._id}`,
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    fetchTasks();
                  }}
                />
                <span className={task.completed ? "task-completed" : ""}>
                  {task.title}
                </span>
              </div>
              <button
                className="delete-btn"
                onClick={async () => {
                  await axios.delete(
                    `http://localhost:5002/api/tasks/${task._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  fetchTasks();
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
