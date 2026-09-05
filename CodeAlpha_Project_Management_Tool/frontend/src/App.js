import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Router from './Router';
import { useAuth } from './context/AuthContext';
import "./styles/global.css";

function AppContent() {
  const { user, socket } = useAuth();
  return (
    <SocketProvider value={socket}>
      <Router user={user} />
    </SocketProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;