import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { apiFetch } from "../api";
import TaskCard from "../components/TaskCard";
import {
  FaPlus,
  FaArrowLeft,
  FaUsers,
  FaUserMinus,
  FaUserPlus,
} from "react-icons/fa";

const COLUMNS = ["Todo", "In Progress", "Done"];

export default function Board({ projectId, navigate }) {
  const { user } = useAuth();
  const socket = useSocket();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    dueDate: "",
    assignee: "",
  });
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignee: "",
  });

  const [statusChangeTaskId, setStatusChangeTaskId] = useState(null);
  const [statusChangeNewStatus, setStatusChangeNewStatus] = useState("Todo");

  useEffect(() => {
    fetchBoard();
    if (socket) {
      socket.emit("join-project", projectId);
      socket.on("task-updated", (data) => {
        if (data.projectId === projectId) fetchBoard();
      });
      return () => {
        socket.emit("leave-project", projectId);
        socket.off("task-updated");
      };
    }
  }, [projectId, socket]);

  const fetchBoard = async () => {
    try {
      const data = await apiFetch(`/projects/${projectId}`);
      setProject(data.project);
      setTasks(data.tasks || []);
      setMembers(data.project.members || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user._id === project?.owner?._id;

  const handleAddMember = async () => {
    if (!memberEmail.trim()) return alert("Please enter an email");
    setAddingMember(true);
    try {
      await apiFetch(`/members/${projectId}`, {
        method: "POST",
        body: { email: memberEmail },
      });
      setMemberEmail("");
      fetchBoard();
      alert("Member added successfully");
    } catch (e) {
      alert(e.message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await apiFetch(`/members/${projectId}/${memberToRemove}`, {
        method: "DELETE",
      });
      fetchBoard();
    } catch (e) {
      alert(e.message);
    } finally {
      setMemberToRemove(null);
    }
  };

  const openStatusChangeModal = (taskId, currentStatus) => {
    setStatusChangeTaskId(taskId);
    setStatusChangeNewStatus(currentStatus);
  };

  const handleStatusChange = async () => {
    if (!statusChangeTaskId) return;
    try {
      await apiFetch(`/tasks/${statusChangeTaskId}/move`, {
        method: "PATCH",
        body: { status: statusChangeNewStatus },
      });
      if (socket) {
        socket.emit("task-updated", {
          taskId: statusChangeTaskId,
          projectId,
          userId: user._id,
        });
      }
      setStatusChangeTaskId(null);
      fetchBoard();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return alert("Title required");
    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: { ...newTask, projectId, assignee: newTask.assignee || null },
      });
      setShowAddTask(false);
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        assignee: "",
      });
      fetchBoard();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEditTask = async () => {
    if (!editTaskData.title.trim()) return alert("Title required");
    try {
      await apiFetch(`/tasks/${editingTask}`, {
        method: "PUT",
        body: editTaskData,
      });
      if (socket) {
        socket.emit("task-updated", {
          taskId: editingTask,
          projectId,
          userId: user._id,
        });
      }
      setEditingTask(null);
      fetchBoard();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteClick = (taskId) => setTaskToDelete(taskId);
  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await apiFetch(`/tasks/${taskToDelete}`, { method: "DELETE" });
      fetchBoard();
    } catch (e) {
      alert(e.message);
    } finally {
      setTaskToDelete(null);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task._id);
    setEditTaskData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assignee: task.assignee?._id || "",
    });
  };

  if (loading)
    return (
      <div className="flex-center" style={{ height: "80vh" }}>
        <div className="loader"></div>
      </div>
    );

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div style={{ padding: "24px" }}>
      <div className="flex-between" style={{ marginBottom: "20px" }}>
        <div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft /> Back
          </button>
          <h1 style={{ marginTop: "8px" }}>{project?.name}</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {project?.description}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setShowMembersModal(true)}
          >
            <FaUsers /> Members ({members.length})
          </button>
          {isOwner && (
            <button
              className="btn btn-primary"
              onClick={() => setShowAddTask(true)}
            >
              <FaPlus /> Add Task
            </button>
          )}
        </div>
      </div>

      <div
        className="board-columns"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        {COLUMNS.map((status) => (
          <div
            key={status}
            className="card"
            style={{ padding: "16px", minHeight: "300px" }}
          >
            <h3
              style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {status}
              <span
                className="badge"
                style={{ background: "var(--border-color)" }}
              >
                {tasks.filter((t) => t.status === status).length}
              </span>
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    members={members}
                    onStatusChange={() =>
                      openStatusChangeModal(task._id, task.status)
                    }
                    onDelete={() => handleDeleteClick(task._id)}
                    onEdit={() => openEditModal(task)}
                    isOwner={isOwner}
                    onClick={() => navigate(`/task/${task._id}`)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div
            className="modal-content"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            <h2>New Task</h2>
            <input
              className="input-field"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              style={{ marginTop: "16px" }}
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            />
            <textarea
              className="input-field"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              style={{ marginTop: "12px" }}
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <select
                className="input-field"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                className="input-field"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              />
            </div>
            <select
              className="input-field"
              style={{ marginTop: "12px" }}
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.username}
                </option>
              ))}
            </select>
            <div className="flex gap-2" style={{ marginTop: "20px" }}>
              <button
                className="btn btn-primary"
                onClick={handleAddTask}
                onMouseDown={stopPropagation}
              >
                Create
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddTask(false)}
                onMouseDown={stopPropagation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div
            className="modal-content"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            <h2>Edit Task</h2>
            <input
              className="input-field"
              placeholder="Title"
              value={editTaskData.title}
              onChange={(e) =>
                setEditTaskData({ ...editTaskData, title: e.target.value })
              }
              style={{ marginTop: "16px" }}
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            />
            <textarea
              className="input-field"
              placeholder="Description"
              value={editTaskData.description}
              onChange={(e) =>
                setEditTaskData({
                  ...editTaskData,
                  description: e.target.value,
                })
              }
              style={{ marginTop: "12px" }}
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <select
                className="input-field"
                value={editTaskData.status}
                onChange={(e) =>
                  setEditTaskData({ ...editTaskData, status: e.target.value })
                }
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <select
                className="input-field"
                value={editTaskData.priority}
                onChange={(e) =>
                  setEditTaskData({ ...editTaskData, priority: e.target.value })
                }
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <input
              className="input-field"
              type="date"
              value={editTaskData.dueDate}
              onChange={(e) =>
                setEditTaskData({ ...editTaskData, dueDate: e.target.value })
              }
              style={{ marginTop: "12px" }}
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            />
            <select
              className="input-field"
              style={{ marginTop: "12px" }}
              value={editTaskData.assignee}
              onChange={(e) =>
                setEditTaskData({ ...editTaskData, assignee: e.target.value })
              }
              onMouseDown={stopPropagation}
              onClick={stopPropagation}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.username}
                </option>
              ))}
            </select>
            <div className="flex gap-2" style={{ marginTop: "20px" }}>
              <button
                className="btn btn-primary"
                onClick={handleEditTask}
                onMouseDown={stopPropagation}
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingTask(null)}
                onMouseDown={stopPropagation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {statusChangeTaskId && (
        <div
          className="modal-overlay"
          onClick={() => setStatusChangeTaskId(null)}
        >
          <div
            className="modal-content"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            <h2>Change Task Status</h2>
            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Select new status:
              </label>
              <select
                className="input-field"
                value={statusChangeNewStatus}
                onChange={(e) => setStatusChangeNewStatus(e.target.value)}
                onMouseDown={stopPropagation}
                onClick={stopPropagation}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="flex gap-2" style={{ marginTop: "20px" }}>
              <button
                className="btn btn-primary"
                onClick={handleStatusChange}
                onMouseDown={stopPropagation}
              >
                Update Status
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setStatusChangeTaskId(null)}
                onMouseDown={stopPropagation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {taskToDelete && (
        <div className="modal-overlay" onClick={() => setTaskToDelete(null)}>
          <div
            className="modal-content"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            <h2>Delete Task</h2>
            <p style={{ marginTop: "12px" }}>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex gap-2" style={{ marginTop: "24px" }}>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
                onMouseDown={stopPropagation}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setTaskToDelete(null)}
                onMouseDown={stopPropagation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showMembersModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowMembersModal(false)}
        >
          <div
            className="modal-content"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            <h2>Project Members</h2>
            <div style={{ marginTop: "16px" }}>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {members.map((m) => (
                  <li
                    key={m._id}
                    className="flex-between"
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span>
                      {m.username} {m._id === project?.owner?._id && "(Owner)"}
                    </span>
                    {isOwner && m._id !== project?.owner?._id && (
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => setMemberToRemove(m._id)}
                        onMouseDown={stopPropagation}
                      >
                        <FaUserMinus /> Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {isOwner && (
              <div style={{ marginTop: "20px" }}>
                <h4>Add new member</h4>
                <div className="flex gap-2" style={{ marginTop: "8px" }}>
                  <input
                    className="input-field"
                    placeholder="Enter email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    onMouseDown={stopPropagation}
                    onClick={stopPropagation}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddMember}
                    disabled={addingMember}
                    onMouseDown={stopPropagation}
                  >
                    <FaUserPlus /> {addingMember ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-2" style={{ marginTop: "24px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowMembersModal(false)}
                onMouseDown={stopPropagation}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {memberToRemove && (
        <div className="modal-overlay" onClick={() => setMemberToRemove(null)}>
          <div
            className="modal-content"
            onMouseDown={stopPropagation}
            onClick={stopPropagation}
          >
            <h2>Remove Member</h2>
            <p style={{ marginTop: "12px" }}>
              Are you sure you want to remove this member from the project?
            </p>
            <div className="flex gap-2" style={{ marginTop: "24px" }}>
              <button
                className="btn btn-danger"
                onClick={handleRemoveMember}
                onMouseDown={stopPropagation}
              >
                Remove
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setMemberToRemove(null)}
                onMouseDown={stopPropagation}
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
