export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'USER' | 'GROUP_MEMBER' | 'ADMIN';
  preferredTravelStyle?: string;
  preferredBudgetMin?: number;
  preferredBudgetMax?: number;
  favouriteActivities?: string[];
  preferredFood?: string[];
  preferredTransport?: string[];
}

export interface DestinationItem {
  id: string;
  name: string;
  stateOrCountry: string;
  tagline: string;
  description: string;
  bestTimeToVisit: string;
  avgTemperatureCelsius: number;
  weatherCondition: string;
  rainProbability: number;
  humidity: number;
  imageUrl: string;
  popularInterests: string[];
}

export interface HotelItem {
  id: string;
  name: string;
  destination: string;
  locationAddress: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  roomType: string;
  facilities: string[];
  imageUrl: string;
  availabilityStatus: string;
  description: string;
  matchTags: string[];
  aiScore?: number;
  whyRecommended?: string;
  isWithinBudget?: boolean;
}

export interface TransportItem {
  id: string;
  type: 'BUS' | 'TRAIN' | 'FLIGHT';
  operatorName: string;
  operatorCode?: string;
  sourceCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  rating: number;
  amenities: string[];
  aiScore?: number;
  whyRecommended?: string;
  totalGroupCost?: number;
}

export interface ActivityItem {
  id: string;
  name: string;
  destination: string;
  location: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  rating: number;
  imageUrl: string;
  suitableWeather: string;
  bestTimeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  aiScore?: number;
  whyRecommended?: string;
  totalCost?: number;
}

export interface RestaurantItem {
  id: string;
  name: string;
  destination: string;
  cuisine: string;
  priceRange: string;
  avgPrice: number;
  rating: number;
  location: string;
  openingTime: string;
  popularDishes: string[];
  imageUrl: string;
  aiScore?: number;
  whyRecommended?: string;
}

export interface ItinerarySlotItem {
  id: string;
  timeSlot: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  location: string;
  activityTitle: string;
  estimatedCost: number;
  duration: string;
  travelTime: string;
  notes?: string;
}

export interface DayItineraryData {
  dayNumber: number;
  date: string;
  title: string;
  items: ItinerarySlotItem[];
}

export interface AgentTraceStep {
  agentName: string;
  taskTitle: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  durationMs: number;
  inputSummary: string;
  outputSummary: string;
  rationale: string;
}

export interface BudgetData {
  hotel: number;
  transport: number;
  food: number;
  activities: number;
  other: number;
  totalEstimated: number;
  allocatedBudget: number;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  costPerPerson: number;
  statusMessage: string;
  alternativesAdvice?: string[];
}

export interface WeatherData {
  temperatureCelsius: number;
  condition: string;
  rainProbability: number;
  humidity: number;
  forecastSummary: string;
  advisory: string;
  recommendedPackList: string[];
}

export interface OrchestratedPlan {
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
  agentExecutionTrace: AgentTraceStep[];
  destination: {
    destination: DestinationItem;
    highlights: string[];
    bestAttractions: string[];
    aiSuitabilityScore: number;
    explanation: string;
  };
  weather: WeatherData;
  hotels: {
    recommendedHotels: HotelItem[];
    topPick: HotelItem | null;
    agentInsight: string;
  };
  transport: {
    options: {
      bus: TransportItem[];
      train: TransportItem[];
      flight: TransportItem[];
    };
    recommendedOverall: TransportItem | null;
    agentInsight: string;
  };
  activities: {
    recommendedActivities: ActivityItem[];
    totalActivitiesCost: number;
    agentInsight: string;
  };
  restaurants: {
    recommendedRestaurants: RestaurantItem[];
    agentInsight: string;
  };
  budget: BudgetData;
  itinerary: DayItineraryData[];
  geminiEnhancedNotes?: string | null;
  generatedAt: string;
}

export interface BookingData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  tripId?: string;
  bookingType: 'HOTEL' | 'BUS' | 'TRAIN' | 'FLIGHT' | 'ACTIVITY';
  itemId: string;
  itemTitle: string;
  itemSubtitle?: string;
  pnrNumber: string;
  startDate?: string;
  endDate?: string;
  passengersCount?: number;
  unitPrice?: number;
  totalPrice: number;
  bookingStatus: 'PENDING' | 'PAYMENT_PROCESSING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  seatsOrRooms?: string;
  specialRequests?: string;
  qrPayload?: string;
  createdAt: string;
}

export interface PaymentData {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionReference?: string;
  transactionId?: string;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  createdAt: string;
}

export interface TripMemberData {
  id: string;
  tripId: string;
  userId?: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'MEMBER';
  joinedAt: string;
}

export interface VoteData {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  category: 'HOTEL' | 'TRANSPORT' | 'ACTIVITY';
  optionId: string;
  optionTitle: string;
  createdAt: string;
}

export interface ExpenseData {
  id: string;
  tripId: string;
  title: string;
  category: 'HOTEL' | 'TRANSPORT' | 'FOOD' | 'ACTIVITY' | 'SHOPPING' | 'OTHER';
  amount: number;
  paidBy?: string;
  paidByUserId?: string;
  paidByName?: string;
  splitType?: string;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
