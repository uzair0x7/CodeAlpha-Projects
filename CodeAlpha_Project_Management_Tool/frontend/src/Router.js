import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import TaskDetail from './pages/TaskDetail';

export default function Router({ user }) {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/login') return 'login';
    if (path === '/signup') return 'signup';
    if (path.startsWith('/project/')) return 'board';
    if (path.startsWith('/task/')) return 'task-detail';
    return user ? 'dashboard' : 'login';
  });
  const [projectId, setProjectId] = useState(null);
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname;
      if (path === '/login') setPage('login');
      else if (path === '/signup') setPage('signup');
      else if (path.startsWith('/project/')) {
        setProjectId(path.split('/')[2]);
        setPage('board');
      } else if (path.startsWith('/task/')) {
        setTaskId(path.split('/')[2]);
        setPage('task-detail');
      } else {
        setPage(user ? 'dashboard' : 'login');
      }
    };
    window.addEventListener('popstate', handler);
    handler();
    return () => window.removeEventListener('popstate', handler);
  }, [user]);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    const ev = new PopStateEvent('popstate');
    window.dispatchEvent(ev);
  };

  if (!user) {
    if (page === 'signup') return <Signup navigate={navigate} />;
    return <Login navigate={navigate} />;
  }

  if (page === 'board' && projectId) return <Board projectId={projectId} navigate={navigate} />;
  if (page === 'task-detail' && taskId) return <TaskDetail taskId={taskId} navigate={navigate} />;
  return <Dashboard navigate={navigate} />;
}