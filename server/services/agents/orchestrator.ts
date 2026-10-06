import { DestinationAgent, DestinationAgentResult } from './destinationAgent';
import { HotelAgent, HotelAgentResult, RecommendedHotel } from './hotelAgent';
import { TransportAgent, TransportAgentResult, RecommendedTransport } from './transportAgent';
import { ActivityAgent, ActivityAgentResult, RecommendedActivity } from './activityAgent';
import { RestaurantAgent, RestaurantAgentResult, RecommendedRestaurant } from './restaurantAgent';
import { WeatherAgent, WeatherAgentResult } from './weatherAgent';
import { BudgetAgent, BudgetBreakdown } from './budgetAgent';
import { ItineraryAgent } from './itineraryAgent';
import { DayItinerary } from '../../db/store';
import { enhancePlanWithGemini } from '../geminiService';

export interface AgentExecutionStep {
  agentName: string;
  taskTitle: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  durationMs: number;
  inputSummary: string;
  outputSummary: string;
  rationale: string;
}

export interface OrchestratorPlanRequest {
  startingLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellersCount: number;
  adultsCount: number;
  childrenCount: number;
  budget: number;
  travelStyle: string;
  interests: string[];
  preferredTransport: string;
  hotelPreference: string;
  foodPreference: string;
  activityPreference: string;
}

export interface OrchestratedTravelPlan {
  summary: {
    tripTitle: string;
    route: string;
    durationDays: number;
    dates: string;
    travellers: number;
    budgetAllocated: number;
    travelStyle: string;
    primaryInterests: string[];
  };
  agentExecutionTrace: AgentExecutionStep[];
  destination: DestinationAgentResult;
  weather: WeatherAgentResult;
  hotels: HotelAgentResult;
  transport: TransportAgentResult;
  activities: ActivityAgentResult;
  restaurants: RestaurantAgentResult;
  budget: BudgetBreakdown;
  itinerary: DayItinerary[];
  geminiEnhancedNotes?: string | null;
  generatedAt: string;
}

export class AIOrchestrator {
  private destinationAgent = new DestinationAgent();
  private weatherAgent = new WeatherAgent();
  private hotelAgent = new HotelAgent();
  private transportAgent = new TransportAgent();
  private activityAgent = new ActivityAgent();
  private restaurantAgent = new RestaurantAgent();
  private budgetAgent = new BudgetAgent();
  private itineraryAgent = new ItineraryAgent();

