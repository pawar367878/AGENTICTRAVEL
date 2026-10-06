import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  profileImage?: string;
  role: 'USER' | 'GROUP_MEMBER' | 'ADMIN';
  preferredTravelStyle?: string;
  preferredBudgetMin?: number;
  preferredBudgetMax?: number;
  favouriteActivities?: string[];
  preferredFood?: string[];
  preferredTransport?: string[];
  createdAt: string;
}

export interface Destination {
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

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  locationAddress: string;
  address?: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  roomType: string;
  facilities: string[];
  imageUrl: string;
  availabilityStatus: string;
  description: string;
  matchTags: string[];
}

export interface TransportOption {
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
}

export interface Activity {
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
}

export interface Restaurant {
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
}

export interface TripMember {
  id: string;
  tripId: string;
  userId?: string;
  name: string;
  email: string;
  role: 'ORGANIZER' | 'MEMBER';
  joinedAt: string;
}

export interface ItineraryItem {
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

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  items: ItineraryItem[];
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  startingLocation: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travellersCount: number;
  adultsCount: number;
  childrenCount: number;
  budgetAllocated: number;
  travelStyle: string;
  interests: string[];
  preferredTransport: string;
  hotelPreference: string;
  foodPreference: string;
  activityPreference: string;
  status: 'PLANNING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'SAVED';
  selectedHotelId?: string;
  selectedTransportId?: string;
  selectedActivityIds?: string[];
  itinerary?: DayItinerary[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
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
  details?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  passengersCount?: number;
  unitPrice?: number;
  totalPrice: number;
  totalAmount?: number;
  bookingStatus: 'PENDING' | 'PAYMENT_PROCESSING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  status?: 'PENDING' | 'PAYMENT_PROCESSING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  seatsOrRooms?: string;
  specialRequests?: string;
  qrPayload?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionReference?: string;
  transactionId?: string;
  paymentStatus: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  status?: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
  isSandbox?: boolean;
  gatewayResponse?: Record<string, any>;
  createdAt: string;
}

export interface Vote {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  category: 'HOTEL' | 'TRANSPORT' | 'ACTIVITY';
  optionId: string;
  optionTitle: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  category: 'HOTEL' | 'TRANSPORT' | 'FOOD' | 'ACTIVITY' | 'SHOPPING' | 'OTHER';
  amount: number;
  paidBy?: string;
  paidByUserId?: string;
  paidByName?: string;
  splitType?: string;
  expenseDate?: string;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TRIP_CREATED' | 'BOOKING_CONFIRMED' | 'PAYMENT_SUCCESS' | 'BOOKING_CANCELLED' | 'GROUP_INVITE' | 'VOTE_UPDATED' | 'ITINERARY_UPDATED' | 'BUDGET_WARNING';
  isRead: boolean;
  createdAt: string;
}

// Simple deterministic hash helper for demo auth
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'agentic_salt_2026').digest('hex');
}

