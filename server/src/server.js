import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Bind to 0.0.0.0 for cloud hosting compatibility (Render, Railway, Fly.io)
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`FindIt Backend Server Running on Port: ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(`===============================================`);
  });

  try {
    await connectDB();
    await (await import('./utils/seedHelper.js')).seedIfEmpty();
  } catch (error) {
    console.error('Database connection failed on startup:', error.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('Server will stay alive to report health at /api/health while database connection is pending.');
    }
  }

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
      console.log('Server process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
