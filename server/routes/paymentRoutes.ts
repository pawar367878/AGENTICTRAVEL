import { Router, Request, Response } from 'express';
import { db, Payment } from '../db/store';
import { getUserFromAuthHeader } from './authRoutes';

export const paymentRouter = Router();

// POST /api/payments/create
paymentRouter.post('/create', (req: Request, res: Response) => {
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required.' });
  }

  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return res.json({
    orderId,
    bookingId: booking.id,
    amount: booking.totalPrice,
    currency: 'INR',
    customer: {
      name: booking.contactName,
      email: booking.contactEmail,
      phone: booking.contactPhone,
    },
    sandboxMode: true,
    supportedMethods: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'],
    expiresInSeconds: 120,
  });
});

// POST /api/payments/verify
paymentRouter.post('/verify', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const { bookingId, paymentMethod, cardLast4, upiId, bankName, shouldFail } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required.' });
  }

  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  if (shouldFail) {
    return res.status(402).json({
      success: false,
      error: 'Simulated Sandbox Payment Failure: Bank declined transaction or card authentication timed out.',
    });
  }

  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    bookingId: booking.id,
    userId: booking.userId,
    amount: booking.totalPrice,
    currency: 'INR',
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: 'SUCCESS',
    transactionId,
    gatewayResponse: {
      sandboxTest: true,
      authCode: 'AUTH_TEST_OK',
      upiId: upiId || 'traveller@okhdfcbank',
      bank: bankName || 'HDFC Bank',
      cardLast4: cardLast4 || '4242',
      processedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  db.payments.unshift(newPayment);

  // Update booking status to CONFIRMED
  booking.bookingStatus = 'CONFIRMED';

  // Create notification
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: booking.userId,
    title: 'Payment Successful & Ticket Confirmed',
    message: `Payment of ₹${booking.totalPrice.toLocaleString('en-IN')} for ${booking.itemTitle} confirmed. PNR: ${booking.pnrNumber}. Digital QR code ticket ready!`,
    type: 'BOOKING_CONFIRMED',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: 'Sandbox transaction completed successfully.',
    payment: newPayment,
    booking,
  });
});
