import { FaBell } from 'react-icons/fa';

export default function NotificationModal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '450px', textAlign: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <FaBell size={40} style={{ marginBottom: '8px', color: '#3b82f6' }} />
        <h3 style={{ marginBottom: '8px' }}>New Notification</h3>
        <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
          {message}
        </p>
        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ marginTop: '20px' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}