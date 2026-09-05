let io;

exports.setupSocket = (serverIo) => {
  io = serverIo;
  io.on('connection', (socket) => {


    socket.on('register', (userId) => {
      socket.userId = userId;
      socket.join(`user_${userId}`);

    });

    socket.on('task-updated', (data) => {

      socket.to(`project_${data.projectId}`).emit('task-updated', data);
    });

    socket.on('new-comment', (data) => {

      socket.to(`project_${data.projectId}`).emit('new-comment', data);
    });

    socket.on('join-project', (projectId) => {
      socket.join(`project_${projectId}`);

    });

    socket.on('leave-project', (projectId) => {
      socket.leave(`project_${projectId}`);

    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });
};

exports.emitNotification = (userId, message) => {
  if (!io) {
    console.warn('io not initialized, cannot emit notification');
    return;
  }
  io.to(`user_${userId}`).emit('notification', { message, timestamp: new Date() });
};