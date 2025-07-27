/*
* FILE: backend/socket.js
*
* DESCRIPTION:
* This new file initializes and configures our Socket.IO server.
* It manages a list of online users by mapping their user IDs to their
* unique socket IDs. This mapping is crucial for sending targeted,
* real-time notifications.
*/
import { Server } from 'socket.io';

let io;
const onlineUsers = new Map(); // Maps userId to socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a user logs in, the frontend should emit this event with their userId
    socket.on('add_user', (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`User ${userId} added with socket ID ${socket.id}`);
      // Send the updated list of online users to all clients
      io.emit('get_online_users', Array.from(onlineUsers.keys()));
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
      // Remove user from the map on disconnect
      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('get_online_users', Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

// Getter for the io instance
export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Getter for a specific user's socket ID
export const getSocketId = (userId) => {
    return onlineUsers.get(userId);
};
