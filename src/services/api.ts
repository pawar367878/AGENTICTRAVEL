import {
  UserProfile,
  HotelItem,
  TransportItem,
  ActivityItem,
  RestaurantItem,
  OrchestratedPlan,
  BookingData,
  PaymentData,
  NotificationData,
  ExpenseData,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth & Profile
  async getCurrentUser(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) {
      // Fallback demo user
      return {
        id: 'usr-student-001',
        name: 'Vivek Pawar',
        email: 'vrpawar2004@gmail.com',
        phone: '+91 98765 43210',
        role: 'USER',
        preferredTravelStyle: 'Standard',
        preferredBudgetMin: 15000,
        preferredBudgetMax: 50000,
        favouriteActivities: ['Beaches', 'Water Sports', 'Culture', 'Photography'],
        preferredFood: ['Goan Seafood', 'North Indian', 'Multi-Cuisine'],
        preferredTransport: ['Bus', 'Train', 'Flight'],
      };
    }
    const data = await res.json();
    return data.user;
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    return data.user;
  },

  // AI Multi-Agent Planner
  async generateAiPlan(payload: any): Promise<OrchestratedPlan> {
    const res = await fetch(`${API_BASE}/ai/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate AI plan');
    }
    return res.json();
  },

  // Catalog items
  async getHotels(params?: Record<string, string>): Promise<HotelItem[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/hotels?${query}`);
    return res.json();
  },

  async getTransport(params?: Record<string, string>): Promise<TransportItem[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/transport?${query}`);
    return res.json();
  },

  async getActivities(params?: Record<string, string>): Promise<ActivityItem[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/activities?${query}`);
    return res.json();
  },

  async getRestaurants(params?: Record<string, string>): Promise<RestaurantItem[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/restaurants?${query}`);
    return res.json();
  },

  // Trips
  async getTrips(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/trips`);
    return res.json();
  },

  async getTripDetails(tripId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trips/${tripId}`);
    return res.json();
  },

  async createTrip(tripData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData),
    });
    return res.json();
  },

  async inviteMember(tripId: string, name: string, email: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trips/${tripId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    return res.json();
  },

  async castVote(tripId: string, category: string, optionId: string, optionTitle: string): Promise<any> {
    const res = await fetch(`${API_BASE}/trips/${tripId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, optionId, optionTitle }),
    });
    return res.json();
  },

  // Bookings & Sandbox Payment
  async getBookings(): Promise<BookingData[]> {
    const res = await fetch(`${API_BASE}/bookings`);
    return res.json();
  },

  async getBookingDetails(bookingId: string): Promise<{ booking: BookingData; payment?: PaymentData; qrCodeDataUrl: string }> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}`);
    return res.json();
  },

  async createBooking(bookingPayload: any): Promise<{ booking: BookingData }> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create booking');
    }
    return res.json();
  },

  async cancelBooking(bookingId: string): Promise<{ message: string; booking: BookingData }> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
    return res.json();
  },

  async verifyBookingQr(bookingOrPnr: string): Promise<{ valid: boolean; booking?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/bookings/verify/${bookingOrPnr}`);
    return res.json();
  },

  // Sandbox Payment
  async createPaymentSession(bookingId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    return res.json();
  },

  async verifySandboxPayment(payload: {
    bookingId: string;
    paymentMethod: string;
    cardLast4?: string;
    upiId?: string;
    bankName?: string;
    shouldFail?: boolean;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return res.json();
  },

  // Expenses
  async getTripExpenses(tripId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/expenses/trips/${tripId}/expenses`);
    return res.json();
  },

  async logExpense(expenseData: any): Promise<ExpenseData> {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    const data = await res.json();
    return data.expense;
  },

  // Admin stats
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationData[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, { method: 'PUT' });
  },
};
