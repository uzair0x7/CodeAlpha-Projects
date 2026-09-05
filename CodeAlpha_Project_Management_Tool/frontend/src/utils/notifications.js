const recentToasts = new Map();
const DEDUP_WINDOW = 3000;

export function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }
}

export function showBrowserNotification(title, body, options = {}) {
  if (!('Notification' in window)) {
    console.warn('Browser notifications not supported');
    return null;
  }
  if (Notification.permission !== 'granted') {

    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        showBrowserNotification(title, body, options);
      }
    });
    return null;
  }

  const tag = options.tag || `notif-${Date.now()}`;
  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico', 
      silent: false,        
      requireInteraction: true, 
      tag,
      ...options,
    });

    setTimeout(() => notification.close(), 30000);
    return notification;
  } catch (err) {
    console.error('Error showing notification:', err);
    return null;
  }
}

export function showToast(message, type = 'info', duration = 3000) {
  const key = `${message}|${type}`;
  const now = Date.now();
  const lastTime = recentToasts.get(key);
  if (lastTime && (now - lastTime) < DEDUP_WINDOW) {
    console.log(`Toast deduped (${key})`);
    return;
  }
  recentToasts.set(key, now);

  for (const [k, ts] of recentToasts) {
    if (now - ts > DEDUP_WINDOW * 2) {
      recentToasts.delete(k);
    }
  }

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colorMap = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };
  toast.className = `toast toast-${type}`;
  toast.style.borderLeftColor = colorMap[type] || '#3b82f6';
  toast.innerHTML = `<span>${message}</span><button class="toast-close">&times;</button>`;
  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
    if (container.children.length === 0) container.remove();
  });

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
          if (container.children.length === 0) container.remove();
        }
      }, 300);
    }
  }, duration);
}