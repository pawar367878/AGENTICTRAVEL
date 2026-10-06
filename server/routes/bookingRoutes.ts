import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import { db, Booking, generatePnr } from '../db/store';
import { getUserFromAuthHeader } from './authRoutes';

export const bookingRouter = Router();

// GET /api/bookings (List bookings for current user or all if admin)
bookingRouter.get('/', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const userId = user ? user.id : 'usr-student-001';

  if (user && user.role === 'ADMIN') {
    return res.json(db.bookings);
  }

  const userBookings = db.bookings.filter((b) => b.userId === userId);
  return res.json(userBookings);
});

// GET /api/bookings/:id
bookingRouter.get('/:id', async (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  const payment = db.payments.find((p) => p.bookingId === booking.id);
  let qrCodeDataUrl = '';

  try {
    const payload = JSON.stringify({
      bookingId: booking.id,
      pnr: booking.pnrNumber,
      item: booking.itemTitle,
      type: booking.bookingType,
      amount: booking.totalPrice,
      passengers: booking.passengersCount,
      status: booking.bookingStatus,
      verifyUrl: `/verify/${booking.id}`,
    });
    qrCodeDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 280,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.warn('QR code generation warning:', err);
  }

  return res.json({
    booking,
    payment,
    qrCodeDataUrl,
  });
});

// POST /api/bookings (Initiate booking)
bookingRouter.post('/', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const userId = user ? user.id : 'usr-student-001';
  const userName = user ? user.name : 'Vivek Pawar';
  const userEmail = user ? user.email : 'vrpawar2004@gmail.com';

  const {
    tripId,
    bookingType,
    itemId,
    itemTitle,
    itemSubtitle,
    startDate,
    endDate,
    passengersCount,
    unitPrice,
    totalPrice,
    contactName,
    contactEmail,
    contactPhone,
    seatsOrRooms,
    specialRequests,
  } = req.body;

  if (!bookingType || !itemId || !itemTitle || !totalPrice) {
    return res.status(400).json({ error: 'Missing required booking parameters.' });
  }

  const bookingId = `bk-${Date.now().toString(36)}`;
  const pnr = generatePnr(bookingType);

  const newBooking: Booking = {
    id: bookingId,
    userId,
    userName: userName || 'Vivek Pawar',
    userEmail: userEmail || 'vrpawar2004@gmail.com',
    tripId: tripId || 'trip-goa-001',
    bookingType,
    itemId,
    itemTitle,
    itemSubtitle: itemSubtitle || '',
    pnrNumber: pnr,
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date().toISOString().split('T')[0],
    passengersCount: Number(passengersCount) || 1,
    unitPrice: Number(unitPrice) || Number(totalPrice),
    totalPrice: Number(totalPrice),
    bookingStatus: 'PENDING',
    contactName: contactName || userName,
    contactEmail: contactEmail || userEmail,
    contactPhone: contactPhone || '+91 98765 43210',
    seatsOrRooms: seatsOrRooms || 'Standard',
    specialRequests: specialRequests || '',
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking);

  return res.status(201).json({
    message: 'Booking initiated. Please proceed with sandbox payment.',
    booking: newBooking,
  });
});

// PUT /api/bookings/:id/cancel
bookingRouter.put('/:id/cancel', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  if (booking.bookingStatus === 'CANCELLED') {
    return res.status(400).json({ error: 'Booking is already cancelled.' });
  }

  booking.bookingStatus = 'CANCELLED';

  // Refund simulation if payment was completed
  const payment = db.payments.find((p) => p.bookingId === booking.id);
  if (payment && payment.paymentStatus === 'SUCCESS') {
    payment.paymentStatus = 'REFUNDED';
  }

  // Add notification
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: booking.userId,
    title: 'Booking Cancelled',
    message: `Your ${booking.bookingType} booking (${booking.pnrNumber}) for ${booking.itemTitle} has been cancelled. Refund of ₹${booking.totalPrice.toLocaleString('en-IN')} initiated.`,
    type: 'BOOKING_CANCELLED',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return res.json({ message: 'Booking cancelled and simulated refund initiated.', booking });
});

// GET /api/bookings/:id/qr
bookingRouter.get('/:id/qr', async (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  try {
    const payload = JSON.stringify({
      id: booking.id,
      pnr: booking.pnrNumber,
      title: booking.itemTitle,
      type: booking.bookingType,
      status: booking.bookingStatus,
      name: booking.contactName,
      seats: booking.seatsOrRooms,
      date: booking.startDate,
      verifiedBy: 'AI Travel Platform Digital Gate',
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      width: 320,
      margin: 2,
    });

    return res.json({
      bookingId: booking.id,
      pnr: booking.pnrNumber,
      qrDataUrl,
      rawPayload: payload,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'QR generation failed.', details: err.message });
  }
});

// GET /api/verify/:bookingId (QR Scanner verification endpoint)
bookingRouter.get('/verify/:bookingId', (req: Request, res: Response) => {
  const booking = db.bookings.find((b) => b.id === req.params.bookingId || b.pnrNumber === req.params.bookingId);
  if (!booking) {
    return res.status(404).json({
      valid: false,
      message: 'Invalid Ticket. No matching record in Travel Platform Registry.',
    });
  }

  const payment = db.payments.find((p) => p.bookingId === booking.id);

  return res.json({
    valid: booking.bookingStatus === 'CONFIRMED',
    booking: {
      id: booking.id,
      pnr: booking.pnrNumber,
      item: booking.itemTitle,
      type: booking.bookingType,
      passenger: booking.contactName,
      status: booking.bookingStatus,
      seats: booking.seatsOrRooms,
      date: booking.startDate,
      amount: booking.totalPrice,
      paymentMethod: payment ? payment.paymentMethod : 'SANDBOX_UPI',
      transactionId: payment ? payment.transactionId : 'N/A',
    },
  });
});
