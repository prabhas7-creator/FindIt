import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Allowed origins for CORS (development and production support)
const normalizeOrigin = (url) => (url ? url.trim().replace(/\/+$/, '') : '');
const clientUrl = normalizeOrigin(process.env.CLIENT_URL);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const normalized = normalizeOrigin(origin);

      const isAllowed =
        normalized === 'http://localhost:5173' ||
        normalized === 'http://127.0.0.1:5173' ||
        normalized === 'http://localhost:3000' ||
        (clientUrl && normalized === clientUrl) ||
        normalized.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production';

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Blocked by CORS policy for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Express body parsers (supports base64 image strings if entered)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/requests', requestRoutes);

// Root greeting endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    brand: 'FindIt',
    name: 'FindIt — Lost & Found Portal API',
    tagline: "Lost Something? Let's Find It.",
    status: 'running',
    health: '/api/health',
  });
});

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

export default app;
