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


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Worker registration may contain
// identity proof / certificate data as Base64.
// Increase request body limit accordingly.
app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);


// ============================================================
// API
// ============================================================

const apiRouter = require('./Backend/routes/api');
const {
  ensureRegistrationSchema,
} = require('./Backend/db');

app.use('/api', apiRouter);


// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on('connection', (socket) => {

  // Join booking room
  socket.on(
    'join_booking_room',
    (bookingId) => {
      if (bookingId) {
        socket.join(
          `booking_${bookingId}`
        );
      }
    }
  );


  // Join skill room
  socket.on(
    'join_skill_room',
    (skill) => {
      if (skill) {
        socket.join(
          `room_${skill}`
        );
      }
    }
  );


  // Worker live location update
  socket.on(
    'update_location',
    (data) => {

      const latitude = Number(
        data?.latitude
      );

      const longitude = Number(
        data?.longitude
      );

      const bookingId =
        data?.bookingId;

      if (
        !bookingId ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      io
        .to(`booking_${bookingId}`)
        .emit(
          'worker_location_changed',
          {
            latitude,
            longitude,
          }
        );
    }
  );
});

app.set('io', io);


// ============================================================
// FRONTEND STATIC FILES
// ============================================================

const distPath = path.join(
  __dirname,
  'Frontend',
  'dist'
);

const indexPath = path.join(
  distPath,
  'index.html'
);

if (!fs.existsSync(indexPath)) {

  console.error(
    'Frontend build missing. Run: npm run build'
  );

  process.exitCode = 1;

} else {

  app.use(
    express.static(distPath)
  );


  // React Router fallback
  app.get(
    '*',
    (req, res) => {

      if (
        req.path.startsWith('/api/')
      ) {
        return res
          .status(404)
          .json({
            success: false,
            error:
              'API endpoint not found',
          });
      }

      res.sendFile(indexPath);
    }
  );
}


// ============================================================
// START SERVER
// ============================================================

if (require.main === module) {

  ensureRegistrationSchema()

    .then(() => {

      server.listen(
        PORT,
        '0.0.0.0',
        () => {

          console.log(
            `SahakarGig running on port ${PORT}`
          );

        }
      );

    })

    .catch((error) => {

      console.error(
        '[Database] Schema initialization failed:',
        error.message
      );

      process.exit(1);

    });
}


// ============================================================
// EXPORT
// ============================================================

module.exports = app;
