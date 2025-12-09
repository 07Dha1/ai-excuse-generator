// frontend/src/pages/LoginPage.js
import React, { useState } from "react";
import FullScreenLoader from "../components/FullScreenLoader";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);   // loader state
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);                              // show loader

    try {
      const { data } = await API.post("/auth/login", { email, password });

      localStorage.setItem("excuse_token", data.token);
      localStorage.setItem("excuse_user", JSON.stringify(data));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);                           // hide loader
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}            {/* loader overlay */}

      <div className="auth-page">
        <div className="auth-card">
          <h1>🧠 AI Excuse Generator</h1>
          <h2>Login</h2>
          <p className="auth-subtitle">
            Sign in to manage your excuses dashboard.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={submitHandler} className="auth-form">
            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
