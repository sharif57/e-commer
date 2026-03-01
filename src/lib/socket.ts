import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = 'http://69.62.70.69:5003';

export const initSocket = () => {
  if (socket) {
    console.log('🔌 Socket already exists, returning existing instance');
    return socket;
  }

  console.log('🔌 Initializing new socket connection to:', SOCKET_URL);

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected successfully:', socket?.id);
    console.log('🔗 Transport:', socket?.io?.engine?.transport?.name);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected. Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Reconnection attempt:', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.error('❌ Reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('❌ Reconnection failed after max attempts');
  });

  console.log('🎧 Socket event listeners registered');

  return socket;
};

export const getSocket = (): Socket | null => {
  if (!socket) {
    console.log('🔌 No socket found, initializing...');
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('🔌 Disconnecting socket...');
    socket.disconnect();
    socket = null;
    console.log('✅ Socket disconnected');
  }
};
