import { db, Restaurant } from '../../db/store';

export interface RecommendedRestaurant extends Restaurant {
  aiScore: number;
  whyRecommended: string;
}

export interface RestaurantAgentResult {
  recommendedRestaurants: RecommendedRestaurant[];
  agentInsight: string;
}

export class RestaurantAgent {
  name = 'Restaurant Agent';
  role = 'Discover authentic culinary hubs, dietary-compliant dining, and top-rated local eateries.';

  execute(destinationName: string, foodPreference: string, budgetRange: string): RestaurantAgentResult {
    const term = (destinationName || 'Goa').toLowerCase();
    let matching = db.restaurants.filter(
      (r) => r.destination.toLowerCase().includes(term) || term.includes(r.destination.toLowerCase())
    );

    if (matching.length === 0) {
      matching = db.restaurants.slice(0, 4);
    }

    const scored: RecommendedRestaurant[] = matching.map((rst) => {
      let score = Math.round(rst.rating * 19);

      if (
        foodPreference &&
        foodPreference !== 'Any' &&
        rst.cuisine.toLowerCase().includes(foodPreference.toLowerCase())
      ) {
        score += 8;
      }

      score = Math.min(99, Math.max(70, score));

      const why = `Recommended for ${rst.cuisine} dining (rated ${rst.rating}★). Renowned for ${rst.popularDishes.slice(0, 2).join(', ')} with an average spend of ~₹${rst.avgPrice} per meal.`;

      return {
        ...rst,
        aiScore: score,
        whyRecommended: why,
      };
    });

    scored.sort((a, b) => b.aiScore - a.aiScore);

    return {
      recommendedRestaurants: scored,
      agentInsight: `Found ${scored.length} curated gastronomic recommendations offering authentic regional and multi-cuisine delights.`,
    };
  }
}
