import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { apiFetch } from "../api";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getStatusBadge, getPriorityBadge, formatDate } from "../utils/helpers";

export default function TaskDetail({ taskId, navigate }) {
  const { user } = useAuth();
  const socket = useSocket();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    fetchDetail();
    if (socket) {
      socket.on("new-comment", (data) => {
        if (data.taskId === taskId) {
          fetchDetail();
        }
      });
      return () => socket.off("new-comment");
    }
  }, [taskId, socket]);

  const fetchDetail = async () => {
    try {
      const data = await apiFetch(`/tasks/${taskId}`);
      setTask(data.task);
      setComments(data.comments || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await apiFetch("/comments", {
        method: "POST",
        body: { text: newComment, taskId },
      });
      if (socket) {
        socket.emit("new-comment", {
          taskId,
          projectId: task.project._id,
          comment: newComment,
        });
      }
      setNewComment("");
      fetchDetail();
    } catch (e) {
      alert(e.message);
    }
  };

  const openEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.text);
  };

  const handleEditComment = async () => {
    if (!editCommentText.trim()) return alert("Comment text is required");
    try {
      await apiFetch(`/comments/${editingCommentId}`, {
        method: "PUT",
        body: { text: editCommentText },
      });
      setEditingCommentId(null);
      fetchDetail();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingCommentId) return;
    try {
      await apiFetch(`/comments/${deletingCommentId}`, { method: "DELETE" });
      setDeletingCommentId(null);
      fetchDetail();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading)
    return (
      <div className="flex-center" style={{ height: "80vh" }}>
        <div className="loader"></div>
      </div>
    );
  if (!task) return <div>Task not found</div>;

  return (
    <div className="task-detail-content" style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(`/project/${task.project._id}`)}
      >
        <FaArrowLeft /> Back to Board
      </button>
      <div className="card" style={{ padding: "24px", marginTop: "16px" }}>
        <h2>{task.title}</h2>
        <div className="flex gap-2" style={{ margin: "12px 0" }}>
          <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span>
          <span className={`badge ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
          {task.dueDate && (
            <span>
              <FaCalendarAlt /> {formatDate(task.dueDate)}
            </span>
          )}
          <span>
            <FaUser /> {task.assignee?.username || "Unassigned"}
          </span>
        </div>
        <p style={{ whiteSpace: "pre-wrap" }}>{task.description || "No description"}</p>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "12px" }}>
          Created by {task.createdBy?.username} on {formatDate(task.createdAt)}
        </p>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>Comments</h3>
        <div style={{ marginTop: "12px" }}>
          {comments.map((c) => (
            <div key={c._id} className="card" style={{ padding: "12px", marginBottom: "10px" }}>
              <div className="flex-between">
                <strong>{c.author?.username}</strong>
                <div className="flex gap-1">
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {formatDate(c.createdAt)}
                  </span>
                  {c.author?._id === user._id && (
                    <>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => openEditComment(c)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => setDeletingCommentId(c._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2" style={{ marginTop: "16px" }}>
          <input
            className="input-field"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddComment}>
            Post
          </button>
        </div>
      </div>

      {editingCommentId && (
        <div className="modal-overlay" onClick={() => setEditingCommentId(null)}>
          <div
            className="modal-content"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit Comment</h2>
            <textarea
              className="input-field"
              placeholder="Edit your comment..."
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              style={{ marginTop: "16px", minHeight: "80px" }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2" style={{ marginTop: "20px" }}>
              <button
                className="btn btn-primary"
                onClick={handleEditComment}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingCommentId(null)}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingCommentId && (
        <div className="modal-overlay" onClick={() => setDeletingCommentId(null)}>
          <div
            className="modal-content"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Comment</h2>
            <p style={{ marginTop: "12px" }}>
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="flex gap-2" style={{ marginTop: "24px" }}>
              <button
                className="btn btn-danger"
                onClick={handleDeleteComment}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeletingCommentId(null)}
                onMouseDown={(e) => e.stopPropagation()}
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