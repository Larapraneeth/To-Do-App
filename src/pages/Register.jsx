import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/api/auth/register", form);
      navigate("/login");
    } catch {
      setError("Email already exists");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={onSubmit} className="shadow p-4 bg-white rounded" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-success w-100">Register</button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
