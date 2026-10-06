import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AiPlannerTab } from './components/AiPlannerTab';
import { ExploreTab } from './components/ExploreTab';
import { BookingsTab } from './components/BookingsTab';
import { GroupCollabTab } from './components/GroupCollabTab';
import { AdminDashboardTab } from './components/AdminDashboardTab';
import { AgentPipelineModal } from './components/AgentPipelineModal';
import { QrVerifierModal } from './components/QrVerifierModal';
import { PaymentModal } from './components/PaymentModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { UserProfile, NotificationData, OrchestratedPlan, BookingData } from './types';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('planner');
  const [currentUser, setCurrentUser] = useState<UserProfile>({
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
  });

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [currentPlan, setCurrentPlan] = useState<OrchestratedPlan | null>(null);

  // Modals state
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);
  const [qrVerifierModalOpen, setQrVerifierModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeBookingForPayment, setActiveBookingForPayment] = useState<BookingData | null>(null);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    // Initial fetch of user, notifications, and default AI plan
    const initData = async () => {
      try {
        const [user, notifs] = await Promise.all([
          api.getCurrentUser(),
          api.getNotifications(),
        ]);
        if (user) setCurrentUser(user);
        if (notifs) setNotifications(notifs);

        // Pre-generate or load default initial synthesized plan so the viva demo has immediate high-craft content
        const defaultPlan = await api.generateAiPlan({
          startingLocation: 'Pune',
          destination: 'Goa',
          startDate: '2026-09-25',
          endDate: '2026-09-28',
          travellersCount: 4,
          budget: 40000,
          travelStyle: 'Standard',
          interests: ['Beaches', 'Water Sports', 'Food', 'Culture'],
          preferredTransport: 'Any',
        });
        setCurrentPlan(defaultPlan);
      } catch (err) {
        console.error('Initial bootstrapping error:', err);
      }
    };
    initData();
  }, []);

  const refreshNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInitiateBooking = async (bookingPayload: any) => {
    try {
      const result = await api.createBooking({
        ...bookingPayload,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        contactName: currentUser.name,
        contactEmail: currentUser.email,
        contactPhone: currentUser.phone || '+91 98765 43210',
      });

      setActiveBookingForPayment(result.booking);
      setPaymentModalOpen(true);
      showToast(`Booking initiated for ${result.booking.itemTitle}. Proceed with sandbox payment.`);
    } catch (err: any) {
      alert(`Booking initiation failed: ${err.message}`);
    }
  };

  const handlePaymentSuccess = async (bookingId: string) => {
    showToast('Payment successful! Confirmed QR ticket issued.');
    await refreshNotifications();
    setActiveTab('bookings');
  };

  const handleSaveTrip = async (plan: OrchestratedPlan) => {
    try {
      await api.createTrip({
        title: plan.summary.tripTitle,
        destination: plan.destination.destination.name,
        startDate: plan.summary.dates.split(' to ')[0],
        endDate: plan.summary.dates.split(' to ')[1],
        budgetAllocated: plan.budget.allocatedBudget,
        travelStyle: plan.summary.travelStyle,
        travellersCount: plan.summary.travellers,
        itineraryData: plan.itinerary,
      });
      showToast('Trip successfully saved to your profile and group workspace!');
      await refreshNotifications();
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-cyan-600 text-white shadow-2xl border border-cyan-400/40 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        notifications={notifications}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        onOpenQrVerifier={() => setQrVerifierModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main App Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'planner' && (
          <AiPlannerTab
            plan={currentPlan}
            onPlanGenerated={(newPlan) => setCurrentPlan(newPlan)}
            onOpenPipelineModal={() => setPipelineModalOpen(true)}
            onInitiateBooking={handleInitiateBooking}
            onSaveTrip={handleSaveTrip}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreTab onInitiateBooking={handleInitiateBooking} />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab
            onOpenPaymentModal={(b) => {
              setActiveBookingForPayment(b);
              setPaymentModalOpen(true);
            }}
          />
        )}

        {activeTab === 'group' && <GroupCollabTab />}

        {activeTab === 'admin' && <AdminDashboardTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-8 text-slate-400 text-xs mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="font-bold text-slate-200">
              Agentic AI Collaborative Travel Planning System
            </span>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Final Year Engineering Project • Multi-Agent Architecture (8 Autonomous Sub-Agents)
            </p>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono">
            <span>Student: Vivek Pawar</span>
            <span>•</span>
            <span>Stack: Node/Express + React + MySQL + Gemini</span>
            <span>•</span>
            <span className="text-emerald-400">Status: Verified</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {currentPlan && (
        <AgentPipelineModal
          isOpen={pipelineModalOpen}
          onClose={() => setPipelineModalOpen(false)}
          trace={currentPlan.agentExecutionTrace}
          tripTitle={currentPlan.summary.tripTitle}
        />
      )}

      <QrVerifierModal
        isOpen={qrVerifierModalOpen}
        onClose={() => setQrVerifierModalOpen(false)}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        booking={activeBookingForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        onUpdateUser={(u) => setCurrentUser(u)}
      />

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notifications={notifications}
        onRefresh={refreshNotifications}
      />
    </div>
  );
}
