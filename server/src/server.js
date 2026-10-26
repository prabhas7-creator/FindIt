import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await (await import('./utils/seedHelper.js')).seedIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`FindIt Backend Server Running on Port: ${PORT}`);
      console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Health: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

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
  } catch (error) {
    console.error('Fatal error starting FindIt server:', error);
    process.exit(1);
  }
};

startServer();
