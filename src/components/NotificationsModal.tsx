import React from 'react';
import { X, Bell, CheckCircle2, Info, AlertTriangle, Check } from 'lucide-react';
import { NotificationData } from '../types';
import { api } from '../services/api';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationData[];
  onRefresh: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const handleMarkRead = async (id: string) => {
    await api.markNotificationRead(id);
    onRefresh();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-['Outfit']">System Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] text-cyan-400 hover:underline font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">No active notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all text-xs flex items-start space-x-3 ${
                  n.isRead
                    ? 'bg-slate-950/40 border-slate-850 text-slate-400'
                    : 'bg-slate-800/60 border-cyan-500/30 text-slate-200'
                }`}
              >
                <div className="mt-0.5">
                  {n.type === 'BOOKING' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {n.type === 'TRIP' && <Info className="w-4 h-4 text-cyan-400" />}
                  {n.type !== 'BOOKING' && n.type !== 'TRIP' && <Bell className="w-4 h-4 text-indigo-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <strong className="text-white block truncate">{n.title}</strong>
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        title="Mark as read"
                        className="text-[10px] text-cyan-400 hover:underline shrink-0 ml-2"
                      >
                        Read
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
