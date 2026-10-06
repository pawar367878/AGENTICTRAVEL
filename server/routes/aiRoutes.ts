import { Router, Request, Response } from 'express';
import { orchestrator, OrchestratorPlanRequest } from '../services/agents/orchestrator';
import { db } from '../db/store';

export const aiRouter = Router();

// POST /api/ai/plan
aiRouter.post('/plan', async (req: Request, res: Response) => {
  try {
    const {
      startingLocation,
      destination,
      startDate,
      endDate,
      travellersCount,
      adultsCount,
      childrenCount,
      budget,
      travelStyle,
      interests,
      preferredTransport,
      hotelPreference,
      foodPreference,
      activityPreference,
    } = req.body;

    const planRequest: OrchestratorPlanRequest = {
      startingLocation: startingLocation || 'Pune',
      destination: destination || 'Goa',
      startDate: startDate || '2026-09-25',
      endDate: endDate || '2026-09-28',
      travellersCount: Number(travellersCount) || 4,
      adultsCount: Number(adultsCount) || (Number(travellersCount) || 4),
      childrenCount: Number(childrenCount) || 0,
      budget: Number(budget) || 40000,
      travelStyle: travelStyle || 'Standard',
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ['Beaches', 'Food', 'Adventure'],
      preferredTransport: preferredTransport || 'Any',
      hotelPreference: hotelPreference || 'Standard',
      foodPreference: foodPreference || 'Any',
      activityPreference: activityPreference || 'Balanced',
    };

    const orchestratedPlan = await orchestrator.processPlan(planRequest);
    return res.json(orchestratedPlan);
  } catch (error: any) {
    console.error('AI Orchestration error:', error);
    return res.status(500).json({
      error: 'AI Orchestrator encountered an error while coordinating specialized agents.',
      details: error.message,
    });
  }
});

// GET /api/recommendations
aiRouter.get('/recommendations', (req: Request, res: Response) => {
  return res.json({
    destinations: db.destinations,
    featuredTrips: [
      {
        id: 'rec-1',
        destination: 'Goa Coastal Escapade',
        route: 'Pune to Goa',
        duration: '3 Days / 2 Nights',
        budget: '₹40,000 for 4 people',
        highlights: ['Baga Beach', 'Scuba Diving', 'Fort Aguada', 'Goan Seafood'],
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        rating: 4.8,
      },
      {
        id: 'rec-2',
        destination: 'Manali Snowy Peaks & Trek',
        route: 'Delhi to Manali',
        duration: '4 Days / 3 Nights',
        budget: '₹35,000 for 2 people',
        highlights: ['Solang Valley', 'Paragliding', 'Old Manali Cafes', 'Jogini Waterfall'],
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
        rating: 4.9,
      },
      {
        id: 'rec-3',
        destination: 'Royal Jaipur Heritage Circuit',
        route: 'Delhi to Jaipur',
        duration: '3 Days / 2 Nights',
        budget: '₹28,000 for 2 people',
        highlights: ['Amer Fort', 'Hawa Mahal', 'Chokhi Dhani', 'Johari Bazaar'],
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
        rating: 4.7,
      },
    ],
  });
});
