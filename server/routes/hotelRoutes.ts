import { Router, Request, Response } from 'express';
import { db } from '../db/store';

export const hotelRouter = Router();

// GET /api/hotels
hotelRouter.get('/', (req: Request, res: Response) => {
  const { destination, maxPrice, minRating, travelStyle, search } = req.query;

  let results = [...db.hotels];

  if (destination) {
    const destStr = String(destination).toLowerCase();
    results = results.filter((h) => h.destination.toLowerCase().includes(destStr));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.destination.toLowerCase().includes(q) ||
        (h.address || h.locationAddress || '').toLowerCase().includes(q)
    );
  }

  if (maxPrice) {
    results = results.filter((h) => h.pricePerNight <= Number(maxPrice));
  }

  if (minRating) {
    results = results.filter((h) => h.rating >= Number(minRating));
  }

  if (travelStyle) {
    const style = String(travelStyle).toLowerCase();
    results = results.filter((h) =>
      h.matchTags.some((tag) => tag.toLowerCase() === style)
    );
  }

  return res.json(results);
});

// GET /api/hotels/:id
hotelRouter.get('/:id', (req: Request, res: Response) => {
  const hotel = db.hotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found.' });
  }
  return res.json(hotel);
});
