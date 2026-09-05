import React from "react";
import {
  getPriorityBadge,
  getStatusBadge,
  formatDateShort,
  getInitials,
} from "../utils/helpers";
import { FaEdit, FaTrash, FaCalendarAlt, FaArrowsAltH } from "react-icons/fa";

export default function TaskCard({
  task,
  members,
  onStatusChange,
  onDelete,
  onEdit,
  isOwner,
  onClick,
}) {
  const assignee = members.find((m) => m._id === task.assignee?._id);

  return (
    <div
      className="card"
      style={{ padding: "12px", cursor: "pointer", transition: "0.15s" }}
      onClick={onClick}
    >
      <div className="flex-between">
        <h4 style={{ marginBottom: "4px" }}>{task.title}</h4>
        {isOwner && (
          <div className="flex gap-1">
            <button
              className="btn btn-secondary btn-xs"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-danger btn-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          marginBottom: "8px",
        }}
      >
        {task.description?.slice(0, 60) || ""}
      </p>
      <div className="flex-between" style={{ fontSize: "0.75rem" }}>
        <div className="flex gap-1">
          <span className={`badge ${getPriorityBadge(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`badge ${getStatusBadge(task.status)}`}>
            {task.status}
          </span>
          {task.dueDate && (
            <span>
              <FaCalendarAlt /> {formatDateShort(task.dueDate)}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {assignee && (
            <span className="avatar avatar-xs">
              {getInitials(assignee.username)}
            </span>
          )}
        </div>
      </div>
      <button
        className="btn btn-secondary btn-xs"
        style={{ marginTop: "8px", width: "100%" }}
        onClick={(e) => {
          e.stopPropagation();
          onStatusChange();
        }}
      >
        <FaArrowsAltH /> Change Status
      </button>
    </div>
  );
}