  async processPlan(req: OrchestratorPlanRequest): Promise<OrchestratedTravelPlan> {
    const trace: AgentExecutionStep[] = [];
    const startTime = Date.now();

    // 1. Calculate duration in days
    const start = new Date(req.startDate || '2026-09-25');
    const end = new Date(req.endDate || '2026-09-28');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24))) || 3;
    const nightsCount = Math.max(1, daysCount - 1);

    // Step 1: Destination Agent
    const t1Start = Date.now();
    const destResult = this.destinationAgent.execute(req.destination, req.interests, req.travelStyle);
    trace.push({
      agentName: this.destinationAgent.name,
      taskTitle: 'Analyze Destination & Regional Feasibility',
      status: 'COMPLETED',
      timestamp: new Date(t1Start).toISOString(),
      durationMs: Date.now() - t1Start,
      inputSummary: `Destination: ${req.destination}, Style: ${req.travelStyle}, Interests: ${req.interests.join(', ')}`,
      outputSummary: `Selected ${destResult.destination.name} (Match Score: ${destResult.aiSuitabilityScore}/100)`,
      rationale: destResult.explanation,
    });

    // Step 2: Weather Agent
    const t2Start = Date.now();
    const weatherResult = this.weatherAgent.execute(destResult.destination.name, req.startDate);
    trace.push({
      agentName: this.weatherAgent.name,
      taskTitle: 'Assess Meteorological Conditions & Climate Advisory',
      status: 'COMPLETED',
      timestamp: new Date(t2Start).toISOString(),
      durationMs: Date.now() - t2Start,
      inputSummary: `Destination: ${destResult.destination.name}, Dates: ${req.startDate} to ${req.endDate}`,
      outputSummary: `${weatherResult.condition}, ${weatherResult.temperatureCelsius}°C (Rain probability: ${weatherResult.rainProbability}%)`,
      rationale: weatherResult.advisory,
    });

    // Step 3: Hotel Agent
    const t3Start = Date.now();
    const hotelResult = this.hotelAgent.execute(
      destResult.destination.name,
      req.budget,
      req.travelStyle,
      req.interests,
      nightsCount,
      req.travellersCount
    );
    trace.push({
      agentName: this.hotelAgent.name,
      taskTitle: 'Filter & Rank Accommodations',
      status: 'COMPLETED',
      timestamp: new Date(t3Start).toISOString(),
      durationMs: Date.now() - t3Start,
      inputSummary: `Stay Budget: ~35% of ₹${req.budget}, Nights: ${nightsCount}, Preferences: ${req.hotelPreference}`,
      outputSummary: `Ranked ${hotelResult.recommendedHotels.length} hotels. Top pick: ${hotelResult.topPick?.name}`,
      rationale: hotelResult.agentInsight,
    });

    // Step 4: Transport Agent
    const t4Start = Date.now();
    const transportResult = this.transportAgent.execute(
      req.startingLocation,
      destResult.destination.name,
      req.travellersCount,
      req.budget,
      req.preferredTransport
    );
    trace.push({
      agentName: this.transportAgent.name,
      taskTitle: 'Evaluate Multimodal Intercity Transit (Bus, Train, Flight)',
      status: 'COMPLETED',
      timestamp: new Date(t4Start).toISOString(),
      durationMs: Date.now() - t4Start,
      inputSummary: `Origin: ${req.startingLocation} -> Dest: ${destResult.destination.name}, Mode Preference: ${req.preferredTransport}`,
      outputSummary: `Bus: ${transportResult.options.bus.length} options, Train: ${transportResult.options.train.length} options, Flight: ${transportResult.options.flight.length} options`,
      rationale: transportResult.agentInsight,
    });

    // Step 5: Activity Agent (incorporates weather insights)
    const t5Start = Date.now();
    const activityResult = this.activityAgent.execute(
      destResult.destination.name,
      req.interests,
      req.travellersCount,
      weatherResult.condition
    );
    trace.push({
      agentName: this.activityAgent.name,
      taskTitle: 'Curate Weather-Adapted Experiences & Sightseeing',
      status: 'COMPLETED',
      timestamp: new Date(t5Start).toISOString(),
      durationMs: Date.now() - t5Start,
      inputSummary: `Interests: ${req.interests.join(', ')}, Weather context: ${weatherResult.condition}`,
      outputSummary: `Selected ${activityResult.recommendedActivities.length} bookable activities & tours`,
      rationale: activityResult.agentInsight,
    });

    // Step 6: Restaurant Agent
    const t6Start = Date.now();
    const restaurantResult = this.restaurantAgent.execute(
      destResult.destination.name,
      req.foodPreference,
      req.travelStyle
    );
    trace.push({
      agentName: this.restaurantAgent.name,
      taskTitle: 'Identify Top-Rated Authentic Dining & Cuisines',
      status: 'COMPLETED',
      timestamp: new Date(t6Start).toISOString(),
      durationMs: Date.now() - t6Start,
      inputSummary: `Food preference: ${req.foodPreference}`,
      outputSummary: `Curated ${restaurantResult.recommendedRestaurants.length} gastronomic venues`,
      rationale: restaurantResult.agentInsight,
    });

    // Step 7: Budget Agent (combines selected top picks)
    const t7Start = Date.now();
    const topHotelCost = hotelResult.topPick ? hotelResult.topPick.pricePerNight * nightsCount : 7000;
    const topTransportCost = transportResult.recommendedOverall ? transportResult.recommendedOverall.totalGroupCost : 4800;
    const topActivitiesCost = activityResult.totalActivitiesCost || 4000;

    const budgetResult = this.budgetAgent.calculate(
      req.budget,
      topHotelCost,
      topTransportCost,
      topActivitiesCost,
      req.travellersCount,
      daysCount
    );
    trace.push({
      agentName: this.budgetAgent.name,
      taskTitle: 'Perform Financial Constraint Satisfaction & Trade-off Optimization',
      status: 'COMPLETED',
      timestamp: new Date(t7Start).toISOString(),
      durationMs: Date.now() - t7Start,
      inputSummary: `Allocated: ₹${req.budget}, Hotel: ₹${topHotelCost}, Transport: ₹${topTransportCost}, Activities: ₹${topActivitiesCost}`,
      outputSummary: `Total Estimated: ₹${budgetResult.totalEstimated} | Remaining Buffer: ₹${budgetResult.remainingBudget}`,
      rationale: budgetResult.statusMessage,
    });

    // Step 8: Itinerary Agent
    const t8Start = Date.now();
    const itinerary = this.itineraryAgent.generate(
      destResult.destination.name,
      req.startDate,
      daysCount,
      hotelResult.topPick,
      activityResult.recommendedActivities,
      restaurantResult.recommendedRestaurants,
      weatherResult.condition
    );
    trace.push({
      agentName: this.itineraryAgent.name,
      taskTitle: 'Synthesize Multi-Day Temporal Schedule with Transit Buffers',
      status: 'COMPLETED',
      timestamp: new Date(t8Start).toISOString(),
      durationMs: Date.now() - t8Start,
      inputSummary: `Duration: ${daysCount} Days, Scheduled from ${req.startDate}`,
      outputSummary: `Synthesized ${itinerary.length} daily schedules with Morning, Afternoon, Evening, Night blocks`,
      rationale: `Grouped geographically proximate sights to minimize inter-venue transit time.`,
    });

    // Step 9: Optional Gemini AI Enhancement (if GEMINI_API_KEY is available)
    let geminiNotes: string | null = null;
    try {
      const geminiPrompt = `
You are the AI Orchestrator for an Engineering Project on Multi-Agent Travel Planning.
Trip Details:
From ${req.startingLocation} to ${destResult.destination.name} for ${daysCount} days (${req.startDate} to ${req.endDate}).
Travellers: ${req.travellersCount}, Budget: ₹${req.budget}, Style: ${req.travelStyle}, Interests: ${req.interests.join(', ')}.
Weather: ${weatherResult.condition} (~${weatherResult.temperatureCelsius}°C).
Top Hotel: ${hotelResult.topPick?.name || 'Sea View Resort'} (₹${topHotelCost}).
Transport: ${transportResult.recommendedOverall?.operatorName} (${transportResult.recommendedOverall?.type}, ₹${topTransportCost}).

Write a 2-3 sentence personalized executive travel recommendation summarizing why this specific itinerary is the ideal multi-agent balance for the travellers.
`;
      geminiNotes = await enhancePlanWithGemini(geminiPrompt);
    } catch (e) {
      console.warn('Gemini enrichment skipped:', e);
    }

    return {
      summary: {
        tripTitle: `${destResult.destination.name} ${req.travelStyle} Adventure`,
        route: `${req.startingLocation} ➔ ${destResult.destination.name}`,
        durationDays: daysCount,
        dates: `${req.startDate} to ${req.endDate}`,
        travellers: req.travellersCount,
        budgetAllocated: req.budget,
        travelStyle: req.travelStyle,
        primaryInterests: req.interests,
      },
      agentExecutionTrace: trace,
      destination: destResult,
      weather: weatherResult,
      hotels: hotelResult,
      transport: transportResult,
      activities: activityResult,
      restaurants: restaurantResult,
      budget: budgetResult,
      itinerary,
      geminiEnhancedNotes: geminiNotes,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const orchestrator = new AIOrchestrator();
