import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Compass,
  Bus,
  Train,
  Plane,
  Hotel,
  Utensils,
  Sun,
  CloudRain,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookmarkPlus,
  Share2,
  Plus,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  OrchestratedPlan,
  HotelItem,
  TransportItem,
  ActivityItem,
  RestaurantItem,
  ItinerarySlotItem,
} from '../types';
import { api } from '../services/api';

interface AiPlannerTabProps {
  plan: OrchestratedPlan | null;
  onPlanGenerated: (newPlan: OrchestratedPlan) => void;
  onOpenPipelineModal: () => void;
  onInitiateBooking: (payload: any) => void;
  onSaveTrip: (plan: OrchestratedPlan) => void;
}

export const AiPlannerTab: React.FC<AiPlannerTabProps> = ({
  plan,
  onPlanGenerated,
  onOpenPipelineModal,
  onInitiateBooking,
  onSaveTrip,
}) => {
  // Form State
  const [startingLocation, setStartingLocation] = useState('Pune');
  const [destination, setDestination] = useState('Goa');
  const [startDate, setStartDate] = useState('2026-09-25');
  const [endDate, setEndDate] = useState('2026-09-28');
  const [travellersCount, setTravellersCount] = useState(4);
  const [budget, setBudget] = useState(40000);
  const [travelStyle, setTravelStyle] = useState('Standard');
  const [preferredTransport, setPreferredTransport] = useState('Any');
  const [interests, setInterests] = useState<string[]>(['Beaches', 'Water Sports', 'Food', 'Culture']);

  const [loading, setLoading] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('02:00 PM');
  const [newActivityLocation, setNewActivityLocation] = useState('Local Sightseeing');
  const [newActivityCost, setNewActivityCost] = useState(500);

  const availableInterests = [
    'Beaches',
    'Water Sports',
    'Culture & Heritage',
    'Food & Nightlife',
    'Trekking & Hills',
    'Photography',
    'Relaxation & Spa',
    'Wildlife & Nature',
  ];

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleRunOrchestrator = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCurrentStepText('Initializing Master AI Orchestrator & Task Decomposition...');

    // Simulate multi-agent steps feedback for UX
    setTimeout(() => setCurrentStepText('Agent 1/8: Destination Agent validating geographic highlights...'), 400);
    setTimeout(() => setCurrentStepText('Agent 2/8: Weather Agent verifying precipitation & seasonal advisory...'), 900);
    setTimeout(() => setCurrentStepText('Agent 3/8: Hotel Agent filtering rooms within 35% budget threshold...'), 1400);
    setTimeout(() => setCurrentStepText('Agent 4/8: Transport Agent comparing Bus, Train, and Flight transit...'), 1900);
    setTimeout(() => setCurrentStepText('Agent 5/8: Activity & Restaurant Agents curating high-affinity venues...'), 2400);
    setTimeout(() => setCurrentStepText('Agent 7/8: Budget Agent enforcing financial constraints...'), 2800);
    setTimeout(() => setCurrentStepText('Agent 8/8: Itinerary Agent sequencing day-wise temporal slots...'), 3200);

    try {
      const generatedPlan = await api.generateAiPlan({
        startingLocation,
        destination,
        startDate,
        endDate,
        travellersCount,
        budget,
        travelStyle,
        interests,
        preferredTransport,
        hotelPreference: travelStyle,
        foodPreference: 'Any',
        activityPreference: 'Balanced',
      });

      onPlanGenerated(generatedPlan);
      setActiveDayTab(1);
    } catch (err: any) {
      alert(`AI Orchestration error: ${err.message}`);
    } finally {
      setLoading(false);
      setCurrentStepText('');
    }
  };

  const handleAddCustomActivity = () => {
    if (!plan || !newActivityTitle) return;
    const targetDay = plan.itinerary.find((d) => d.dayNumber === activeDayTab);
    if (targetDay) {
      targetDay.items.push({
        id: `custom-${Date.now()}`,
        timeSlot: newActivityTime,
        period: 'Afternoon',
        location: newActivityLocation,
        activityTitle: newActivityTitle,
        estimatedCost: Number(newActivityCost) || 0,
        duration: '1.5 Hours',
        travelTime: '15 mins',
        notes: 'Custom traveler scheduled excursion.',
      });
      // Re-trigger render
      onPlanGenerated({ ...plan });
      setShowAddActivityModal(false);
      setNewActivityTitle('');
    }
  };

  const handleDeleteActivity = (dayNumber: number, itemId: string) => {
    if (!plan) return;
    const targetDay = plan.itinerary.find((d) => d.dayNumber === dayNumber);
    if (targetDay) {
      targetDay.items = targetDay.items.filter((item) => item.id !== itemId);
      onPlanGenerated({ ...plan });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Search & Planner Control Center */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent AI Recommendation & Travel Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
              Plan Your Collaborative Journey
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Define constraints below. The 8-agent coordinator will balance transit, stay, weather, and budget in parallel.
            </p>
          </div>

          {plan && (
            <button
              id="inspect-architecture-btn"
              onClick={onOpenPipelineModal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Inspect Multi-Agent Execution Trace (8 Agents)</span>
            </button>
          )}
        </div>

        {/* Planning Form */}
        <form onSubmit={handleRunOrchestrator} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origin */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Starting Location (Origin)
              </label>
              <input
                id="planner-origin-input"
                type="text"
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                placeholder="e.g. Pune / Mumbai"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <Compass className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Destination City / Region
              </label>
              <input
                id="planner-destination-input"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Goa / Manali / Jaipur"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Departure Date
              </label>
              <input
                id="planner-startdate-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Return Date
              </label>
              <input
                id="planner-enddate-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Travellers Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <Users className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Total Travellers
              </label>
              <select
                id="planner-travellers-select"
                value={travellersCount}
                onChange={(e) => setTravellersCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>1 Solo Traveller</option>
                <option value={2}>2 Travellers (Couple / Duo)</option>
                <option value={4}>4 Travellers (Friends / Group)</option>
                <option value={6}>6 Travellers (Family / Group)</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                  Planned Budget (INR)
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400">₹{budget.toLocaleString('en-IN')}</span>
              </div>
              <input
                id="planner-budget-range"
                type="range"
                min={15000}
                max={150000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <Compass className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Travel Style
              </label>
              <select
                id="planner-style-select"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Budget">Budget Backpacker</option>
                <option value="Standard">Standard / Balanced</option>
                <option value="Luxury">Luxury & Heritage</option>
                <option value="Adventure">Adventure & Watersports</option>
              </select>
            </div>

            {/* Preferred Transport */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
                <Train className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                Preferred Transport
              </label>
              <select
                id="planner-transport-select"
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Any">Any Optimal Modality</option>
                <option value="Bus">Volvo Sleeper Bus</option>
                <option value="Train">High-Speed Train / Express</option>
                <option value="Flight">Commercial Flight</option>
              </select>
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Primary Trip Interests & Priorities
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Orchestrates Destination, Weather, Hotel, Transport, Activity, Dining & Budget Agents</span>
            </div>

            <button
              id="run-ai-orchestrator-btn"
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{currentStepText || 'Orchestrating Specialized Agents...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Multi-Agent Travel Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* Plan Dashboard Output */}
      {plan && (
        <div className="space-y-8">
          {/* Top Banner: Executive Summary & Gemini AI Synthesis */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                    SYNTHESIZED ITINERARY
                  </span>
                  <span className="text-xs text-slate-400">
                    Generated: {new Date(plan.generatedAt).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
                  {plan.summary.tripTitle}
                </h3>
                <p className="text-sm text-cyan-200/90 font-medium">
                  {plan.summary.route} • {plan.summary.durationDays} Days / {plan.summary.durationDays - 1} Nights • {plan.summary.travellers} Travellers
                </p>
                {plan.geminiEnhancedNotes && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200 text-xs leading-relaxed mt-3">
                    <strong className="text-cyan-300 block mb-1">🤖 Gemini AI Executive Insights:</strong>
                    {plan.geminiEnhancedNotes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  id="save-trip-btn"
                  onClick={() => onSaveTrip(plan)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-2 transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4 text-cyan-400" />
                  <span>Save Trip to Profile</span>
                </button>
                <button
                  id="view-agent-trace-btn"
                  onClick={onOpenPipelineModal}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center space-x-2 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>Inspect Agent Log ({plan.agentExecutionTrace.length} Steps)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid Row: Weather Advisory & Financial Constraint Satisfaction */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weather Agent Card (Col 1-5) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <h4 className="text-base font-bold text-white font-['Outfit']">Weather Agent Advisory</h4>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/30">
                    {plan.destination.destination.name}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl font-black text-white font-mono">
                    {plan.weather.temperatureCelsius}°C
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{plan.weather.condition}</div>
                    <div className="text-xs text-slate-400 flex items-center mt-0.5">
                      <CloudRain className="w-3.5 h-3.5 text-blue-400 mr-1" />
                      Rain Probability: {plan.weather.rainProbability}%
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-850 mb-4">
                  {plan.weather.advisory}
                </p>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Agent Recommended Pack List:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.weather.recommendedPackList.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Agent Card (Col 6-12) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold text-white font-['Outfit']">
                    Budget Agent Financial Breakdown
                  </h4>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    plan.budget.isOverBudget
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {plan.budget.isOverBudget ? 'Budget Exceeded' : 'Within Allocation'}
                </span>
              </div>

              {/* Financial Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400 uppercase">Allocated Budget</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    ₹{plan.budget.allocatedBudget.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400 uppercase">Total Estimated</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                    ₹{plan.budget.totalEstimated.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400 uppercase">Remaining Buffer</div>
                  <div
                    className={`text-lg font-bold font-mono mt-0.5 ${
                      plan.budget.remainingBudget >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    ₹{plan.budget.remainingBudget.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Expense Allocation Stack Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Hotel: ₹{plan.budget.hotel.toLocaleString('en-IN')}</span>
                  <span>Transport: ₹{plan.budget.transport.toLocaleString('en-IN')}</span>
                  <span>Food: ₹{plan.budget.food.toLocaleString('en-IN')}</span>
                  <span>Activities: ₹{plan.budget.activities.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-3 w-full bg-slate-850 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (plan.budget.hotel / plan.budget.totalEstimated) * 100)}%` }}
                    className="bg-blue-500"
                    title="Hotel"
                  />
                  <div
                    style={{ width: `${Math.min(100, (plan.budget.transport / plan.budget.totalEstimated) * 100)}%` }}
                    className="bg-cyan-500"
                    title="Transport"
                  />
                  <div
                    style={{ width: `${Math.min(100, (plan.budget.food / plan.budget.totalEstimated) * 100)}%` }}
                    className="bg-amber-500"
                    title="Food"
                  />
                  <div
                    style={{ width: `${Math.min(100, (plan.budget.activities / plan.budget.totalEstimated) * 100)}%` }}
                    className="bg-emerald-500"
                    title="Activities"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                {plan.budget.statusMessage}
              </div>

              {plan.budget.alternativesAdvice && plan.budget.alternativesAdvice.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200 space-y-1">
                  <strong className="block text-amber-300">💡 Budget Agent Trade-off Recommendations:</strong>
                  {plan.budget.alternativesAdvice.map((adv, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5">
                      <span>•</span>
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Hotel & Multimodal Transport Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Hotel Pick */}
            {plan.hotels.topPick && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-base font-bold text-white font-['Outfit']">
                      Hotel Agent Top Recommendation
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                    <span>AI Score: {plan.hotels.topPick.aiScore}/100</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={plan.hotels.topPick.imageUrl}
                    alt={plan.hotels.topPick.name}
                    className="w-full sm:w-44 h-32 rounded-2xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-base font-bold text-white truncate">{plan.hotels.topPick.name}</h5>
                    <p className="text-xs text-slate-400 truncate">{plan.hotels.topPick.locationAddress}</p>
                    <div className="flex items-center space-x-3 my-2 text-xs">
                      <span className="text-amber-400 font-bold">★ {plan.hotels.topPick.rating}</span>
                      <span className="text-slate-400 font-mono">
                        ₹{plan.hotels.topPick.pricePerNight.toLocaleString('en-IN')}/night
                      </span>
                      <span className="text-emerald-400">Available</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-850">
                      <strong>Why Recommended:</strong> {plan.hotels.topPick.whyRecommended}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Total stay cost: <strong className="text-white font-mono">₹{(plan.hotels.topPick.pricePerNight * (plan.summary.durationDays - 1)).toLocaleString('en-IN')}</strong>
                  </div>
                  <button
                    id="book-top-hotel-btn"
                    onClick={() =>
                      onInitiateBooking({
                        bookingType: 'HOTEL',
                        itemId: plan.hotels.topPick!.id,
                        itemTitle: plan.hotels.topPick!.name,
                        itemSubtitle: plan.hotels.topPick!.roomType,
                        startDate: plan.summary.dates.split(' to ')[0],
                        endDate: plan.summary.dates.split(' to ')[1],
                        passengersCount: plan.summary.travellers,
                        unitPrice: plan.hotels.topPick!.pricePerNight,
                        totalPrice: plan.hotels.topPick!.pricePerNight * (plan.summary.durationDays - 1),
                        seatsOrRooms: `${plan.hotels.topPick!.roomType} (${plan.summary.durationDays - 1} Nights)`,
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                  >
                    <span>Instant Reserve Hotel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Top Transport Pick */}
            {plan.transport.recommendedOverall && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Train className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-base font-bold text-white font-['Outfit']">
                      Transport Agent Optimal Route
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                    <span>AI Score: {plan.transport.recommendedOverall.aiScore}/100</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/20 text-indigo-300">
                        {plan.transport.recommendedOverall.type}
                      </span>
                      <h5 className="text-sm font-bold text-white mt-1">
                        {plan.transport.recommendedOverall.operatorName}
                      </h5>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-cyan-400 font-mono">
                        ₹{plan.transport.recommendedOverall.price.toLocaleString('en-IN')}/person
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Total: ₹{plan.transport.recommendedOverall.totalGroupCost?.toLocaleString('en-IN')} for {plan.summary.travellers} pax
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>Departs: <strong>{plan.transport.recommendedOverall.departureTime}</strong></span>
                    <span className="text-slate-500">Duration: {plan.transport.recommendedOverall.duration}</span>
                    <span>Arrives: <strong>{plan.transport.recommendedOverall.arrivalTime}</strong></span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                    <strong>Why Recommended:</strong> {plan.transport.recommendedOverall.whyRecommended}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Confirmed seats: <strong className="text-emerald-400">{plan.transport.recommendedOverall.availableSeats} available</strong>
                  </div>
                  <button
                    id="book-top-transit-btn"
                    onClick={() =>
                      onInitiateBooking({
                        bookingType: plan.transport.recommendedOverall!.type,
                        itemId: plan.transport.recommendedOverall!.id,
                        itemTitle: `${plan.transport.recommendedOverall!.operatorName} (${plan.transport.recommendedOverall!.type})`,
                        itemSubtitle: `${plan.transport.recommendedOverall!.sourceCity} ➔ ${plan.transport.recommendedOverall!.destinationCity}`,
                        startDate: plan.summary.dates.split(' to ')[0],
                        endDate: plan.summary.dates.split(' to ')[0],
                        passengersCount: plan.summary.travellers,
                        unitPrice: plan.transport.recommendedOverall!.price,
                        totalPrice: plan.transport.recommendedOverall!.price * plan.summary.travellers,
                        seatsOrRooms: `${plan.summary.travellers} Confirmed Seats`,
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors flex items-center space-x-1.5"
                  >
                    <span>Instant Reserve Transit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Day-Wise Itinerary */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Itinerary Agent Multi-Day Temporal Schedule</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  Interactive Day-by-Day Schedule
                </h3>
              </div>

              {/* Day Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                {plan.itinerary.map((day) => (
                  <button
                    key={day.dayNumber}
                    id={`day-tab-${day.dayNumber}`}
                    onClick={() => setActiveDayTab(day.dayNumber)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeDayTab === day.dayNumber
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    DAY {day.dayNumber} ({day.date})
                  </button>
                ))}
              </div>
            </div>

            {/* Active Day Cards */}
            {(() => {
              const currentDay = plan.itinerary.find((d) => d.dayNumber === activeDayTab) || plan.itinerary[0];
              if (!currentDay) return null;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Day {currentDay.dayNumber}: {currentDay.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {currentDay.items.length} scheduled intervals • Geographically optimized routing
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddActivityModal(true)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Activity</span>
                    </button>
                  </div>

                  {/* Day Slot Items List */}
                  <div className="space-y-3">
                    {currentDay.items.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3.5">
                          <div className="w-20 shrink-0 text-center py-2 px-2.5 bg-slate-900 rounded-xl border border-slate-800">
                            <span className="text-xs font-mono font-bold text-cyan-400 block">
                              {slot.timeSlot}
                            </span>
                            <span className="text-[10px] text-slate-400 block uppercase">
                              {slot.period}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-white">{slot.activityTitle}</h5>
                            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 text-cyan-400 mr-1" />
                                {slot.location}
                              </span>
                              <span>• Duration: {slot.duration}</span>
                              <span>• Transit: {slot.travelTime}</span>
                            </div>
                            {slot.notes && (
                              <p className="text-[11px] text-slate-400 mt-1.5 italic bg-slate-900/60 px-2.5 py-1 rounded">
                                📌 {slot.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 self-end sm:self-center shrink-0">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-slate-200">
                              {slot.estimatedCost > 0 ? `₹${slot.estimatedCost.toLocaleString('en-IN')}` : 'Included'}
                            </div>
                            <div className="text-[10px] text-slate-500">Estimated Cost</div>
                          </div>
                          <button
                            onClick={() => handleDeleteActivity(currentDay.dayNumber, slot.id)}
                            title="Remove from itinerary"
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </section>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Add Custom Activity to Day {activeDayTab}</h4>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Activity Name</label>
              <input
                type="text"
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                placeholder="e.g. Scuba Diving at Grand Island"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Time Slot</label>
                <input
                  type="text"
                  value={newActivityTime}
                  onChange={(e) => setNewActivityTime(e.target.value)}
                  placeholder="03:00 PM"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Estimated Cost (INR)</label>
                <input
                  type="number"
                  value={newActivityCost}
                  onChange={(e) => setNewActivityCost(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Location / Venue</label>
              <input
                type="text"
                value={newActivityLocation}
                onChange={(e) => setNewActivityLocation(e.target.value)}
                placeholder="e.g. Baga Beach Watersport Dock"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="px-4 py-2 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomActivity}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Add to Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
