require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 3000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const apiRouter = require('./Backend/routes/api');
const { ensureRegistrationSchema } = require('./Backend/db');
app.use('/api', apiRouter);

const io = new Server(server, { cors: { origin: true, credentials: true } });
io.on('connection', socket => {
  socket.on('join_booking_room', bookingId => {
    if (bookingId) socket.join(`booking_${bookingId}`);
  });
  socket.on('join_skill_room', skill => {
    if (skill) socket.join(`room_${skill}`);
  });
  socket.on('update_location', data => {
    const lat = Number(data?.latitude), lng = Number(data?.longitude), bookingId = data?.bookingId;
    if (!bookingId || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    io.to(`booking_${bookingId}`).emit('worker_location_changed', { latitude: lat, longitude: lng });
  });
});
app.set('io', io);

const distPath = path.join(__dirname, 'Frontend', 'dist');
if (!fs.existsSync(path.join(distPath, 'index.html'))) {
  console.error('Frontend build missing. Run: npm run build');
  process.exitCode = 1;
} else {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API endpoint not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (require.main === module) {
  ensureRegistrationSchema()
    .then(() => server.listen(PORT, '0.0.0.0', () => console.log(`SahakarGig running on port ${PORT}`)))
    .catch((err) => {
      console.error('[Database] Schema initialization failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
