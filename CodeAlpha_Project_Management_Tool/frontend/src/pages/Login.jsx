import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaProjectDiagram, FaSpinner } from "react-icons/fa";

export default function Login({ navigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
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
          <p style={{ color: "var(--text-secondary)" }}>
            Sign in to your account
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
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
              placeholder="••••••••"
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
                Signing in...
              </span>
            ) : (
              "Sign In"
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
          Don’t have an account?{" "}
          <p
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
            style={{ color: "#3b82f6", fontWeight: 500 }}
          >
            Sign up
          </p>
        </p>
      </div>
    </div>
  );
}
