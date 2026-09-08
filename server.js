const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Mount the comprehensive Backend API Router
const apiRouter = require('./Backend/routes/api');
app.use('/api', apiRouter);

// HTTP Server and Socket.IO for Live Worker Tracking
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  // Workers join their skill-specific room
  socket.on('join_skill_room', (skill) => {
    socket.join(`room_${skill}`);
  });

  // Handle worker location tracking updates
  socket.on('update_location', (data) => {
    io.to(`booking_${data.bookingId}`).emit('worker_location_changed', {
      latitude: data.latitude,
      longitude: data.longitude
    });
  });
});

app.set('io', io);

// Locate and serve Frontend Static Build
const possibleDistPaths = [
  path.join(__dirname, 'Frontend', 'dist'),
  path.join(__dirname, 'dist'),
  path.join(process.cwd(), 'Frontend', 'dist'),
  path.join(process.cwd(), 'dist')
];

const distPath = possibleDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html'))) || possibleDistPaths[0];

app.use(express.static(distPath));

// Fallback for Single Page Application (SPA) routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("SahakarGig frontend build not found. Please run 'npm run build' first.");
  }
});

// Start listening if executed directly
if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🤝 SahakarGig Full-Stack Platform Active`);
    console.log(`📡 Server running on: http://0.0.0.0:${PORT}`);
    console.log(`🔌 API endpoints available at: /api/*`);
    console.log(`💻 Serving frontend from: ${distPath}`);
    console.log(`=========================================`);
  });
}

module.exports = app;
