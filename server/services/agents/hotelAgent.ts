import { db, Hotel } from '../../db/store';

export interface RecommendedHotel extends Hotel {
  aiScore: number;
  whyRecommended: string;
  isWithinBudget: boolean;
}

export interface HotelAgentResult {
  recommendedHotels: RecommendedHotel[];
  topPick: RecommendedHotel | null;
  agentInsight: string;
}

export class HotelAgent {
  name = 'Hotel Agent';
  role = 'Search, filter, and score accommodations based on location, budget envelope, guest amenities, and traveler preferences.';

  execute(
    destinationName: string,
    totalBudget: number,
    travelStyle: string,
    interests: string[],
    nights: number,
    travellersCount: number
  ): HotelAgentResult {
    // Budget allocated for stay typically 30-40% of total budget
    const targetHotelBudget = (totalBudget * 0.35);
    const maxAffordablePerNight = Math.max(1200, Math.round(targetHotelBudget / Math.max(1, nights)));

    const term = (destinationName || 'Goa').toLowerCase();
    let matchingHotels = db.hotels.filter((h) =>
      h.destination.toLowerCase().includes(term) ||
      term.includes(h.destination.toLowerCase())
    );

    if (matchingHotels.length === 0) {
      matchingHotels = db.hotels.slice(0, 4);
    }

    const scoredHotels: RecommendedHotel[] = matchingHotels.map((hotel) => {
      let score = Math.round(hotel.rating * 18); // Base 70-90

      // Budget fit bonus
      const isWithinBudget = hotel.pricePerNight <= maxAffordablePerNight * 1.25;
      if (hotel.pricePerNight <= maxAffordablePerNight) {
        score += 8;
      } else if (hotel.pricePerNight <= maxAffordablePerNight * 1.3) {
        score -= 5;
      } else {
        score -= 15;
      }

      // Style bonus
      if (hotel.matchTags.some((t) => t.toLowerCase() === travelStyle.toLowerCase())) {
        score += 6;
      }

      // Interests match
      const interestMatches = hotel.matchTags.filter((t) =>
        interests.some((i) => i.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(i.toLowerCase()))
      );
      score += interestMatches.length * 3;

      score = Math.min(99, Math.max(65, score));

      const why = `Recommended because it is ₹${hotel.pricePerNight.toLocaleString('en-IN')}/night (${isWithinBudget ? 'within your optimal stay budget' : 'slightly premium'}), holds a strong ${hotel.rating}★ guest rating, and offers direct access to ${hotel.facilities.slice(0, 2).join(' & ')}.`;

      return {
        ...hotel,
        aiScore: score,
        whyRecommended: why,
        isWithinBudget,
      };
    });

    // Sort by AI Score descending
    scoredHotels.sort((a, b) => b.aiScore - a.aiScore);

    const topPick = scoredHotels[0] || null;
    const agentInsight = topPick
      ? `Selected '${topPick.name}' as top recommendation. Total estimated stay cost for ${nights} nights is ₹${(topPick.pricePerNight * nights).toLocaleString('en-IN')}, leaving ample room for travel and activities.`
      : 'Evaluated accommodations based on guest count and amenities.';

    return {
      recommendedHotels: scoredHotels,
      topPick,
      agentInsight,
    };
  }
}