export function generatePnr(bookingType: string = 'TRV'): string {
  const prefix = bookingType.substring(0, 3).toUpperCase();
  const randomAlpha = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomAlpha}${randomNum}`;
}

// In-memory Database Store
class DatabaseStore {
  users: User[] = [];
  destinations: Destination[] = [];
  hotels: Hotel[] = [];
  transportOptions: TransportOption[] = [];
  activities: Activity[] = [];
  restaurants: Restaurant[] = [];
  trips: Trip[] = [];
  tripMembers: TripMember[] = [];
  bookings: Booking[] = [];
  payments: Payment[] = [];
  votes: Vote[] = [];
  expenses: Expense[] = [];
  notifications: NotificationItem[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Initial Users (Student/Researcher Demo and Admin)
    this.users.push(
      {
        id: 'usr-student-001',
        name: 'Vivek Pawar',
        email: 'vrpawar2004@gmail.com',
        passwordHash: hashPassword('password123'),
        phone: '+91 98765 43210',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'USER',
        preferredTravelStyle: 'Adventure',
        preferredBudgetMin: 15000,
        preferredBudgetMax: 50000,
        favouriteActivities: ['Beaches', 'Water Sports', 'Trekking', 'Photography'],
        preferredFood: ['Seafood', 'Indian', 'Continental'],
        preferredTransport: ['Flight', 'Train', 'Bus'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-admin-999',
        name: 'Project Evaluator (Admin)',
        email: 'admin@travelai.edu',
        passwordHash: hashPassword('admin123'),
        phone: '+91 98200 11223',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'ADMIN',
        preferredTravelStyle: 'Luxury',
        preferredBudgetMin: 30000,
        preferredBudgetMax: 100000,
        favouriteActivities: ['Historical Places', 'Culture', 'Food'],
        preferredFood: ['Multi-Cuisine'],
        preferredTransport: ['Flight'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-collab-002',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@demo.com',
        passwordHash: hashPassword('password123'),
        phone: '+91 91234 56780',
        role: 'GROUP_MEMBER',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-collab-003',
        name: 'Ananya Verma',
        email: 'ananya.v@demo.com',
        passwordHash: hashPassword('password123'),
        phone: '+91 98765 11223',
        role: 'GROUP_MEMBER',
        createdAt: new Date().toISOString()
      }
    );

    // 2. Destinations
    this.destinations.push(
      {
        id: 'dest-goa',
        name: 'Goa',
        stateOrCountry: 'Goa, India',
        tagline: 'Sun, Sand, Serenity and Vibrant Coastal Life',
        description: 'Famous for pristine palm-fringed beaches, Portuguese-era architecture, electrifying beach shacks, and exhilarating water sports.',
        bestTimeToVisit: 'October to March',
        avgTemperatureCelsius: 29,
        weatherCondition: 'Sunny & Pleasant Breeze',
        rainProbability: 10,
        humidity: 68,
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
        popularInterests: ['Beaches', 'Nightlife', 'Water Sports', 'Food', 'Culture', 'Photography']
      },
      {
        id: 'dest-manali',
        name: 'Manali',
        stateOrCountry: 'Himachal Pradesh, India',
        tagline: 'Majestic Snowy Peaks and Valley of the Gods',
        description: 'A breathtaking high-altitude Himalayan resort town known for snow slopes, Solang Valley adventures, and serene pine forests.',
        bestTimeToVisit: 'September to June',
        avgTemperatureCelsius: 16,
        weatherCondition: 'Cool & Clear Skies',
        rainProbability: 15,
        humidity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
        popularInterests: ['Mountains', 'Trekking', 'Adventure', 'Nature', 'Photography']
      },
      {
        id: 'dest-jaipur',
        name: 'Jaipur',
        stateOrCountry: 'Rajasthan, India',
        tagline: 'The Royal Pink City of Majestic Palaces and Forts',
        description: 'Rich royal heritage, iconic Amer Fort, intricate Hawa Mahal, and world-renowned Rajasthani cuisine and vibrant bazaars.',
        bestTimeToVisit: 'October to March',
        avgTemperatureCelsius: 27,
        weatherCondition: 'Warm & Sunny',
        rainProbability: 5,
        humidity: 42,
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
        popularInterests: ['Historical Places', 'Culture', 'Food', 'Shopping', 'Photography']
      },
      {
        id: 'dest-kerala',
        name: 'Munnar & Alleppey',
        stateOrCountry: 'Kerala, India',
        tagline: "God's Own Country - Emerald Tea Gardens & Backwaters",
        description: 'Lush rolling tea estates, tranquil backwater houseboats, Ayurvedic wellness, and fragrant spice plantations.',
        bestTimeToVisit: 'September to March',
        avgTemperatureCelsius: 23,
        weatherCondition: 'Misty & Pleasant',
        rainProbability: 25,
        humidity: 75,
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        popularInterests: ['Nature', 'Relaxation', 'Culture', 'Photography', 'Food']
      },
      {
        id: 'dest-udaipur',
        name: 'Udaipur',
        stateOrCountry: 'Rajasthan, India',
        tagline: 'City of Lakes and Venetian Romance',
        description: 'Shimmering Lake Pichola, towering royal palaces, heritage boat rides, and breathtaking sunset viewpoints.',
        bestTimeToVisit: 'October to March',
        avgTemperatureCelsius: 26,
        weatherCondition: 'Sunny',
        rainProbability: 5,
        humidity: 45,
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        popularInterests: ['Historical Places', 'Culture', 'Photography', 'Couple']
      }
    );

    // 3. Hotels (25 realistic hotels)
    const rawHotels = [
      {
        id: 'htl-goa-01',
        name: 'Sea View Beach Resort & Spa',
        destination: 'Goa',
        locationAddress: 'Calangute - Baga Beach Road, North Goa',
        rating: 4.6,
        reviewCount: 428,
        pricePerNight: 3500,
        roomType: 'Deluxe Sea View Room',
        facilities: ['Free High-Speed Wi-Fi', 'Swimming Pool', 'Beach Access (2 min)', 'Complimentary Breakfast', 'Air Conditioning', 'Spa'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Prime beachfront property with panoramic Arabian Sea views, infinity pool, and direct access to famous watersport shacks.',
        matchTags: ['Beach', 'Budget', 'Standard', 'Family', 'Couple']
      },
      {
        id: 'htl-goa-02',
        name: 'The Leela Coastal Heritage',
        destination: 'Goa',
        locationAddress: 'Mobor Beach, Cavelossim, South Goa',
        rating: 4.9,
        reviewCount: 890,
        pricePerNight: 8500,
        roomType: 'Lagoon Suite with Balcony',
        facilities: ['Private Beach', '12-hole Golf Course', 'Multiple Gourmet Restaurants', 'Luxury Spa', 'Airport Shuttle', 'Infinity Pool'],
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Exquisite 5-star luxury sanctuary sprawling across 75 acres of lush tropical gardens and private serene beaches.',
        matchTags: ['Luxury', 'Premium', 'Couple', 'Relaxation']
      },
      {
        id: 'htl-goa-03',
        name: 'Zostel Goa Eco Hostel & Co-Living',
        destination: 'Goa',
        locationAddress: 'Anjuna Flea Market Road, Anjuna, Goa',
        rating: 4.4,
        reviewCount: 650,
        pricePerNight: 1200,
        roomType: 'Private Ensuite Room',
        facilities: ['Free Wi-Fi', 'Common Lounge & Rooftop Cafe', 'Bicycle Rentals', 'Co-working Desks', 'Community Events'],
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Vibrant backpacker haven close to Anjuna cliffs and cafes, ideal for young travellers, solos, and smart budget groups.',
        matchTags: ['Budget', 'Solo', 'Adventure', 'Nightlife']
      },
      {
        id: 'htl-goa-04',
        name: 'Heritage Portuguese Villa by the Bay',
        destination: 'Goa',
        locationAddress: 'Fontainhas Latin Quarter, Panaji, Goa',
        rating: 4.7,
        reviewCount: 312,
        pricePerNight: 4200,
        roomType: 'Colonial Heritage King Room',
        facilities: ['Courtyard Garden', 'Authentic Goan Breakfast', 'Vintage Decor', 'High-Speed Wi-Fi', 'Curated Heritage Walks'],
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Restored 19th-century Portuguese manor nestled in colorful cobblestone streets of Fontainhas with historic charm.',
        matchTags: ['Culture', 'Historical Places', 'Couple', 'Standard']
      },
      {
        id: 'htl-goa-05',
        name: 'Candolim Palms Boutique Hotel',
        destination: 'Goa',
        locationAddress: 'Fort Aguada Road, Candolim, Goa',
        rating: 4.5,
        reviewCount: 275,
        pricePerNight: 2800,
        roomType: 'Superior Poolside Room',
        facilities: ['Swimming Pool', 'Pool Bar', 'Free Breakfast', 'Scooter Rental Desk', '24h Front Desk'],
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Tranquil boutique stay surrounded by swaying coconut palms, just 5 minutes walk from Candolim beach.',
        matchTags: ['Standard', 'Family', 'Beach', 'Budget']
      },
      {
        id: 'htl-goa-06',
        name: 'Vagator Sunset Cliff Resort',
        destination: 'Goa',
        locationAddress: 'Little Vagator Cliffside, Ozran Beach, Goa',
        rating: 4.8,
        reviewCount: 520,
        pricePerNight: 5200,
        roomType: 'Sunset Ocean Chalet',
        facilities: ['Cliff Infinity Pool', 'Rooftop Lounge', 'Beach Trail', 'Free High-Speed Wi-Fi', 'Cocktail Bar'],
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Perched on the red cliffs of Vagator overlooking dramatic sunset vistas and acoustic DJ sessions.',
        matchTags: ['Nightlife', 'Premium', 'Adventure', 'Couple']
      },
      // Manali Hotels
      {
        id: 'htl-manali-01',
        name: 'Solang Valley Pine & Snow Resort',
        destination: 'Manali',
        locationAddress: 'Vashisht - Solang Highway, Manali',
        rating: 4.7,
        reviewCount: 410,
        pricePerNight: 3800,
        roomType: 'Himalayan Mountain View Suite',
        facilities: ['Heated Rooms', 'Bonfire & Live Barbeque', 'Free Buffet Breakfast', 'Adventure Activity Desk', 'Wi-Fi'],
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Nestled amidst cedar forests with majestic panoramic views of snow-capped peaks and valley streams.',
        matchTags: ['Mountains', 'Adventure', 'Family', 'Standard']
      },
      {
        id: 'htl-manali-02',
        name: 'The Himalayan Castle & Luxury Spa',
        destination: 'Manali',
        locationAddress: 'Hadimba Temple Road, Old Manali',
        rating: 4.9,
        reviewCount: 380,
        pricePerNight: 7800,
        roomType: 'Grand Victorian Turret Suite',
        facilities: ['Cast-Iron Fireplaces', 'Heated Outdoor Pool', 'Orchard Walks', 'Gourmet Dining', 'Full-service Spa'],
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Authentic Victorian-Gothic castle built with stone and timber overlooking apple orchards and deodar woods.',
        matchTags: ['Luxury', 'Couple', 'Mountains', 'Culture']
      },
      {
        id: 'htl-manali-03',
        name: 'Backpacker Snow Peak Chalet',
        destination: 'Manali',
        locationAddress: 'Club House Road, Old Manali',
        rating: 4.3,
        reviewCount: 290,
        pricePerNight: 1100,
        roomType: 'Wooden Cozy Double Room',
        facilities: ['Free Wi-Fi', 'Cafe with Board Games', 'Trek Guide Desk', 'Common Kitchenette'],
        imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Budget-friendly wooden lodge popular among trekkers and solo backpackers exploring Old Manali cafes.',
        matchTags: ['Budget', 'Solo', 'Trekking', 'Adventure']
      },
      {
        id: 'htl-manali-04',
        name: 'Apple Country Riverside Retreat',
        destination: 'Manali',
        locationAddress: 'Naggar Road, Manali Valley',
        rating: 4.6,
        reviewCount: 340,
        pricePerNight: 2900,
        roomType: 'Riverfront Deluxe Cottage',
        facilities: ['Riverside Lawn', 'Buffet Breakfast', 'Indoor Games', 'Fireplace', 'Travel Desk'],
        imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Serene cottages listening to the melody of Beas river flowing right beside private garden paths.',
        matchTags: ['Standard', 'Family', 'Nature', 'Relaxation']
      },
      // Jaipur Hotels
      {
        id: 'htl-jaipur-01',
        name: 'Rajputana Heritage Haveli & Palace',
        destination: 'Jaipur',
        locationAddress: 'MI Road, Near Sindhi Camp, Jaipur',
        rating: 4.6,
        reviewCount: 520,
        pricePerNight: 3200,
        roomType: 'Royal Heritage Deluxe Room',
        facilities: ['Courtyard Swimming Pool', 'Rajasthani Cultural Dance Shows', 'Rooftop Fort View Restaurant', 'Free Wi-Fi'],
        imageUrl: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Traditional 150-year-old haveli with hand-painted frescoes, brass lamps, and authentic royal hospitality.',
        matchTags: ['Historical Places', 'Culture', 'Standard', 'Family']
      },
      {
        id: 'htl-jaipur-02',
        name: 'Rambagh Royal Palace Grand',
        destination: 'Jaipur',
        locationAddress: 'Bhawani Singh Road, Jaipur',
        rating: 4.9,
        reviewCount: 940,
        pricePerNight: 12000,
        roomType: 'Palace Luxury Chamber',
        facilities: ['Peacock Gardens', 'Royal Horse Carriage Welcome', 'Butler Service', 'Historic Dining Saloon', 'Luxury Spa'],
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Former residence of the Maharaja of Jaipur, renowned as one of the finest heritage luxury hotels in the world.',
        matchTags: ['Luxury', 'Historical Places', 'Couple', 'Premium']
      },
      {
        id: 'htl-jaipur-03',
        name: 'Pink City Nomad Inn',
        destination: 'Jaipur',
        locationAddress: 'Bani Park, Collectorate Circle, Jaipur',
        rating: 4.4,
        reviewCount: 310,
        pricePerNight: 1400,
        roomType: 'Deluxe Air-Conditioned Room',
        facilities: ['Rooftop Cafe', 'High-Speed Wi-Fi', 'City Tour Desk', 'Bicycle Tours'],
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Cozy and stylish budget accommodation located in leafy Bani Park within minutes of the railway junction.',
        matchTags: ['Budget', 'Solo', 'Shopping', 'Standard']
      },
      {
        id: 'htl-jaipur-04',
        name: 'Amber Fort View Boutique Stay',
        destination: 'Jaipur',
        locationAddress: 'Amer Road, Near Jal Mahal, Jaipur',
        rating: 4.7,
        reviewCount: 280,
        pricePerNight: 3900,
        roomType: 'Jal Mahal Panorama Room',
        facilities: ['Lake & Fort View Terraces', 'Complimentary Breakfast', 'Free Wi-Fi', 'Cooking Classes'],
        imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Breathtaking lakefront boutique property overlooking the illuminated Jal Mahal and hills of Amer.',
        matchTags: ['Photography', 'Culture', 'Historical Places', 'Couple']
      },
      // Kerala & Udaipur Hotels
      {
        id: 'htl-kerala-01',
        name: 'Emerald Tea Plantation Bungalow',
        destination: 'Munnar & Alleppey',
        locationAddress: 'Chithirapuram, Munnar Hills, Kerala',
        rating: 4.8,
        reviewCount: 460,
        pricePerNight: 4100,
        roomType: 'Valley & Tea Estate Suite',
        facilities: ['Private Balcony', 'Tea Tasting Tours', 'Campfire', 'Ayurvedic Spa Treatments', 'Kerala Breakfast'],
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Colonial tea-planter retreat perched atop mist-covered valleys with rolling emerald green slopes.',
        matchTags: ['Nature', 'Relaxation', 'Couple', 'Standard']
      },
      {
        id: 'htl-kerala-02',
        name: 'Backwater Luxury Houseboat Cruise & Stay',
        destination: 'Munnar & Alleppey',
        locationAddress: 'Finishing Point Jetty, Punnamada, Alleppey',
        rating: 4.9,
        reviewCount: 580,
        pricePerNight: 7500,
        roomType: 'Private Premium AC Houseboat',
        facilities: ['Private Chef on Board', 'All Meals Included', 'Sunset Lagoon Cruise', 'AC Bedrooms', 'Traditional Kerala Feast'],
        imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Handcrafted wooden Kettuvallam gliding gently through tranquil palm canals, lagoons, and paddy fields.',
        matchTags: ['Luxury', 'Couple', 'Nature', 'Food']
      },
      {
        id: 'htl-udaipur-01',
        name: 'Lake Pichola Palace Heritage Retreat',
        destination: 'Udaipur',
        locationAddress: 'Lal Ghat, Behind Jagdish Temple, Udaipur',
        rating: 4.8,
        reviewCount: 620,
        pricePerNight: 4600,
        roomType: 'Lakeside Heritage Jharokha Room',
        facilities: ['Rooftop Dining Over Lake', 'Swimming Pool', 'Folk Music Evening', 'Free Wi-Fi', 'Boat Jetty'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'Romantic heritage hotel right on the water edge of Lake Pichola with ornate stone jharokhas and palace views.',
        matchTags: ['Historical Places', 'Couple', 'Photography', 'Culture']
      },
      {
        id: 'htl-udaipur-02',
        name: 'Taj Lake Floating Palace',
        destination: 'Udaipur',
        locationAddress: 'Island of Jag Niwas, Lake Pichola, Udaipur',
        rating: 5.0,
        reviewCount: 1120,
        pricePerNight: 16000,
        roomType: 'Historic Royal Suite with Boat Transfer',
        facilities: ['Private Island Ferry', 'Royal Spa Boat', 'Gourmet Candlelight Dining', 'Heritage Architecture'],
        imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        availabilityStatus: 'Available',
        description: 'World-famous 18th-century white marble palace appearing to float magically on the azure waters of Lake Pichola.',
        matchTags: ['Luxury', 'Couple', 'Historical Places']
      }
    ];

    this.hotels = rawHotels;

    // 4. Transport Options (25 realistic transport options across BUS, TRAIN, FLIGHT)
    this.transportOptions = [
      // Bus Options (Pune -> Goa, Mumbai -> Goa, etc.)
      {
        id: 'trn-bus-01',
        type: 'BUS',
        operatorName: 'VRL Travels Multi-Axle Volvo',
        operatorCode: 'VRL-GOA-102',
        sourceCity: 'Pune',
        destinationCity: 'Goa',
        departureTime: '08:00 PM',
        arrivalTime: '06:30 AM',
        duration: '10h 30m',
        price: 850,
        availableSeats: 16,
        rating: 4.4,
        amenities: ['AC Sleeper', 'Charging Ports', 'Water Bottle', 'Blanket', 'Live GPS Tracking']
      },
      {
        id: 'trn-bus-02',
        type: 'BUS',
        operatorName: 'KSRTC Airavat Club Class',
        operatorCode: 'KSRTC-904',
        sourceCity: 'Pune',
        destinationCity: 'Goa',
        departureTime: '09:30 PM',
        arrivalTime: '07:45 AM',
        duration: '10h 15m',
        price: 980,
        availableSeats: 22,
        rating: 4.6,
        amenities: ['Mercedes Multi-Axle', 'Emergency Call Button', 'Reading Lights', 'Pillow']
      },
      {
        id: 'trn-bus-03',
        type: 'BUS',
        operatorName: 'IntrCity SmartBus Premium',
        operatorCode: 'ICB-551',
        sourceCity: 'Pune',
        destinationCity: 'Goa',
        departureTime: '07:15 PM',
        arrivalTime: '05:45 AM',
        duration: '10h 30m',
        price: 1150,
        availableSeats: 12,
        rating: 4.7,
        amenities: ['Smart Lounges', 'Bus Captain onboard', 'Clean Linen', 'Free Wi-Fi', 'Snack Kit']
      },
      {
        id: 'trn-bus-04',
        type: 'BUS',
        operatorName: 'Zingbus Electric/Scania Semi-Sleeper',
        operatorCode: 'ZNG-204',
        sourceCity: 'Pune',
        destinationCity: 'Goa',
        departureTime: '10:00 PM',
        arrivalTime: '08:30 AM',
        duration: '10h 30m',
        price: 790,
        availableSeats: 28,
        rating: 4.3,
        amenities: ['AC Semi-Sleeper', 'Zero-Emission Segment', 'USB Ports', 'Water Bottle']
      },
      {
        id: 'trn-bus-05',
        type: 'BUS',
        operatorName: 'Himsuta Himachal Volvo',
        operatorCode: 'HRTC-110',
        sourceCity: 'Delhi',
        destinationCity: 'Manali',
        departureTime: '06:30 PM',
        arrivalTime: '08:00 AM',
        duration: '13h 30m',
        price: 1350,
        availableSeats: 18,
        rating: 4.5,
        amenities: ['Mountain Grade Heating', 'Reclining Seats', 'Blanket', 'Night halts']
      },
      {
        id: 'trn-bus-06',
        type: 'BUS',
        operatorName: 'RSRTC Goldline Express',
        operatorCode: 'RSRTC-771',
        sourceCity: 'Delhi',
        destinationCity: 'Jaipur',
        departureTime: '07:00 AM',
        arrivalTime: '12:15 PM',
        duration: '5h 15m',
        price: 490,
        availableSeats: 30,
        rating: 4.2,
        amenities: ['Air Conditioned', 'Express Highway Transit', 'Water Bottle']
      },

      // Train Options
      {
        id: 'trn-rail-01',
        type: 'TRAIN',
        operatorName: 'Vande Bharat Express (22229)',
        operatorCode: 'VB-22229',
        sourceCity: 'Pune',
        destinationCity: 'Goa',
        departureTime: '07:30 AM',
        arrivalTime: '02:30 PM',
        duration: '7h 00m',
        price: 1200,
        availableSeats: 34,
        rating: 4.8,
        amenities: ['Executive AC Chair Car', 'Rotatable Seats', 'Onboard Meals', 'Panoramic Windows', 'Bio Vacuum Toilets']
      },
      {
        id: 'trn-rail-02',
        type: 'TRAIN',
        operatorName: 'Goa Express (12780)',
        operatorCode: 'GOA-12780',
        sourceCity: 'Pune',
        destinationCity: 'Goa (Madgaon)',
        departureTime: '04:30 PM',
        arrivalTime: '05:40 AM',
        duration: '13h 10m',
        price: 680,
        availableSeats: 48,
        rating: 4.3,
        amenities: ['3rd AC / Sleeper', 'Scenic Dudhsagar Falls view', 'Pantry Car', 'Clean Bedding']
      },
      {
        id: 'trn-rail-03',
        type: 'TRAIN',
        operatorName: 'Tejas Express High-Speed (82901)',
        operatorCode: 'TEJAS-82901',
        sourceCity: 'Mumbai',
        destinationCity: 'Goa (Karmali)',
        departureTime: '05:50 AM',
        arrivalTime: '02:00 PM',
        duration: '8h 10m',
        price: 1550,
        availableSeats: 25,
        rating: 4.7,
        amenities: ['LCD Infotainment Screen', 'Catering Included', 'Automatic Plug Doors', 'Reading Light']
      },
      {
        id: 'trn-rail-04',
        type: 'TRAIN',
        operatorName: 'Jaipur Double Decker AC (12986)',
        operatorCode: 'DD-12986',
        sourceCity: 'Delhi Sarai Rohilla',
        destinationCity: 'Jaipur Junction',
        departureTime: '05:35 PM',
        arrivalTime: '10:05 PM',
        duration: '4h 30m',
        price: 540,
        availableSeats: 55,
        rating: 4.4,
        amenities: ['Double Decker AC', 'Snack Trays', 'Spacious Seating']
      },
      {
        id: 'trn-rail-05',
        type: 'TRAIN',
        operatorName: 'Kerala Superfast Express (12626)',
        operatorCode: 'KER-12626',
        sourceCity: 'Bangalore',
        destinationCity: 'Munnar & Alleppey (Ernakulam)',
        departureTime: '08:15 PM',
        arrivalTime: '06:20 AM',
        duration: '10h 05m',
        price: 1100,
        availableSeats: 30,
        rating: 4.5,
        amenities: ['2nd AC Berth', 'Bedroll provided', 'South Indian Breakfast Available']
      },

      // Flight Options
      {
        id: 'trn-air-01',
        type: 'FLIGHT',
        operatorName: 'IndiGo Airlines (6E-6184)',
        operatorCode: '6E-6184',
        sourceCity: 'Pune',
        destinationCity: 'Goa (GOX - Mopa)',
        departureTime: '10:15 AM',
        arrivalTime: '11:30 AM',
        duration: '1h 15m',
        price: 4200,
        availableSeats: 8,
        rating: 4.6,
        amenities: ['Cabin Bag 7kg + Check-in 15kg', 'Direct Non-stop', 'Quick Baggage', 'Web Check-in']
      },
      {
        id: 'trn-air-02',
        type: 'FLIGHT',
        operatorName: 'Air India Express (IX-1142)',
        operatorCode: 'IX-1142',
        sourceCity: 'Pune',
        destinationCity: 'Goa (GOI - Dabolim)',
        departureTime: '02:40 PM',
        arrivalTime: '03:55 PM',
        duration: '1h 15m',
        price: 3850,
        availableSeats: 14,
        rating: 4.4,
        amenities: ['Complimentary Hot Beverage', 'Pre-book Meals', '15kg Check-in']
      },
      {
        id: 'trn-air-03',
        type: 'FLIGHT',
        operatorName: 'Akasa Air (QP-1390)',
        operatorCode: 'QP-1390',
        sourceCity: 'Pune',
        destinationCity: 'Goa (GOX)',
        departureTime: '06:45 PM',
        arrivalTime: '08:00 PM',
        duration: '1h 15m',
        price: 3500,
        availableSeats: 19,
        rating: 4.5,
        amenities: ['Modern Boeing 737 MAX', 'Cafe Akasa Gourmet', 'USB-C Charging at every seat']
      },
      {
        id: 'trn-air-04',
        type: 'FLIGHT',
        operatorName: 'IndiGo (6E-2051)',
        operatorCode: '6E-2051',
        sourceCity: 'Delhi',
        destinationCity: 'Jaipur',
        departureTime: '09:00 AM',
        arrivalTime: '09:55 AM',
        duration: '0h 55m',
        price: 2900,
        availableSeats: 21,
        rating: 4.5,
        amenities: ['Quick Hopper flight', '7kg Cabin Bag']
      },
      {
        id: 'trn-air-05',
        type: 'FLIGHT',
        operatorName: 'SpiceJet Mountain Hopper (SG-819)',
        operatorCode: 'SG-819',
        sourceCity: 'Delhi',
        destinationCity: 'Manali (Kullu KUU)',
        departureTime: '07:20 AM',
        arrivalTime: '08:40 AM',
        duration: '1h 20m',
        price: 6500,
        availableSeats: 6,
        rating: 4.3,
        amenities: ['Turboprop Mountain Route', 'Spectacular Snow Himalayan Views']
      }
    ];

    // 5. Activities (25 activities)
    this.activities = [
      // Goa Activities
      {
        id: 'act-goa-01',
        name: 'Grand Island Scuba Diving & Dolphin Cruise',
        destination: 'Goa',
        location: 'Grand Island, Vasco Jetty, Goa',
        category: 'Adventure',
        description: 'PADI-certified underwater scuba diving with equipment, marine life exploration, underwater video/photos, and dolphin spotting tour.',
        duration: '4 Hours',
        price: 1500,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'Sunny / Clear',
        bestTimeSlot: 'Morning'
      },
      {
        id: 'act-goa-02',
        name: 'Baga & Calangute 5-in-1 Watersports Combo',
        destination: 'Goa',
        location: 'Baga Beach, North Goa',
        category: 'Adventure',
        description: 'Thrilling adventure package: Parasailing with sea dip, Jet Ski ride, Banana boat, Bumper ride, and Speedboat ride with life jackets.',
        duration: '2.5 Hours',
        price: 1800,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'Sunny',
        bestTimeSlot: 'Morning'
      },
      {
        id: 'act-goa-03',
        name: 'Fort Aguada & Lighthouse Historical Exploration',
        destination: 'Goa',
        location: 'Sinquerim, Candolim, Goa',
        category: 'Historical Places',
        description: 'Explore the iconic 17th-century Portuguese coastal fortress, freshwater spring, and historic four-storey lighthouse over the Arabian sea.',
        duration: '2 Hours',
        price: 150,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All',
        bestTimeSlot: 'Afternoon'
      },
      {
        id: 'act-goa-04',
        name: 'Mandovi River Sunset Cruise with Live Goan Folk Dance',
        destination: 'Goa',
        location: 'Santa Monica Jetty, Panaji, Goa',
        category: 'Culture',
        description: '1-hour lively catamaran cruise along the Mandovi river with traditional Fugdi & Dekhni folk performances and Bollywood DJ.',
        duration: '1.5 Hours',
        price: 500,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All',
        bestTimeSlot: 'Evening'
      },
      {
        id: 'act-goa-05',
        name: 'Sahakari Spice Farm Guided Tour & Authentic Buffet',
        destination: 'Goa',
        location: 'Ponda, Central Goa',
        category: 'Nature',
        description: 'Walk through organic vanilla, cardamom, and cinnamon groves, elephant shower experience, and authentic earthen Goan lunch.',
        duration: '3 Hours',
        price: 600,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All (Great even in Rain)',
        bestTimeSlot: 'Afternoon'
      },
      {
        id: 'act-goa-06',
        name: 'Fontainhas Heritage Latin Quarter Walking Tour',
        destination: 'Goa',
        location: 'Panaji, Goa',
        category: 'Culture',
        description: 'Stroll through pastel yellow, blue, and terracotta Portuguese homes, visit local bakeries, historic art galleries, and Azulejo tile studios.',
        duration: '2 Hours',
        price: 400,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All',
        bestTimeSlot: 'Morning'
      },
      {
        id: 'act-goa-07',
        name: 'Anjuna Night Market & Live Music Jam',
        destination: 'Goa',
        location: 'Anjuna Beach, Goa',
        category: 'Nightlife',
        description: 'Vibrant night bazaar with bohemian apparel, handcrafted jewelry, international street food stalls, and acoustic musicians.',
        duration: '3 Hours',
        price: 0,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'Clear',
        bestTimeSlot: 'Night'
      },

      // Manali Activities
      {
        id: 'act-manali-01',
        name: 'Solang Valley Paragliding & Zorbing Adventure',
        destination: 'Manali',
        location: 'Solang Valley, Manali',
        category: 'Adventure',
        description: 'Tandem paragliding glide from high mountain launchpads with professional pilot, plus giant rolling zorbing ball fun.',
        duration: '3 Hours',
        price: 2200,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'Clear & Sunny',
        bestTimeSlot: 'Morning'
      },
      {
        id: 'act-manali-02',
        name: 'Jogini Waterfall Trek through Pine Woods',
        destination: 'Manali',
        location: 'Vashisht Village, Manali',
        category: 'Trekking',
        description: 'Scenic 4km trek starting from ancient Vashisht hot water springs, winding through apple orchards to cascading mountain falls.',
        duration: '3.5 Hours',
        price: 350,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'Clear',
        bestTimeSlot: 'Morning'
      },
      {
        id: 'act-manali-03',
        name: 'Historic Hadimba Devi Wood Temple Visit',
        destination: 'Manali',
        location: 'Dhungri Van Vihar, Manali',
        category: 'Culture',
        description: 'Four-tiered wooden pagoda temple built in 1553 amidst towering deodar cedars, dedicated to Hadimba of Mahabharata lore.',
        duration: '1.5 Hours',
        price: 50,
        rating: 4.6,
        imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All',
        bestTimeSlot: 'Afternoon'
      },

      // Jaipur Activities
      {
        id: 'act-jaipur-01',
        name: 'Amer Fort Guided Elephant & Heritage Walk',
        destination: 'Jaipur',
        location: 'Deori Amer, Jaipur',
        category: 'Historical Places',
        description: 'Explore the magnificent Sheesh Mahal (Mirror Palace), Diwan-e-Aam, secret underground tunnels, and Rajput battlements.',
        duration: '3 Hours',
        price: 500,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All',
        bestTimeSlot: 'Morning'
      },
      {
        id: 'act-jaipur-02',
        name: 'Hawa Mahal Palace of Winds & Johari Bazaar Walk',
        destination: 'Jaipur',
        location: 'Badi Choupad, Pink City, Jaipur',
        category: 'Shopping',
        description: 'Marvel at 953 honeycombed jharokhas, followed by guided shopping for authentic bandhani sarees, mojaris, and gems.',
        duration: '2.5 Hours',
        price: 200,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'All',
        bestTimeSlot: 'Afternoon'
      },
      {
        id: 'act-jaipur-03',
        name: 'Nahargarh Fort Sunset View & Wax Museum',
        destination: 'Jaipur',
        location: 'Aravalli Hills, Jaipur',
        category: 'Photography',
        description: 'Watch the entire Pink City turn golden from the rugged ramparts of Nahargarh Fort, followed by Jaipur Wax Museum visit.',
        duration: '2 Hours',
        price: 250,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1592635196078-9ffc0f9976be?w=800&auto=format&fit=crop&q=80',
        suitableWeather: 'Clear',
        bestTimeSlot: 'Evening'
      }
    ];

    // 6. Restaurants (25 restaurants)
    this.restaurants = [
      // Goa Restaurants
      {
        id: 'rst-goa-01',
        name: "Britto's Beach Shack & Bakery",
        destination: 'Goa',
        cuisine: 'Goan Coastal, Seafood & Continental',
        priceRange: '₹₹ (Moderate)',
        avgPrice: 850,
        rating: 4.6,
        location: 'Baga Beach, North Goa',
        openingTime: '08:30 AM - 11:30 PM',
        popularDishes: ['Goan Prawn Curry with Rice', 'Stuffed Crab', 'Butter Garlic Calamari', 'Bebinca with Ice Cream'],
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'rst-goa-02',
        name: 'Gunpowder Heritage Coastal Kitchen',
        destination: 'Goa',
        cuisine: 'South Indian Coastal & Regional Curries',
        priceRange: '₹₹₹ (Premium)',
        avgPrice: 1200,
        rating: 4.8,
        location: 'Assagao, North Goa',
        openingTime: '12:00 PM - 11:00 PM',
        popularDishes: ['Kerela Beef Fry', 'Appam with Stew', 'Koli Prawns Curry', 'Mango Panna Cotta'],
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'rst-goa-03',
        name: 'Thalassa Greek Taverna',
        destination: 'Goa',
        cuisine: 'Mediterranean & Greek Delicacies',
        priceRange: '₹₹₹ (Premium)',
        avgPrice: 1600,
        rating: 4.7,
        location: 'Siolim Waterfront, Goa',
        openingTime: '01:00 PM - 12:00 AM',
        popularDishes: ['Souvlaki Wraps', 'Greek Salad with Feta', 'Grilled Sea Bass', 'Baklava'],
        imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'rst-goa-04',
        name: 'Fisherman’s Wharf Heritage Riverside',
        destination: 'Goa',
        cuisine: 'Traditional Goan Seafood',
        priceRange: '₹₹ (Moderate)',
        avgPrice: 950,
        rating: 4.7,
        location: 'Cavelossim, South Goa',
        openingTime: '12:00 PM - 11:00 PM',
        popularDishes: ['Fish Thali with Kingfish Fry', 'Crab Xec Xec', 'Pork Vindaloo', 'Caramel Custard'],
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'rst-goa-05',
        name: 'Burger Factory Anjuna',
        destination: 'Goa',
        cuisine: 'Gourmet Burgers, Shakes & Craft Beers',
        priceRange: '₹₹ (Moderate)',
        avgPrice: 650,
        rating: 4.7,
        location: 'Anjuna Beach Road, Goa',
        openingTime: '12:30 PM - 10:30 PM',
        popularDishes: ['Cheddar Bacon Beef Burger', 'Spinach Gorgonzola Veg Burger', 'Sweet Potato Fries'],
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
      },

      // Manali Restaurants
      {
        id: 'rst-manali-01',
        name: "Cafe 1947 by the River Beas",
        destination: 'Manali',
        cuisine: 'Italian, Woodfired Pizzas & Continental',
        priceRange: '₹₹ (Moderate)',
        avgPrice: 700,
        rating: 4.7,
        location: 'Old Manali Bridge, Manali',
        openingTime: '10:00 AM - 11:00 PM',
        popularDishes: ['Woodfired Quattro Formaggi Pizza', 'Pesto Trout', 'Hot Chocolate with Marshmallows'],
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'rst-manali-02',
        name: 'Johnson’s Cafe & Trout Bar',
        destination: 'Manali',
        cuisine: 'Fresh River Trout & European',
        priceRange: '₹₹₹ (Moderate-High)',
        avgPrice: 1100,
        rating: 4.8,
        location: 'Circuit House Road, Manali',
        openingTime: '11:00 AM - 11:00 PM',
        popularDishes: ['Almond Crusted Himalayan Trout', 'Lamb Mint Steak', 'Apple Crumble Tart'],
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
      },

      // Jaipur Restaurants
      {
        id: 'rst-jaipur-01',
        name: 'Chokhi Dhani Ethnic Village Dining',
        destination: 'Jaipur',
        cuisine: 'Authentic Royal Rajasthani Thali',
        priceRange: '₹₹ (Moderate)',
        avgPrice: 900,
        rating: 4.8,
        location: 'Tonk Road, Jaipur',
        openingTime: '05:00 PM - 11:00 PM',
        popularDishes: ['Dal Baati Churma with Ghee', 'Gatte ki Sabzi', 'Ker Sangri', 'Bajre ki Roti & Jaggery'],
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'rst-jaipur-02',
        name: '1135 AD at Amer Fort',
        destination: 'Jaipur',
        cuisine: 'Royal Mughlai & Rajputana Recipes',
        priceRange: '₹₹₹₹ (Fine Dining)',
        avgPrice: 2200,
        rating: 4.9,
        location: 'Level 2, Jalebi Chowk, Amer Fort, Jaipur',
        openingTime: '12:00 PM - 10:30 PM',
        popularDishes: ['Laal Maas', 'Murgh Badami', 'Saffron Rice', 'Rose Kulfi'],
        imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80'
      }
    ];

    // 7. Seed Demo Trip (Pune -> Goa for 3 days, 4 people, ₹40,000 budget as specified in user prompt scenario!)
    const sampleTripId = 'trip-demo-goa-001';
    this.trips.push({
      id: sampleTripId,
      userId: 'usr-student-001',
      title: 'Goa Coastal Escapade with Friends',
      startingLocation: 'Pune',
      destinationId: 'dest-goa',
      destinationName: 'Goa',
      startDate: '2026-09-25',
      endDate: '2026-09-28',
      travellersCount: 4,
      adultsCount: 4,
      childrenCount: 0,
      budgetAllocated: 40000,
      travelStyle: 'Standard',
      interests: ['Beaches', 'Food', 'Adventure', 'Photography'],
      preferredTransport: 'Bus',
      hotelPreference: 'Standard',
      foodPreference: 'Seafood',
      activityPreference: 'Balanced',
      status: 'PLANNING',
      selectedHotelId: 'htl-goa-01',
      selectedTransportId: 'trn-bus-01',
      selectedActivityIds: ['act-goa-01', 'act-goa-03', 'act-goa-04'],
      itinerary: [
        {
          dayNumber: 1,
          date: '2026-09-25',
          title: 'Arrival, Coastal Check-in & Sun-kissed Baga',
          items: [
            {
              id: 'it-1',
              timeSlot: '07:30 AM',
              period: 'Morning',
              location: 'Mapusa Bus Terminal to Resort',
              activityTitle: 'Arrival & Hotel Check-in at Sea View Resort',
              estimatedCost: 600,
              duration: '1.5 Hours',
              travelTime: '30 mins',
              notes: 'Drop luggage, freshen up, and enjoy welcome kokum juice.'
            },
            {
              id: 'it-2',
              timeSlot: '11:00 AM',
              period: 'Morning',
              location: 'Baga Beach',
              activityTitle: 'Relaxation & Baga Beach Walk',
              estimatedCost: 300,
              duration: '2 Hours',
              travelTime: '10 mins',
              notes: 'Feel the ocean breeze and coconut water.'
            },
            {
              id: 'it-3',
              timeSlot: '01:30 PM',
              period: 'Afternoon',
              location: "Britto's Beach Shack",
              activityTitle: 'Coastal Goan Seafood Lunch',
              estimatedCost: 1600,
              duration: '1.5 Hours',
              travelTime: '5 mins',
              notes: 'Prawn curry rice, kingfish fry, and chilled beverages.'
            },
            {
              id: 'it-4',
              timeSlot: '04:00 PM',
              period: 'Evening',
              location: 'Fort Aguada & Lighthouse',
              activityTitle: 'Fort Aguada Ramparts & Arabian Sea Sunset',
              estimatedCost: 600,
              duration: '2.5 Hours',
              travelTime: '25 mins',
              notes: 'Spectacular sunset photography from the Portuguese bastion.'
            },
            {
              id: 'it-5',
              timeSlot: '08:30 PM',
              period: 'Night',
              location: 'Burger Factory / Anjuna strip',
              activityTitle: 'Casual Dinner & Acoustic Music',
              estimatedCost: 1400,
              duration: '2 Hours',
              travelTime: '20 mins'
            }
          ]
        },
        {
          dayNumber: 2,
          date: '2026-09-26',
          title: 'Grand Island Underwater Adventure & Latin Quarter Walk',
          items: [
            {
              id: 'it-6',
              timeSlot: '08:00 AM',
              period: 'Morning',
              location: 'Grand Island Vasco Jetty',
              activityTitle: 'Grand Island Scuba Diving & Dolphin Cruise',
              estimatedCost: 6000,
              duration: '4 Hours',
              travelTime: '45 mins',
              notes: 'Includes instructor, underwater video, and snacks.'
            },
            {
              id: 'it-7',
              timeSlot: '01:30 PM',
              period: 'Afternoon',
              location: 'Panaji',
              activityTitle: 'Traditional Lunch at Fontainhas Bakery Cafe',
              estimatedCost: 1200,
              duration: '1.5 Hours',
              travelTime: '20 mins'
            },
            {
              id: 'it-8',
              timeSlot: '03:30 PM',
              period: 'Afternoon',
              location: 'Fontainhas Latin Quarter',
              activityTitle: 'Portuguese Heritage Street Photography',
              estimatedCost: 400,
              duration: '2 Hours',
              travelTime: '5 mins'
            },
            {
              id: 'it-9',
              timeSlot: '06:00 PM',
              period: 'Evening',
              location: 'Mandovi River Pier',
              activityTitle: 'Sunset Catamaran Cruise with Folk Dance',
              estimatedCost: 2000,
              duration: '2 Hours',
              travelTime: '15 mins'
            },
            {
              id: 'it-10',
              timeSlot: '08:30 PM',
              period: 'Night',
              location: 'Gunpowder Assagao',
              activityTitle: 'Group Feast & Cocktail Dinner',
              estimatedCost: 2400,
              duration: '2 Hours',
              travelTime: '30 mins'
            }
          ]
        },
        {
          dayNumber: 3,
          date: '2026-09-27',
          title: 'Watersports, Flea Market Souvenirs & Farewell Sunset',
          items: [
            {
              id: 'it-11',
              timeSlot: '09:00 AM',
              period: 'Morning',
              location: 'Calangute Beach Watersports Point',
              activityTitle: 'Parasailing & Jet Skiing combo',
              estimatedCost: 4800,
              duration: '2.5 Hours',
              travelTime: '15 mins'
            },
            {
              id: 'it-12',
              timeSlot: '01:00 PM',
              period: 'Afternoon',
              location: 'Fisherman’s Wharf',
              activityTitle: 'Seafood Thali Farewell Lunch',
              estimatedCost: 1800,
              duration: '1.5 Hours',
              travelTime: '20 mins'
            },
            {
              id: 'it-13',
              timeSlot: '04:00 PM',
              period: 'Evening',
              location: 'Vagator Cliff / Sunset Point',
              activityTitle: 'Sunset View & Souvenir Shopping',
              estimatedCost: 800,
              duration: '2 Hours',
              travelTime: '15 mins'
            },
            {
              id: 'it-14',
              timeSlot: '07:30 PM',
              period: 'Night',
              location: 'Hotel to Bus Stand / Airport',
              activityTitle: 'Packing, Check-out & Return Journey Departure',
              estimatedCost: 700,
              duration: '1.5 Hours',
              travelTime: '35 mins'
            }
          ]
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Seed Trip Members for collaboration demo
    this.tripMembers.push(
      {
        id: 'tm-1',
        tripId: sampleTripId,
        userId: 'usr-student-001',
        name: 'Vivek Pawar (Organizer)',
        email: 'vrpawar2004@gmail.com',
        role: 'ORGANIZER',
        joinedAt: new Date().toISOString()
      },
      {
        id: 'tm-2',
        tripId: sampleTripId,
        userId: 'usr-collab-002',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@demo.com',
        role: 'MEMBER',
        joinedAt: new Date().toISOString()
      },
      {
        id: 'tm-3',
        tripId: sampleTripId,
        userId: 'usr-collab-003',
        name: 'Ananya Verma',
        email: 'ananya.v@demo.com',
        role: 'MEMBER',
        joinedAt: new Date().toISOString()
      }
    );

    // Seed initial Votes
    this.votes.push(
      {
        id: 'vt-1',
        tripId: sampleTripId,
        userId: 'usr-student-001',
        userName: 'Vivek Pawar',
        category: 'TRANSPORT',
        optionId: 'trn-bus-01',
        optionTitle: 'VRL Travels Multi-Axle Volvo (₹850)',
        createdAt: new Date().toISOString()
      },
      {
        id: 'vt-2',
        tripId: sampleTripId,
        userId: 'usr-collab-002',
        userName: 'Aarav Sharma',
        category: 'TRANSPORT',
        optionId: 'trn-bus-01',
        optionTitle: 'VRL Travels Multi-Axle Volvo (₹850)',
        createdAt: new Date().toISOString()
      },
      {
        id: 'vt-3',
        tripId: sampleTripId,
        userId: 'usr-collab-003',
        userName: 'Ananya Verma',
        category: 'TRANSPORT',
        optionId: 'trn-rail-01',
        optionTitle: 'Vande Bharat Express (₹1,200)',
        createdAt: new Date().toISOString()
      }
    );

    // Seed sample Expenses
    this.expenses.push(
      {
        id: 'exp-1',
        tripId: sampleTripId,
        title: 'Initial Hotel Advance Deposit',
        category: 'HOTEL',
        amount: 3500,
        paidBy: 'Vivek Pawar',
        expenseDate: '2026-09-20',
        notes: 'Transferred via UPI',
        createdAt: new Date().toISOString()
      },
      {
        id: 'exp-2',
        tripId: sampleTripId,
        title: 'Return Bus Tickets for Group',
        category: 'TRANSPORT',
        amount: 3400,
        paidBy: 'Aarav Sharma',
        expenseDate: '2026-09-21',
        notes: 'Booked 4 sleeper berths',
        createdAt: new Date().toISOString()
      }
    );

    // Seed sample Bookings (Hotel, Bus, Activity)
    this.bookings.push(
      {
        id: 'HTL-2026-00124',
        pnrNumber: 'HTL-SEA00124',
        userId: 'usr-student-001',
        userName: 'Vivek Pawar',
        userEmail: 'vrpawar2004@gmail.com',
        tripId: sampleTripId,
        bookingType: 'HOTEL',
        itemId: 'htl-goa-01',
        itemTitle: 'Sea View Beach Resort & Spa',
        contactName: 'Vivek Pawar',
        contactEmail: 'vrpawar2004@gmail.com',
        contactPhone: '+91 98765 43210',
        seatsOrRooms: '1 Deluxe Sea View Room',
        startDate: '2026-09-25',
        endDate: '2026-09-28',
        passengersCount: 4,
        details: {
          hotelName: 'Sea View Beach Resort & Spa',
          roomType: 'Deluxe Sea View Room',
          checkIn: '2026-09-25',
          checkOut: '2026-09-28',
          nights: 3,
          guests: 4,
          pricePerNight: 3500,
          roomCount: 1
        },
        totalPrice: 10500,
        totalAmount: 10500,
        bookingStatus: 'CONFIRMED',
        status: 'CONFIRMED',
        qrPayload: JSON.stringify({
          ticketType: 'HOTEL_BOOKING',
          bookingId: 'HTL-2026-00124',
          hotel: 'Sea View Beach Resort & Spa',
          guest: 'Vivek Pawar',
          room: 'Deluxe Sea View Room',
          checkIn: '2026-09-25',
          checkOut: '2026-09-28',
          guests: 4,
          amount: 10500,
          status: 'CONFIRMED',
          verifiedBy: 'Agentic Travel AI QR Verification Gateway'
        }),
        createdAt: '2026-09-20T10:30:00Z'
      },
      {
        id: 'TRN-2026-00841',
        pnrNumber: 'BUS-VRL00841',
        userId: 'usr-student-001',
        userName: 'Vivek Pawar',
        userEmail: 'vrpawar2004@gmail.com',
        tripId: sampleTripId,
        bookingType: 'BUS',
        itemId: 'trn-bus-01',
        itemTitle: 'VRL Travels Multi-Axle Volvo',
        contactName: 'Vivek Pawar',
        contactEmail: 'vrpawar2004@gmail.com',
        contactPhone: '+91 98765 43210',
        seatsOrRooms: 'Seats L11, L12, U11, U12',
        startDate: '2026-09-24',
        endDate: '2026-09-25',
        passengersCount: 4,
        details: {
          operator: 'VRL Travels',
          route: 'Pune to Goa (Mopa/Mapusa)',
          travelDate: '2026-09-24',
          departureTime: '08:00 PM',
          arrivalTime: '06:30 AM',
          passengersCount: 4,
          seats: ['L11', 'L12', 'U11', 'U12'],
          passengerNames: ['Vivek Pawar', 'Aarav Sharma', 'Ananya Verma', 'Rohan K']
        },
        totalPrice: 3400,
        totalAmount: 3400,
        bookingStatus: 'CONFIRMED',
        status: 'CONFIRMED',
        qrPayload: JSON.stringify({
          ticketType: 'TRANSPORT_TICKET',
          ticketId: 'TRN-2026-00841',
          passenger: 'Vivek Pawar & 3 Guests',
          route: 'Pune -> Goa',
          operator: 'VRL Travels Multi-Axle Volvo',
          date: '2026-09-24 08:00 PM',
          seats: 'L11, L12, U11, U12',
          amount: 3400,
          status: 'CONFIRMED'
        }),
        createdAt: '2026-09-21T14:15:00Z'
      }
    );

    // Seed sample Payments
    this.payments.push(
      {
        id: 'PAY-SBX-9901',
        bookingId: 'HTL-2026-00124',
        userId: 'usr-student-001',
        amount: 10500,
        currency: 'INR',
        paymentMethod: 'UPI',
        transactionReference: 'UPI/SBX/2026/99012488',
        transactionId: 'TXN_SBX_99012488',
        paymentStatus: 'SUCCESS',
        status: 'SUCCESS',
        isSandbox: true,
        createdAt: '2026-09-20T10:31:00Z'
      },
      {
        id: 'PAY-SBX-9902',
        bookingId: 'TRN-2026-00841',
        userId: 'usr-student-001',
        amount: 3400,
        currency: 'INR',
        paymentMethod: 'CARD',
        transactionReference: 'CARD/SBX/2026/88127402',
        transactionId: 'TXN_SBX_88127402',
        paymentStatus: 'SUCCESS',
        status: 'SUCCESS',
        isSandbox: true,
        createdAt: '2026-09-21T14:16:00Z'
      }
    );

    // Seed sample Notifications
    this.notifications.push(
      {
        id: 'notif-1',
        userId: 'usr-student-001',
        title: 'Trip Initialized by AI Orchestrator',
        message: 'Trip "Goa Coastal Escapade" successfully planned with 8 specialized agents.',
        type: 'TRIP_CREATED',
        isRead: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        userId: 'usr-student-001',
        title: 'Hotel Booking Confirmed (Demo Sandbox)',
        message: 'Sea View Beach Resort & Spa booked (Booking ID: HTL-2026-00124). QR ticket generated.',
        type: 'BOOKING_CONFIRMED',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    );
  }
}

export const db = new DatabaseStore();
