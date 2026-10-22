import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import apiRouter from './routes/apiRouter';
import { errorHandler } from './middleware/errorHandler';
import { connectDatabase, checkDbConnection } from './config/db';
import { checkRedisConnection } from './config/redis';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: '*', // Allow all origins for dev & cross-container access
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// Mount REST API
app.use('/api/v1', apiRouter);

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use(errorHandler);

// Server startup function
const startServer = async () => {
  await connectDatabase();
  const isRedisUp = await checkRedisConnection();

  console.log(`Cache connected: ${isRedisUp ? '✓ Redis' : '⚠️ In-Memory Fallback'}`);

  const server = app.listen(config.port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 EnviroTrack Infrastructure Compliance API Server`);
    console.log(`📡 Listening on: http://localhost:${config.port}/api/v1`);
    console.log(`🩺 Health check: http://localhost:${config.port}/api/v1/health`);
    console.log(`=======================================================`);
  });

  const gracefulShutdown = () => {
    console.log('Received shutdown signal. Closing HTTP server...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  return server;
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
