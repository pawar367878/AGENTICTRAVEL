import { Router, Request, Response } from 'express';
import { db } from '../db/store';

export const restaurantRouter = Router();

// GET /api/restaurants
restaurantRouter.get('/', (req: Request, res: Response) => {
  const { destination, cuisine, maxPrice } = req.query;

  let results = [...db.restaurants];

  if (destination) {
    const dest = String(destination).toLowerCase();
    results = results.filter((r) => r.destination.toLowerCase().includes(dest));
  }

  if (cuisine) {
    const c = String(cuisine).toLowerCase();
    results = results.filter((r) => r.cuisine.toLowerCase().includes(c));
  }

  if (maxPrice) {
    results = results.filter((r) => r.avgPrice <= Number(maxPrice));
  }

  return res.json(results);
});
