import React, { useState, useEffect } from 'react';
import {
  Search,
  Hotel,
  Bus,
  Train,
  Plane,
  Compass,
  Utensils,
  Star,
  MapPin,
  Clock,
  Filter,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { HotelItem, TransportItem, ActivityItem, RestaurantItem } from '../types';
import { api } from '../services/api';

interface ExploreTabProps {
  onInitiateBooking: (payload: any) => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({ onInitiateBooking }) => {
  const [activeCategory, setActiveCategory] = useState<'HOTEL' | 'TRANSPORT' | 'ACTIVITY' | 'RESTAURANT'>('HOTEL');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [selectedDestination, setSelectedDestination] = useState<string>('ALL');

  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [transports, setTransports] = useState<TransportItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeCategory, selectedDestination]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeCategory === 'HOTEL') {
        const data = await api.getHotels(selectedDestination !== 'ALL' ? { destination: selectedDestination } : undefined);
        setHotels(data);
      } else if (activeCategory === 'TRANSPORT') {
        const data = await api.getTransport(selectedDestination !== 'ALL' ? { destination: selectedDestination } : undefined);
        setTransports(data);
      } else if (activeCategory === 'ACTIVITY') {
        const data = await api.getActivities(selectedDestination !== 'ALL' ? { destination: selectedDestination } : undefined);
        setActivities(data);
      } else if (activeCategory === 'RESTAURANT') {
        const data = await api.getRestaurants(selectedDestination !== 'ALL' ? { destination: selectedDestination } : undefined);
        setRestaurants(data);
      }
    } catch (err) {
      console.error('Failed to load explore data:', err);
    } finally {
      setLoading(false);
    }
  };

  const destinations = ['ALL', 'Goa', 'Manali', 'Jaipur', 'Kerala', 'Udaipur', 'Ladakh'];

  // Filter items based on search and maxPrice
  const filteredHotels = hotels.filter(
    (h) =>
      (h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.destination.toLowerCase().includes(searchQuery.toLowerCase())) &&
      h.pricePerNight <= maxPrice
  );

  const filteredTransports = transports.filter(
    (t) =>
      (t.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destinationCity.toLowerCase().includes(searchQuery.toLowerCase())) &&
      t.price <= maxPrice
  );

  const filteredActivities = activities.filter(
    (a) =>
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
      a.price <= maxPrice
  );

  const filteredRestaurants = restaurants.filter(
    (r) =>
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) &&
      r.avgPrice <= maxPrice
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Category Tabs & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">
              Explore Verified Travel Inventory
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live catalog integrated with MySQL relational schema and Multi-Agent scoring
            </p>
          </div>

          {/* Category Toggle Buttons */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            {[
              { id: 'HOTEL', label: 'Hotels', icon: Hotel },
              { id: 'TRANSPORT', label: 'Transport', icon: Train },
              { id: 'ACTIVITY', label: 'Activities', icon: Compass },
              { id: 'RESTAURANT', label: 'Dining', icon: Utensils },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSel = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSel
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 border-t border-slate-800">
          {/* Search Query */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeCategory.toLowerCase()} by name, destination, or tags...`}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Destination Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d === 'ALL' ? 'All Destinations' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div className="sm:col-span-3 flex flex-col justify-center">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Max Price</span>
              <strong className="text-cyan-400 font-mono">₹{maxPrice.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              min={500}
              max={30000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid Content List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading catalog items from platform database...</p>
        </div>
      ) : (
        <>
          {/* Hotels Grid */}
          {activeCategory === 'HOTEL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((h) => (
                <div
                  key={h.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={h.imageUrl}
                        alt={h.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center space-x-1 border border-amber-500/30">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{h.rating} ({h.reviewCount})</span>
                      </div>
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-xs font-medium border border-slate-700">
                        {h.destination}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-base font-bold text-white">{h.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400 mr-1 shrink-0" />
                          <span className="truncate">{h.locationAddress}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">{h.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {h.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-850 text-[10px] text-slate-300 border border-slate-750"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-2">
                    <div>
                      <div className="text-base font-black text-cyan-400 font-mono">
                        ₹{h.pricePerNight.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">per night • {h.roomType}</div>
                    </div>
                    <button
                      onClick={() =>
                        onInitiateBooking({
                          bookingType: 'HOTEL',
                          itemId: h.id,
                          itemTitle: h.name,
                          itemSubtitle: h.roomType,
                          startDate: '2026-09-25',
                          endDate: '2026-09-28',
                          passengersCount: 2,
                          unitPrice: h.pricePerNight,
                          totalPrice: h.pricePerNight * 3,
                          seatsOrRooms: '1 Deluxe Room (3 Nights)',
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Transport Grid */}
          {activeCategory === 'TRANSPORT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTransports.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {t.type}
                        </span>
                        <h4 className="text-base font-bold text-white">{t.operatorName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-cyan-400 font-mono">
                          ₹{t.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">per passenger</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{t.departureTime}</div>
                        <div className="text-[11px] text-slate-400">{t.sourceCity}</div>
                      </div>
                      <div className="text-center text-slate-500 text-[10px]">
                        <div>{t.duration}</div>
                        <div className="w-16 h-0.5 bg-slate-700 my-1 mx-auto" />
                        <div>Direct</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">{t.arrivalTime}</div>
                        <div className="text-[11px] text-slate-400">{t.destinationCity}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {t.amenities.map((a, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300"
                        >
                          • {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-medium">
                      ✓ {t.availableSeats} confirmed seats available
                    </span>
                    <button
                      onClick={() =>
                        onInitiateBooking({
                          bookingType: t.type,
                          itemId: t.id,
                          itemTitle: `${t.operatorName} (${t.type})`,
                          itemSubtitle: `${t.sourceCity} to ${t.destinationCity}`,
                          startDate: '2026-09-25',
                          endDate: '2026-09-25',
                          passengersCount: 2,
                          unitPrice: t.price,
                          totalPrice: t.price * 2,
                          seatsOrRooms: '2 Confirmed Seats',
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                    >
                      <span>Book Transit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities Grid */}
          {activeCategory === 'ACTIVITY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={act.imageUrl}
                        alt={act.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-cyan-300 text-[11px] font-semibold border border-slate-700">
                        {act.category}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-slate-700">
                        ★ {act.rating}
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <h4 className="text-base font-bold text-white">{act.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center">
                        <MapPin className="w-3 h-3 text-cyan-400 mr-1 shrink-0" />
                        <span>{act.location} ({act.destination})</span>
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-2">{act.description}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                        <span>Duration: {act.duration}</span>
                        <span>• Best Slot: {act.bestTimeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800 flex items-center justify-between mt-2">
                    <div>
                      <div className="text-base font-bold text-cyan-400 font-mono">
                        ₹{act.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">per person ticket</div>
                    </div>
                    <button
                      onClick={() =>
                        onInitiateBooking({
                          bookingType: 'ACTIVITY',
                          itemId: act.id,
                          itemTitle: act.name,
                          itemSubtitle: `${act.category} • ${act.destination}`,
                          startDate: '2026-09-26',
                          endDate: '2026-09-26',
                          passengersCount: 2,
                          unitPrice: act.price,
                          totalPrice: act.price * 2,
                          seatsOrRooms: '2 Entry Passes',
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                    >
                      <span>Book Pass</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Restaurants Grid */}
          {activeCategory === 'RESTAURANT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((rst) => (
                <div
                  key={rst.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={rst.imageUrl}
                        alt={rst.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-slate-700">
                        {rst.cuisine}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-slate-700">
                        ★ {rst.rating}
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <h4 className="text-base font-bold text-white">{rst.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center">
                        <MapPin className="w-3 h-3 text-cyan-400 mr-1 shrink-0" />
                        <span>{rst.location} ({rst.destination})</span>
                      </p>
                      <div className="text-xs text-slate-300">
                        <strong className="text-slate-400 block mb-1">Famous Regional Delights:</strong>
                        <div className="flex flex-wrap gap-1">
                          {rst.popularDishes.map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-cyan-200">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800 flex items-center justify-between mt-2">
                    <div>
                      <div className="text-base font-bold text-cyan-400 font-mono">
                        ~₹{rst.avgPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">average spend per meal</div>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">Walk-ins / Table Open</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
