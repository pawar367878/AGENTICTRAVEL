import { db, Destination } from '../../db/store';

export interface DestinationAgentResult {
  destination: Destination;
  highlights: string[];
  bestAttractions: string[];
  aiSuitabilityScore: number;
  explanation: string;
}

export class DestinationAgent {
  name = 'Destination Agent';
  role = 'Analyze destination preferences, identify regional highlights, weather context, and traveler suitability.';

  execute(destinationQuery: string, interests: string[], travelStyle: string): DestinationAgentResult {
    const term = (destinationQuery || 'Goa').toLowerCase();
    let dest = db.destinations.find(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.stateOrCountry.toLowerCase().includes(term)
    );

    if (!dest) {
      dest = db.destinations[0]; // default to Goa
    }

    // Calculate match score
    const matchedInterests = dest.popularInterests.filter((interest) =>
      interests.some((i) => i.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(i.toLowerCase()))
    );

    let score = 82 + matchedInterests.length * 4;
    if (score > 98) score = 98;

    const highlights = [
      `${dest.name} is ideally suited for ${travelStyle} travel experiences.`,
      `Matches ${matchedInterests.length} of your stated interests: ${matchedInterests.join(', ') || 'Scenic & Cultural explorations'}.`,
      `Optimal travel window: ${dest.bestTimeToVisit}. Currently expecting ${dest.weatherCondition} with ~${dest.avgTemperatureCelsius}°C.`,
    ];

    const bestAttractions = dest.popularInterests.slice(0, 4);

    const explanation = `Selected ${dest.name} because it perfectly aligns with your desire for ${interests.join(', ') || 'leisure'} and accommodates your ${travelStyle} travel style within regional connectivity hubs.`;

    return {
      destination: dest,
      highlights,
      bestAttractions,
      aiSuitabilityScore: score,
      explanation,
    };
  }
}
