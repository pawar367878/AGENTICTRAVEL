import { db, TransportOption } from '../../db/store';

export interface RecommendedTransport extends TransportOption {
  aiScore: number;
  whyRecommended: string;
  totalGroupCost: number;
}

export interface TransportAgentResult {
  options: {
    bus: RecommendedTransport[];
    train: RecommendedTransport[];
    flight: RecommendedTransport[];
  };
  recommendedOverall: RecommendedTransport | null;
  agentInsight: string;
}

export class TransportAgent {
  name = 'Transport Agent';
  role = 'Evaluate inter-city routes across Bus, Train, and Flight modalities, optimizing for cost, travel time, and comfort.';

  execute(
    origin: string,
    destination: string,
    travellersCount: number,
    totalBudget: number,
    preferredTransport: string
  ): TransportAgentResult {
    const originTerm = (origin || 'Pune').toLowerCase();
    const destTerm = (destination || 'Goa').toLowerCase();

    // Filter available transport or provide standard realistic options
    let candidates = db.transportOptions.filter((t) =>
      (t.sourceCity.toLowerCase().includes(originTerm) || originTerm.includes(t.sourceCity.toLowerCase())) &&
      (t.destinationCity.toLowerCase().includes(destTerm) || destTerm.includes(t.destinationCity.toLowerCase()))
    );

    if (candidates.length === 0) {
      // Fallback to all options matching destination or general
      candidates = db.transportOptions.filter((t) =>
        t.destinationCity.toLowerCase().includes(destTerm) || destTerm.includes(t.destinationCity.toLowerCase())
      );
      if (candidates.length === 0) {
        candidates = db.transportOptions;
      }
    }

    const maxTransportBudget = totalBudget * 0.3; // 30% of budget

    const scoreOption = (option: TransportOption): RecommendedTransport => {
      const totalGroupCost = option.price * travellersCount;
      let score = 75;

      // Budget friendliness
      if (totalGroupCost <= maxTransportBudget) {
        score += 12;
      } else if (totalGroupCost > maxTransportBudget * 1.5) {
        score -= 15;
      }

      // Rating boost
      score += Math.round(option.rating * 3);

      // Preferred type match
      if (
        preferredTransport &&
        preferredTransport !== 'Any' &&
        option.type.toLowerCase() === preferredTransport.toLowerCase()
      ) {
        score += 10;
      }

      score = Math.min(99, Math.max(60, score));

      const why = `Recommended because at ₹${option.price.toLocaleString('en-IN')}/person (₹${totalGroupCost.toLocaleString('en-IN')} total for ${travellersCount} travellers), ${option.operatorName} offers ${option.duration} duration, ${option.availableSeats} confirmed seats available, and high reliability rating (${option.rating}★).`;

      return {
        ...option,
        aiScore: score,
        whyRecommended: why,
        totalGroupCost,
      };
    };

    const busOptions = candidates.filter((c) => c.type === 'BUS').map(scoreOption).sort((a, b) => b.aiScore - a.aiScore);
    const trainOptions = candidates.filter((c) => c.type === 'TRAIN').map(scoreOption).sort((a, b) => b.aiScore - a.aiScore);
    const flightOptions = candidates.filter((c) => c.type === 'FLIGHT').map(scoreOption).sort((a, b) => b.aiScore - a.aiScore);

    // Pick recommended based on user preference or best value
    let recommendedOverall: RecommendedTransport | null = null;
    if (preferredTransport && preferredTransport.toLowerCase() === 'flight' && flightOptions.length > 0) {
      recommendedOverall = flightOptions[0];
    } else if (preferredTransport && preferredTransport.toLowerCase() === 'train' && trainOptions.length > 0) {
      recommendedOverall = trainOptions[0];
    } else if (preferredTransport && preferredTransport.toLowerCase() === 'bus' && busOptions.length > 0) {
      recommendedOverall = busOptions[0];
    } else {
      // Default best balance
      const allScored = [...busOptions, ...trainOptions, ...flightOptions].sort((a, b) => b.aiScore - a.aiScore);
      recommendedOverall = allScored[0] || null;
    }

    const agentInsight = recommendedOverall
      ? `Identified ${recommendedOverall.type} via ${recommendedOverall.operatorName} as the optimal transit route for ${travellersCount} passengers costing ₹${recommendedOverall.totalGroupCost.toLocaleString('en-IN')} total.`
      : 'Evaluated multimodal travel routes.';

    return {
      options: {
        bus: busOptions,
        train: trainOptions,
        flight: flightOptions,
      },
      recommendedOverall,
      agentInsight,
    };
  }
}
