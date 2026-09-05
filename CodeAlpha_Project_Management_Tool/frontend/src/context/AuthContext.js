import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiFetch } from '../api';
import { io } from 'socket.io-client';
import {
  showToast,
  showBrowserNotification,
  requestNotificationPermission,
} from '../utils/notifications';
import NotificationModal from '../components/NotificationModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null);
  const listenerAttached = useRef(false);
  const notificationCounter = useRef(0);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    apiFetch('/auth/me')
      .then(data => {
        if (data.user) {
          setUser(data.user);
          connectSocket(data.user._id);
          requestNotificationPermission();
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        listenerAttached.current = false;
      }
    };
  }, []);

  const connectSocket = (userId) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('Socket already connected, skipping re-creation');
      return;
    }

    const s = io(BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      s.emit('register', userId);
    });

    s.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    if (!listenerAttached.current) {
      s.on('notification', (data) => {


        const title = user ? `@${user.username}` : 'Notification';
        showBrowserNotification(title, data.message);

        const id = ++notificationCounter.current;
        setNotification({ message: data.message, id });

        showToast(data.message, 'info', 2500);
      });
      listenerAttached.current = true;
    }

    socketRef.current = s;
    setSocket(s);
  };

  const clearNotification = () => setNotification(null);

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
    setUser(data.user);
    connectSocket(data.user._id);
    requestNotificationPermission();
    showToast('Welcome back!', 'success');
    return data;
  };

  const signup = async (username, email, password) => {
    const data = await apiFetch('/auth/signup', { method: 'POST', body: { username, email, password } });
    setUser(data.user);
    connectSocket(data.user._id);
    requestNotificationPermission();
    showToast('Account created!', 'success');
    return data;
  };

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      listenerAttached.current = false;
    }
    setSocket(null);
    setNotification(null);
    showToast('Logged out', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, socket }}>
      {children}
      {notification && (
        <NotificationModal
          message={notification.message}
          onClose={clearNotification}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);