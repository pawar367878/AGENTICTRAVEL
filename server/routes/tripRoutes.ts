import { Router, Request, Response } from 'express';
import { db, Trip, TripMember, Vote } from '../db/store';
import { getUserFromAuthHeader } from './authRoutes';

export const tripRouter = Router();

// GET /api/trips (List trips for user)
tripRouter.get('/', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const userId = user ? user.id : 'usr-student-001';

  // Find trips created by user or where user is a group member
  const memberTripIds = db.tripMembers
    .filter((m) => m.userId === userId || (user && m.email === user.email))
    .map((m) => m.tripId);

  const trips = db.trips.filter((t) => t.userId === userId || memberTripIds.includes(t.id));
  return res.json(trips);
});

// POST /api/trips (Create trip)
tripRouter.post('/', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const userId = user ? user.id : 'usr-student-001';
  const userName = user ? user.name : 'Vivek Pawar';

  const {
    title,
    startingLocation,
    destinationName,
    startDate,
    endDate,
    travellersCount,
    adultsCount,
    childrenCount,
    budgetAllocated,
    travelStyle,
    interests,
    preferredTransport,
    hotelPreference,
    foodPreference,
    activityPreference,
    selectedHotelId,
    selectedTransportId,
    selectedActivityIds,
    itinerary,
  } = req.body;

  if (!startingLocation || !destinationName || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing mandatory trip parameters.' });
  }

  const tripId = `trip-${Date.now().toString(36)}`;
  const dest = db.destinations.find(
    (d) => d.name.toLowerCase() === destinationName.toLowerCase()
  ) || db.destinations[0];

  const newTrip: Trip = {
    id: tripId,
    userId,
    title: title || `${destinationName} ${travelStyle || 'Travel'} Trip`,
    startingLocation,
    destinationId: dest.id,
    destinationName: dest.name,
    startDate,
    endDate,
    travellersCount: Number(travellersCount) || 1,
    adultsCount: Number(adultsCount) || 1,
    childrenCount: Number(childrenCount) || 0,
    budgetAllocated: Number(budgetAllocated) || 30000,
    travelStyle: travelStyle || 'Standard',
    interests: interests || ['Beaches', 'Food'],
    preferredTransport: preferredTransport || 'Any',
    hotelPreference: hotelPreference || 'Standard',
    foodPreference: foodPreference || 'Any',
    activityPreference: activityPreference || 'Balanced',
    status: 'PLANNING',
    selectedHotelId,
    selectedTransportId,
    selectedActivityIds,
    itinerary: itinerary || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.trips.unshift(newTrip);

  // Add creator as organizer
  db.tripMembers.push({
    id: `tm-${Date.now()}`,
    tripId,
    userId,
    name: `${userName} (Organizer)`,
    email: user ? user.email : 'vrpawar2004@gmail.com',
    role: 'ORGANIZER',
    joinedAt: new Date().toISOString(),
  });

  // Notification
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId,
    title: 'Trip Created',
    message: `Trip "${newTrip.title}" has been saved with Multi-Agent itinerary.`,
    type: 'TRIP_CREATED',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json(newTrip);
});

// GET /api/trips/:id (Get single trip with members, votes, expenses)
tripRouter.get('/:id', (req: Request, res: Response) => {
  const trip = db.trips.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const members = db.tripMembers.filter((m) => m.tripId === trip.id);
  const votes = db.votes.filter((v) => v.tripId === trip.id);
  const expenses = db.expenses.filter((e) => e.tripId === trip.id);
  const bookings = db.bookings.filter((b) => b.tripId === trip.id);

  return res.json({
    trip,
    members,
    votes,
    expenses,
    bookings,
  });
});

// PUT /api/trips/:id
tripRouter.put('/:id', (req: Request, res: Response) => {
  const trip = db.trips.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const {
    title,
    status,
    budgetAllocated,
    selectedHotelId,
    selectedTransportId,
    selectedActivityIds,
    itinerary,
  } = req.body;

  if (title) trip.title = title;
  if (status) trip.status = status;
  if (budgetAllocated) trip.budgetAllocated = Number(budgetAllocated);
  if (selectedHotelId !== undefined) trip.selectedHotelId = selectedHotelId;
  if (selectedTransportId !== undefined) trip.selectedTransportId = selectedTransportId;
  if (selectedActivityIds !== undefined) trip.selectedActivityIds = selectedActivityIds;
  if (itinerary !== undefined) trip.itinerary = itinerary;
  trip.updatedAt = new Date().toISOString();

  return res.json({ message: 'Trip updated successfully.', trip });
});

// DELETE /api/trips/:id
tripRouter.delete('/:id', (req: Request, res: Response) => {
  const index = db.trips.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  db.trips.splice(index, 1);
  return res.json({ message: 'Trip deleted successfully.' });
});

// POST /api/trips/:id/invite (Invite group member)
tripRouter.post('/:id/invite', (req: Request, res: Response) => {
  const trip = db.trips.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Member name and email are required.' });
  }

  const existing = db.tripMembers.find(
    (m) => m.tripId === trip.id && m.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return res.status(409).json({ error: 'Member already in this group trip.' });
  }

  const newMember: TripMember = {
    id: `tm-${Date.now()}`,
    tripId: trip.id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: 'MEMBER',
    joinedAt: new Date().toISOString(),
  };

  db.tripMembers.push(newMember);

  // Notification for trip owner
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: trip.userId,
    title: 'Group Member Joined',
    message: `${newMember.name} (${newMember.email}) was added to ${trip.title}.`,
    type: 'GROUP_INVITE',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ message: 'Member invited successfully.', member: newMember });
});

// POST /api/trips/:id/vote (Vote for hotel, transport, or activity)
tripRouter.post('/:id/vote', (req: Request, res: Response) => {
  const user = getUserFromAuthHeader(req);
  const trip = db.trips.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const { category, optionId, optionTitle, voterName } = req.body;
  if (!category || !optionId || !optionTitle) {
    return res.status(400).json({ error: 'Category, optionId and optionTitle are required.' });
  }

  const userId = user ? user.id : `guest-${Date.now().toString(36)}`;
  const userName = user ? user.name : (voterName || 'Travel Buddy');

  // Check if voter already voted for this category
  const existingVoteIndex = db.votes.findIndex(
    (v) => v.tripId === trip.id && v.userId === userId && v.category === category
  );

  if (existingVoteIndex !== -1) {
    // Update vote
    db.votes[existingVoteIndex].optionId = optionId;
    db.votes[existingVoteIndex].optionTitle = optionTitle;
  } else {
    db.votes.push({
      id: `vt-${Date.now()}`,
      tripId: trip.id,
      userId,
      userName,
      category,
      optionId,
      optionTitle,
      createdAt: new Date().toISOString(),
    });
  }

  // Aggregate votes for response
  const categoryVotes = db.votes.filter((v) => v.tripId === trip.id && v.category === category);
  const voteCounts: Record<string, number> = {};
  categoryVotes.forEach((v) => {
    voteCounts[v.optionId] = (voteCounts[v.optionId] || 0) + 1;
  });

  return res.json({
    message: 'Vote recorded successfully.',
    votes: categoryVotes,
    voteCounts,
  });
});
