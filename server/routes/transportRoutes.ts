import { Router, Request, Response } from 'express';
import { db } from '../db/store';

export const transportRouter = Router();

// GET /api/transport
transportRouter.get('/', (req: Request, res: Response) => {
  const { type, source, destination, maxPrice } = req.query;

  let results = [...db.transportOptions];

  if (type && type !== 'ALL') {
    results = results.filter((t) => t.type === String(type).toUpperCase());
  }

  if (source) {
    const src = String(source).toLowerCase();
    results = results.filter((t) => t.sourceCity.toLowerCase().includes(src));
  }

  if (destination) {
    const dest = String(destination).toLowerCase();
    results = results.filter((t) => t.destinationCity.toLowerCase().includes(dest));
  }

  if (maxPrice) {
    results = results.filter((t) => t.price <= Number(maxPrice));
  }

  return res.json(results);
});
