const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Workers join their skill-specific room
    socket.on('join_skill_room', (skill) => {
        socket.join(`room_${skill}`);
        console.log(`Socket ${socket.id} joined room_${skill}`);
    });

    // Handle worker location tracking updates
    socket.on('update_location', (data) => {
        // Broadcast location updates to customer tracking room
        io.to(`booking_${data.bookingId}`).emit('worker_location_changed', {
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Helper function to trigger real-time dispatch from Express controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server and WebSocket service listening on port ${PORT}`);
});