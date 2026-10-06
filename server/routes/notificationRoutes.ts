import { Router, Request, Response } from 'express';
import { db } from '../db/store';
import { getUserFromAuthHeader } from './authRoutes';

export const notificationRouter = Router();

// GET /api/notifications
notificationRouter.get('/', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const userId = user ? user.id : 'usr-student-001';

  const userNotifs = db.notifications.filter((n) => n.userId === userId || n.userId === 'all');
  return res.json(userNotifs);
});

// PUT /api/notifications/:id/read
notificationRouter.put('/:id/read', (req: Request, res: Response) => {
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (notif) {
    notif.isRead = true;
  }
  return res.json({ message: 'Marked as read.' });
});

// PUT /api/notifications/read-all
notificationRouter.put('/read-all', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const userId = user ? user.id : 'usr-student-001';

  db.notifications.forEach((n) => {
    if (n.userId === userId || n.userId === 'all') {
      n.isRead = true;
    }
  });
  return res.json({ message: 'All notifications marked as read.' });
});
