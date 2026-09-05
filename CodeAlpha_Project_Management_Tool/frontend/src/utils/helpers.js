export function getStatusBadge(status) {
  const map = { 'Todo': 'badge-todo', 'In Progress': 'badge-progress', 'Done': 'badge-done' };
  return map[status] || 'badge-todo';
}

export function getPriorityBadge(priority) {
  const map = { 'Low': 'badge-low', 'Medium': 'badge-medium', 'High': 'badge-high' };
  return map[priority] || 'badge-low';
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}