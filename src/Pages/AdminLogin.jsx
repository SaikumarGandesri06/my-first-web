import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API = "https://my-first-web-backend.onrender.com";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        navigate("/family");
      } else {
        setError("Wrong username or password");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      {/* BACKGROUND CIRCLES */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      <div className="login-card">
        {/* ICON */}
        <div className="login-icon">👑</div>

        <h1 className="login-title">Admin Portal</h1>
        <p className="login-subtitle">Gandesri Family Management</p>

        {error && <div className="error-box">{error}</div>}

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/family")}
        >
          ← Back to Family Page
        </button>
      </div>
    </div>
  );
}