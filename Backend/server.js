require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use(express.json());

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('join_skill_room', (skill) => {
    if (skill) socket.join(`room_${skill}`);
  });

  socket.on('join_booking_room', (bookingId) => {
    if (bookingId) socket.join(`booking_${bookingId}`);
  });

  socket.on('update_location', (data = {}) => {
    const { bookingId, latitude, longitude } = data;
    if (!bookingId || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return;
    io.to(`booking_${bookingId}`).emit('worker_location_changed', {
      latitude: Number(latitude),
      longitude: Number(longitude)
    });
  });
});

app.set('io', io);

app.get('/', (_req, res) => res.json({ name: 'SahakarGig API', status: 'running' }));

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SahakarGig backend running on port ${PORT}`);
  });
}

module.exports = app;
