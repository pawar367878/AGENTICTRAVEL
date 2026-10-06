import { Router, Request, Response } from 'express';
import { db } from '../db/store';

export const activityRouter = Router();

// GET /api/activities
activityRouter.get('/', (req: Request, res: Response) => {
  const { destination, category, maxPrice } = req.query;

  let results = [...db.activities];

  if (destination) {
    const dest = String(destination).toLowerCase();
    results = results.filter((a) => a.destination.toLowerCase().includes(dest));
  }

  if (category) {
    const cat = String(category).toLowerCase();
    results = results.filter((a) => a.category.toLowerCase() === cat);
  }

  if (maxPrice) {
    results = results.filter((a) => a.price <= Number(maxPrice));
  }

  return res.json(results);
});
