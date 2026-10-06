import { DayItinerary, ItineraryItem } from '../../db/store';
import { RecommendedActivity } from './activityAgent';
import { RecommendedRestaurant } from './restaurantAgent';
import { RecommendedHotel } from './hotelAgent';

export class ItineraryAgent {
  name = 'Itinerary Agent';
  role = 'Synthesize temporal, geographic, and climatic constraints into an optimized day-wise sequence with realistic transit gaps.';

  generate(
    destinationName: string,
    startDateStr: string,
    daysCount: number,
    hotel: RecommendedHotel | null,
    activities: RecommendedActivity[],
    restaurants: RecommendedRestaurant[],
    weatherCondition: string
  ): DayItinerary[] {
    const itinerary: DayItinerary[] = [];
    const startDate = new Date(startDateStr || '2026-09-25');

    const topActivities = [...activities];
    const topRestaurants = [...restaurants];

    const hotelName = hotel ? hotel.name : 'Central Scenic Resort';

    for (let day = 1; day <= daysCount; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (day - 1));
      const dateString = currentDate.toISOString().split('T')[0];

      const items: ItineraryItem[] = [];

      if (day === 1) {
        // Day 1: Arrival, Check-in, Leisure, Sunset & Dinner
        items.push({
          id: `item-${day}-1`,
          timeSlot: '09:00 AM',
          period: 'Morning',
          location: `${hotelName}`,
          activityTitle: `Resort Arrival & Check-in at ${hotelName}`,
          estimatedCost: 0,
          duration: '1.5 Hours',
          travelTime: '30 mins transit from station/terminal',
          notes: 'Luggage drop, welcome drink, and quick freshen-up.',
        });

        const act1 = topActivities[0] || {
          name: 'Scenic Coastal Beach Walk & Promenade',
          location: 'Beachfront strip',
          price: 0,
          duration: '2 Hours',
        };

        items.push({
          id: `item-${day}-2`,
          timeSlot: '11:30 AM',
          period: 'Morning',
          location: act1.location,
          activityTitle: act1.name,
          estimatedCost: act1.price || 200,
          duration: act1.duration || '2 Hours',
          travelTime: '15 mins',
          notes: 'Enjoy the ocean air and local vibes.',
        });

        const rest1 = topRestaurants[0] || {
          name: 'Oceanfront Beach Shack',
          location: 'Coastal road',
          avgPrice: 600,
        };

        items.push({
          id: `item-${day}-3`,
          timeSlot: '01:30 PM',
          period: 'Afternoon',
          location: rest1.location,
          activityTitle: `Authentic Lunch at ${rest1.name}`,
          estimatedCost: rest1.avgPrice || 800,
          duration: '1.5 Hours',
          travelTime: '10 mins',
          notes: 'Regional specials and refreshing local beverages.',
        });

        const act2 = topActivities[1] || {
          name: 'Fort & Sunset Viewpoint Exploration',
          location: 'Historic Coastal Bastion',
          price: 150,
          duration: '2 Hours',
        };

        items.push({
          id: `item-${day}-4`,
          timeSlot: '04:30 PM',
          period: 'Evening',
          location: act2.location,
          activityTitle: act2.name,
          estimatedCost: act2.price || 150,
          duration: act2.duration || '2 Hours',
          travelTime: '20 mins',
          notes: 'Golden hour photography and sweeping panorama.',
        });

        items.push({
          id: `item-${day}-5`,
          timeSlot: '08:00 PM',
          period: 'Night',
          location: `${destinationName} Promenade / Cafe Strip`,
          activityTitle: 'Dinner & Acoustic Music Stroll',
          estimatedCost: 750,
          duration: '2 Hours',
          travelTime: '15 mins',
          notes: 'Relaxing ambiance before night rest.',
        });

        itinerary.push({
          dayNumber: day,
          date: dateString,
          title: `Arrival, Check-in & Scenic Sunset`,
          items,
        });
      } else if (day === daysCount) {
        // Final Day: Morning Excursion, Souvenirs & Departure
        const actFinal = topActivities[2] || {
          name: 'Heritage Bazaar & Artisan Souvenir Shopping',
          location: 'Old Town Market',
          price: 300,
          duration: '2.5 Hours',
        };

        items.push({
          id: `item-${day}-1`,
          timeSlot: '09:00 AM',
          period: 'Morning',
          location: actFinal.location,
          activityTitle: actFinal.name,
          estimatedCost: actFinal.price || 300,
          duration: actFinal.duration || '2 Hours',
          travelTime: '15 mins',
          notes: 'Pick up authentic local crafts and spices.',
        });

        const restFinal = topRestaurants[1] || {
          name: 'Heritage Courtyard Cafe',
          location: 'Town center',
          avgPrice: 700,
        };

        items.push({
          id: `item-${day}-2`,
          timeSlot: '12:30 PM',
          period: 'Afternoon',
          location: restFinal.location,
          activityTitle: `Farewell Lunch at ${restFinal.name}`,
          estimatedCost: restFinal.avgPrice || 700,
          duration: '1.5 Hours',
          travelTime: '10 mins',
        });

        items.push({
          id: `item-${day}-3`,
          timeSlot: '03:00 PM',
          period: 'Afternoon',
          location: `${hotelName}`,
          activityTitle: 'Hotel Check-out & Baggage Retrieval',
          estimatedCost: 0,
          duration: '1 Hour',
          travelTime: '15 mins',
          notes: 'Complete hotel checkout and verify travel tickets.',
        });

        items.push({
          id: `item-${day}-4`,
          timeSlot: '05:30 PM',
          period: 'Evening',
          location: 'Airport / Railway / Bus Terminal',
          activityTitle: 'Departure for Return Journey',
          estimatedCost: 500,
          duration: '2 Hours',
          travelTime: '40 mins',
          notes: 'Have digital QR tickets ready on phone.',
        });

        itinerary.push({
          dayNumber: day,
          date: dateString,
          title: `Cultural Shopping, Check-out & Farewell Departure`,
          items,
        });
      } else {
        // Intermediate days: Adventure & Deep Exploration
        const actExp = topActivities[(day) % topActivities.length] || {
          name: 'Adventure Tour & Excursion',
          location: 'Adventure Point',
          price: 1500,
          duration: '3.5 Hours',
        };

        items.push({
          id: `item-${day}-1`,
          timeSlot: '08:30 AM',
          period: 'Morning',
          location: actExp.location,
          activityTitle: actExp.name,
          estimatedCost: actExp.price || 1200,
          duration: actExp.duration || '3 Hours',
          travelTime: '25 mins',
          notes: 'Wear comfortable adventure gear and carry water.',
        });

        items.push({
          id: `item-${day}-2`,
          timeSlot: '01:00 PM',
          period: 'Afternoon',
          location: 'Harbor / Valley Eatery',
          activityTitle: 'Midday Coastal Feast & Tropical Refreshment',
          estimatedCost: 800,
          duration: '1.5 Hours',
          travelTime: '15 mins',
        });

        items.push({
          id: `item-${day}-3`,
          timeSlot: '03:30 PM',
          period: 'Afternoon',
          location: 'Heritage Quarter / Scenic Lookouts',
          activityTitle: 'Architectural Heritage & Walking Exploration',
          estimatedCost: 250,
          duration: '2 Hours',
          travelTime: '15 mins',
        });

        items.push({
          id: `item-${day}-4`,
          timeSlot: '06:00 PM',
          period: 'Evening',
          location: 'Sunset River Cruise / Bay Pier',
          activityTitle: 'Sunset River Cruise & Live Folk Music',
          estimatedCost: 500,
          duration: '1.5 Hours',
          travelTime: '20 mins',
        });

        items.push({
          id: `item-${day}-5`,
          timeSlot: '08:30 PM',
          period: 'Night',
          location: 'Gourmet Alfresco Garden',
          activityTitle: 'Night Gastronomic Dinner & Group Social',
          estimatedCost: 1100,
          duration: '2 Hours',
          travelTime: '20 mins',
        });

        itinerary.push({
          dayNumber: day,
          date: dateString,
          title: `Active Adventure, Culture & Evening Cruise`,
          items,
        });
      }
    }

    return itinerary;
  }
}
