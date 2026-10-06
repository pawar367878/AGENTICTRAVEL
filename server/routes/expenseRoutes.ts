import { Router, Request, Response } from 'express';
import { db, Expense } from '../db/store';
import { getUserFromAuthHeader } from './authRoutes';

export const expenseRouter = Router();

// GET /api/trips/:tripId/expenses
expenseRouter.get('/trips/:tripId/expenses', (req: Request, res: Response) => {
  const { tripId } = req.params;
  const trip = db.trips.find((t) => t.id === tripId);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const expenses = db.expenses.filter((e) => e.tripId === tripId);
  const members = db.tripMembers.filter((m) => m.tripId === tripId);

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryBreakdown: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  // Calculate per-person paid vs fair share
  const memberBalances: Record<string, { name: string; paid: number; share: number; net: number }> = {};
  const activeMembersCount = Math.max(1, members.length || trip.travellersCount);

  members.forEach((m) => {
    memberBalances[m.userId || m.email] = {
      name: m.name,
      paid: 0,
      share: 0,
      net: 0,
    };
  });

  expenses.forEach((e) => {
    const key = e.paidByUserId || e.paidByName || 'member';
    if (memberBalances[key]) {
      memberBalances[key].paid += e.amount;
    } else {
      memberBalances[key] = {
        name: e.paidByName || 'Member',
        paid: e.amount,
        share: 0,
        net: 0,
      };
    }
  });

  const equalSharePerPerson = Math.round(totalAmount / activeMembersCount);
  Object.keys(memberBalances).forEach((k) => {
    memberBalances[k].share = equalSharePerPerson;
    memberBalances[k].net = memberBalances[k].paid - equalSharePerPerson;
  });

  return res.json({
    tripId,
    totalExpenses: totalAmount,
    budgetAllocated: trip.budgetAllocated,
    remainingBudget: trip.budgetAllocated - totalAmount,
    perPersonEqualShare: equalSharePerPerson,
    categoryBreakdown,
    memberBalances: Object.values(memberBalances),
    expenses,
  });
});

// POST /api/expenses
expenseRouter.post('/', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const { tripId, title, amount, category, paidByUserId, paidByName, splitType } = req.body;

  if (!tripId || !title || !amount) {
    return res.status(400).json({ error: 'Trip ID, title and amount are required.' });
  }

  const trip = db.trips.find((t) => t.id === tripId);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const newExpense: Expense = {
    id: `exp-${Date.now()}`,
    tripId,
    title,
    amount: Number(amount),
    category: category || 'FOOD',
    paidByUserId: paidByUserId || (user ? user.id : 'usr-student-001'),
    paidByName: paidByName || (user ? user.name : 'Vivek Pawar'),
    splitType: splitType || 'EQUAL',
    createdAt: new Date().toISOString(),
  };

  db.expenses.unshift(newExpense);

  return res.status(201).json({ message: 'Expense logged successfully.', expense: newExpense });
});
