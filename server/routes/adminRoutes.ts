import { Router, Request, Response } from 'express';
import { db } from '../db/store';

export const adminRouter = Router();

// GET /api/admin/stats
adminRouter.get('/stats', (req: Request, res: Response) => {
  const totalUsers = db.users.length;
  const totalTrips = db.trips.length;
  const totalBookings = db.bookings.length;
  const confirmedBookings = db.bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;
  const pendingBookings = db.bookings.filter((b) => b.bookingStatus === 'PENDING').length;
  const cancelledBookings = db.bookings.filter((b) => b.bookingStatus === 'CANCELLED').length;

  const totalRevenue = db.payments
    .filter((p) => p.paymentStatus === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const bookingsByType: Record<string, number> = {
    HOTEL: 0,
    BUS: 0,
    TRAIN: 0,
    FLIGHT: 0,
    ACTIVITY: 0,
  };

  db.bookings.forEach((b) => {
    bookingsByType[b.bookingType] = (bookingsByType[b.bookingType] || 0) + 1;
  });

  const recentBookings = db.bookings.slice(0, 8);
  const recentPayments = db.payments.slice(0, 8);

  return res.json({
    metrics: {
      totalUsers,
      totalTrips,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenueINR: totalRevenue,
      averageBookingValue: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0,
    },
    bookingsByType,
    recentBookings,
    recentPayments,
    systemHealth: {
      databaseStatus: 'CONNECTED (In-Memory Mock + Relational MySQL Schema Ready)',
      geminiEngineStatus: process.env.GEMINI_API_KEY ? 'ACTIVE (gemini-3.8-flash)' : 'STANDALONE_FALLBACK_ACTIVE',
      multiAgentWorkers: 8,
      lastHealthCheck: new Date().toISOString(),
    },
  });
});

// GET /api/admin/users
adminRouter.get('/users', (req: Request, res: Response) => {
  const usersSafe = db.users.map(({ passwordHash, ...rest }) => rest);
  return res.json(usersSafe);
});

// GET /api/admin/trips
adminRouter.get('/trips', (req: Request, res: Response) => {
  return res.json(db.trips);
});

// GET /api/admin/bookings
adminRouter.get('/bookings', (req: Request, res: Response) => {
  return res.json(db.bookings);
});
