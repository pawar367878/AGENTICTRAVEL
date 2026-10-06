import React from 'react';
import {
  Compass,
  Bot,
  Ticket,
  Users,
  ShieldCheck,
  QrCode,
  Bell,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, NotificationData } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  notifications: NotificationData[];
  onOpenNotifications: () => void;
  onOpenQrVerifier: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  notifications,
  onOpenNotifications,
  onOpenQrVerifier,
  onOpenProfile,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'planner', label: 'AI Trip Planner', icon: Sparkles },
    { id: 'explore', label: 'Explore & Catalog', icon: Compass },
    { id: 'bookings', label: 'My Bookings & QR', icon: Ticket },
    { id: 'group', label: 'Group Trips & Split', icon: Users },
    { id: 'admin', label: 'Admin & System Health', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Academic & Project Identity Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-4 py-1.5 border-b border-cyan-900/30 text-xs flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-medium border border-cyan-500/30">
            FINAL YEAR PROJECT
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Agentic AI-Based Collaborative Travel Planning • Multi-Agent Architecture
          </span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="hidden md:inline font-mono">Student: <strong className="text-cyan-200">Vivek Pawar</strong></span>
          <span className="inline-flex items-center text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
            8 Agents Online
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            id="brand-logo"
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('planner')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                  AGENTIC<span className="text-cyan-400">TRAVEL</span>
                </span>
                <span className="px-1.5 py-0.2 bg-blue-500/20 border border-blue-400/30 rounded text-[10px] font-mono text-cyan-300">
                  AI v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">Multi-Agent Travel Orchestration Platform</p>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2.5">
            {/* QR Scanner Tool Button */}
            <button
              id="qr-verifier-btn"
              onClick={onOpenQrVerifier}
              title="Open Ticket Verification QR Scanner"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Verify Ticket</span>
            </button>

            {/* Notifications Button */}
            <button
              id="notifications-bell-btn"
              onClick={onOpenNotifications}
              title="System Notifications"
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Button */}
            <button
              id="user-profile-btn"
              onClick={onOpenProfile}
              className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-400 leading-tight">Student / Travel Admin</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar Scrollable */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 bg-slate-900/90 no-scrollbar space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
