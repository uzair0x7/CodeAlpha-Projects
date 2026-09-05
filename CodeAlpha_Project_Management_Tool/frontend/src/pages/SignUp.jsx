import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaProjectDiagram, FaSpinner } from "react-icons/fa";

export default function Signup({ navigate }) {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex-center"
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: "420px", width: "100%", padding: "40px 32px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <FaProjectDiagram size="2.4rem" color="#3b82f6" />
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>FlowBoard</h1>
          <p style={{ color: "var(--text-secondary)" }}>Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{ display: "block", fontWeight: 500, marginBottom: "6px" }}
            >
              Username
            </label>
            <input
              className="input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{ display: "block", fontWeight: 500, marginBottom: "6px" }}
            >
              Email
            </label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{ display: "block", fontWeight: 500, marginBottom: "6px" }}
            >
              Password
            </label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (min 6 chars)"
              minLength="6"
              required
            />
          </div>
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading}
            style={{ padding: "12px", fontSize: "1rem" }}
          >
            {loading ? (
              <span>
                <FaSpinner className="spin" style={{ marginRight: "8px" }} />{" "}
                Creating...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            style={{ color: "#3b82f6", fontWeight: 500 }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
