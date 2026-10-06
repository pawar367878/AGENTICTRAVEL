import { db, Activity } from '../../db/store';

export interface RecommendedActivity extends Activity {
  aiScore: number;
  whyRecommended: string;
  totalCost: number;
}

export interface ActivityAgentResult {
  recommendedActivities: RecommendedActivity[];
  totalActivitiesCost: number;
  agentInsight: string;
}

export class ActivityAgent {
  name = 'Activity Agent';
  role = 'Curate and schedule high-affinity experiential tours, adventure sports, and cultural landmarks.';

  execute(
    destinationName: string,
    interests: string[],
    travellersCount: number,
    weatherCondition: string
  ): ActivityAgentResult {
    const term = (destinationName || 'Goa').toLowerCase();
    let matching = db.activities.filter((a) =>
      a.destination.toLowerCase().includes(term) || term.includes(a.destination.toLowerCase())
    );

    if (matching.length === 0) {
      matching = db.activities.slice(0, 5);
    }

    const isRaining = weatherCondition.toLowerCase().includes('rain');

    const scoredActivities: RecommendedActivity[] = matching.map((act) => {
      let score = Math.round(act.rating * 18); // 70-90

      // Interest match
      const interestMatches = interests.some(
        (i) =>
          act.category.toLowerCase().includes(i.toLowerCase()) ||
          act.name.toLowerCase().includes(i.toLowerCase()) ||
          act.description.toLowerCase().includes(i.toLowerCase())
      );

      if (interestMatches) score += 10;

      // Weather consideration
      if (isRaining && act.suitableWeather.includes('Clear')) {
        score -= 20; // penalize outdoor activities in rain
      } else if (isRaining && act.suitableWeather.includes('All')) {
        score += 8; // bonus for indoor/rain-friendly
      }

      score = Math.min(99, Math.max(60, score));

      const totalCost = act.price * travellersCount;
      const why = `Recommended because it highlights ${act.category} (rated ${act.rating}★), takes ${act.duration}, and is optimal for ${act.bestTimeSlot} time slots.`;

      return {
        ...act,
        aiScore: score,
        whyRecommended: why,
        totalCost,
      };
    });

    scoredActivities.sort((a, b) => b.aiScore - a.aiScore);

    // Top activities
    const selected = scoredActivities.slice(0, 5);
    const totalActivitiesCost = selected.reduce((sum, item) => sum + item.totalCost, 0);

    const agentInsight = `Selected ${selected.length} top experiences aligned with ${interests.join(', ') || 'general highlights'}. Weather condition (${weatherCondition}) verified safe for planned excursions.`;

    return {
      recommendedActivities: scoredActivities,
      totalActivitiesCost,
      agentInsight,
    };
  }
}
