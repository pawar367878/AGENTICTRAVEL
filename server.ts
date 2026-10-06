import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

// Import API routers
import { authRouter } from './server/routes/authRoutes';
import { aiRouter } from './server/routes/aiRoutes';
import { tripRouter } from './server/routes/tripRoutes';
import { hotelRouter } from './server/routes/hotelRoutes';
import { transportRouter } from './server/routes/transportRoutes';
import { activityRouter } from './server/routes/activityRoutes';
import { restaurantRouter } from './server/routes/restaurantRoutes';
import { bookingRouter } from './server/routes/bookingRoutes';
import { paymentRouter } from './server/routes/paymentRoutes';
import { expenseRouter } from './server/routes/expenseRoutes';
import { adminRouter } from './server/routes/adminRoutes';
import { notificationRouter } from './server/routes/notificationRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Agentic AI Travel Planning & Multi-Agent Recommendation Engine',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Mount API endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/trips', tripRouter);
  app.use('/api/hotels', hotelRouter);
  app.use('/api/transport', transportRouter);
  app.use('/api/activities', activityRouter);
  app.use('/api/restaurants', restaurantRouter);
  app.use('/api/bookings', bookingRouter);
  app.use('/api/payments', paymentRouter);
  app.use('/api/expenses', expenseRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/notifications', notificationRouter);

  // Vite middleware in dev mode; static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Multi-Agent AI Travel System Server running on http://0.0.0.0:${PORT}`);
    console.log(`🤖 8 Specialized Agents + Orchestrator ready`);
    console.log(`💳 Sandbox Test Payment Gateway active`);
    console.log(`=======================================================`);
  });
}

startServer();
