import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";

import { FaPlus, FaSignOutAlt, FaUser, FaCalendarAlt } from "react-icons/fa";
import "../styles/global.css";

export default function Dashboard({ navigate }) {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await apiFetch("/projects");
      setProjects(data.projects || []);
    } catch (e) {
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return alert("Project name required");
    try {
      const data = await apiFetch("/projects", {
        method: "POST",
        body: { name: newName, description: newDesc },
      });
      setProjects([...projects, data.project]);
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    } catch (e) {
      alert(e.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-content" style={{ padding: "24px" }}>
      <div className="flex-between" style={{ marginBottom: "24px" }}>
        <h1>Welcome, {user.username}</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
          >
            <FaPlus /> New Project
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: "200px" }}>
          <div className="loader"></div>
        </div>
      ) : (
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          {projects.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{ padding: "20px", cursor: "pointer" }}
              onClick={() => navigate(`/project/${p._id}`)}
            >
              <h3 style={{ marginBottom: "6px" }}>{p.name}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {p.description || "No description"}
              </p>
              <div
                className="flex gap-1"
                style={{
                  marginTop: "12px",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <span>
                  <FaUser /> {p.members?.length || 0} members
                </span>
                <span>
                  <FaCalendarAlt /> {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Project</h2>
            <input
              className="input-field"
              placeholder="Project name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ marginTop: "16px" }}
            />
            <textarea
              className="input-field"
              placeholder="Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              style={{ marginTop: "12px" }}
            />
            <div className="flex gap-2" style={{ marginTop: "20px" }}>
              <button className="btn btn-primary" onClick={handleCreate}>
                Create
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
