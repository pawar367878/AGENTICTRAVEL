import { Router, Request, Response } from 'express';
import { db, hashPassword, User } from '../db/store';

export const authRouter = Router();

// Simple JWT-like bearer token for demo environment
function generateDemoToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function getUserFromAuthHeader(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }
    const user = db.users.find((u) => u.id === decoded.userId);
    return user || null;
  } catch (err) {
    return null;
  }
}

// POST /api/auth/register
authRouter.post('/register', (req: Request, res: Response) => {
  const { name, email, password, phone, preferredTravelStyle, favouriteActivities, preferredFood, preferredTransport } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }

  const newUser: User = {
    id: `usr-${Date.now().toString(36)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPassword(password),
    phone: phone || '',
    profileImage: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    role: 'USER',
    preferredTravelStyle: preferredTravelStyle || 'Standard',
    preferredBudgetMin: 10000,
    preferredBudgetMax: 50000,
    favouriteActivities: favouriteActivities || ['Beaches', 'Food', 'Culture'],
    preferredFood: preferredFood || ['Multi-Cuisine'],
    preferredTransport: preferredTransport || ['Bus', 'Train', 'Flight'],
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Add notification
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: newUser.id,
    title: 'Welcome to Agentic Travel AI!',
    message: 'Your personalized profile and preferences have been established for multi-agent travel orchestration.',
    type: 'TRIP_CREATED',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  const token = generateDemoToken(newUser);
  const { passwordHash, ...userSafe } = newUser;

  return res.status(201).json({
    message: 'Account registered successfully.',
    token,
    user: userSafe,
  });
});

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password credentials.' });
  }

  const token = generateDemoToken(user);
  const { passwordHash, ...userSafe } = user;

  return res.json({
    message: 'Login successful.',
    token,
    user: userSafe,
  });
});

// GET /api/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized or session expired.' });
  }
  const { passwordHash, ...userSafe } = user;
  return res.json({ user: userSafe });
});

// PUT /api/auth/profile
authRouter.put('/profile', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { name, phone, profileImage, preferredTravelStyle, preferredBudgetMin, preferredBudgetMax, favouriteActivities, preferredFood, preferredTransport } = req.body;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (profileImage) user.profileImage = profileImage;
  if (preferredTravelStyle) user.preferredTravelStyle = preferredTravelStyle;
  if (preferredBudgetMin !== undefined) user.preferredBudgetMin = Number(preferredBudgetMin);
  if (preferredBudgetMax !== undefined) user.preferredBudgetMax = Number(preferredBudgetMax);
  if (favouriteActivities) user.favouriteActivities = favouriteActivities;
  if (preferredFood) user.preferredFood = preferredFood;
  if (preferredTransport) user.preferredTransport = preferredTransport;

  const { passwordHash, ...userSafe } = user;
  return res.json({ message: 'Profile updated successfully.', user: userSafe });
});

// POST /api/auth/change-password
authRouter.post('/change-password', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required.' });
  }

  if (user.passwordHash !== hashPassword(currentPassword)) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  user.passwordHash = hashPassword(newPassword);
  return res.json({ message: 'Password changed successfully.' });
});
