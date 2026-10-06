import React, { useState, useEffect } from 'react';
import {
  Users,
  Vote,
  Receipt,
  Plus,
  UserPlus,
  CheckCircle2,
  PieChart,
  IndianRupee,
  Share2,
  Mail,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { TripMemberData, VoteData, ExpenseData } from '../types';
import { api } from '../services/api';

export const GroupCollabTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'MEMBERS' | 'VOTING' | 'EXPENSES'>('VOTING');
  const [tripId, setTripId] = useState('trip-goa-001');
  const [tripDetails, setTripDetails] = useState<any>(null);
  const [expensesData, setExpensesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Invite modal form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Add Expense modal form
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(1200);
  const [expenseCategory, setExpenseCategory] = useState('FOOD');
  const [expensePaidBy, setExpensePaidBy] = useState('Vivek Pawar');

  useEffect(() => {
    loadGroupData();
  }, [tripId]);

  const loadGroupData = async () => {
    setLoading(true);
    try {
      const [trip, expenses] = await Promise.all([
        api.getTripDetails(tripId),
        api.getTripExpenses(tripId),
      ]);
      setTripDetails(trip);
      setExpensesData(expenses);
    } catch (err) {
      console.error('Failed to load group collaboration data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    try {
      await api.inviteMember(tripId, inviteName, inviteEmail);
      setInviteName('');
      setInviteEmail('');
      setShowInviteModal(false);
      await loadGroupData();
    } catch (err: any) {
      alert(`Invite error: ${err.message}`);
    }
  };

  const handleVote = async (category: string, optionId: string, optionTitle: string) => {
    try {
      await api.castVote(tripId, category, optionId, optionTitle);
      await loadGroupData();
    } catch (err: any) {
      alert(`Voting error: ${err.message}`);
    }
  };

  const handleLogExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    try {
      await api.logExpense({
        tripId,
        title: expenseTitle,
        category: expenseCategory,
        amount: Number(expenseAmount),
        paidByUserId: 'usr-student-001',
        paidByName: expensePaidBy,
        splitType: 'EQUAL',
      });
      setExpenseTitle('');
      setExpenseAmount(1200);
      setShowExpenseModal(false);
      await loadGroupData();
    } catch (err: any) {
      alert(`Expense log error: ${err.message}`);
    }
  };

  // Mock vote options if none present
  const voteCategories = [
    {
      category: 'HOTEL',
      title: 'Group Stay Preference',
      options: [
        { id: 'htl-001', title: 'Sea Breeze Luxury Resort (Calangute)', votes: 3 },
        { id: 'htl-002', title: 'The Heritage Portuguese Villa (Panaji)', votes: 2 },
      ],
    },
    {
      category: 'TRANSPORT',
      title: 'Group Transit Modality',
      options: [
        { id: 'trn-001', title: 'Vande Bharat Express (Tejas Sleeper)', votes: 4 },
        { id: 'trn-002', title: 'Overnight Multi-Axle Volvo Bus', votes: 1 },
      ],
    },
    {
      category: 'ACTIVITY',
      title: 'Day 2 Key Adventure',
      options: [
        { id: 'act-001', title: 'Grand Island Scuba Diving & Dolphin Cruise', votes: 5 },
        { id: 'act-002', title: 'Dudhsagar Waterfall Jeep Jungle Trek', votes: 3 },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Group Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Multi-User Trip Space</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            Goa Engineering Squad 2026
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active Trip ID: <strong className="text-cyan-300 font-mono">{tripId}</strong> • 4 Members Joined • Real-time consensus
          </p>
        </div>

        {/* Group Sub-Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 self-start md:self-auto">
          {[
            { id: 'VOTING', label: 'Group Voting', icon: Vote },
            { id: 'EXPENSES', label: 'Expense Splitter', icon: Receipt },
            { id: 'MEMBERS', label: 'Travel Squad', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSel
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab 1: Group Voting System */}
      {activeSubTab === 'VOTING' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Democratic Group Consensus</h3>
              <p className="text-xs text-slate-400">Vote on stays, transit, and activities with your companions</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
              Majority Rules Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voteCategories.map((cat, idx) => {
              const totalVotesInCat = cat.options.reduce((s, o) => s + o.votes, 0) || 1;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {cat.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{cat.title}</h4>
                  </div>

                  <div className="space-y-3">
                    {cat.options.map((opt) => {
                      const percentage = Math.round((opt.votes / totalVotesInCat) * 100);
                      return (
                        <div
                          key={opt.id}
                          className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-start justify-between text-xs">
                            <span className="font-semibold text-slate-200 leading-snug">{opt.title}</span>
                            <span className="font-mono text-cyan-400 font-bold ml-2">{opt.votes} votes</span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-slate-500">{percentage}% approval</span>
                            <button
                              onClick={() => handleVote(cat.category, opt.id, opt.title)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                            >
                              Vote for this
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Shared Expense Splitter */}
      {activeSubTab === 'EXPENSES' && expensesData && (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Group Expenditure</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                ₹{expensesData.totalAmount?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {expensesData.expenses?.length || 0} transactions recorded
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold">Equal Share per Member</div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono mt-1">
                ₹{expensesData.equalSharePerPerson?.toLocaleString('en-IN') || '0'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Divided across {expensesData.activeMembersCount || 4} members
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center">
              <button
                onClick={() => setShowExpenseModal(true)}
                className="w-full px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log Shared Expense</span>
              </button>
            </div>
          </div>

          {/* Who Owes Whom & Net Balance Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white font-['Outfit']">Individual Member Balances</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {expensesData.memberBalances &&
                Object.entries(expensesData.memberBalances).map(([key, mb]: any) => (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-white">{mb.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Paid: <span className="font-mono text-slate-200">₹{mb.paid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Share: <span className="font-mono text-slate-200">₹{mb.share.toLocaleString('en-IN')}</span>
                    </div>
                    <div
                      className={`text-xs font-bold font-mono pt-1 border-t border-slate-800 ${
                        mb.net >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {mb.net >= 0
                        ? `+₹${mb.net.toLocaleString('en-IN')} (Gets Back)`
                        : `-₹${Math.abs(mb.net).toLocaleString('en-IN')} (Owes)`}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Expense Log Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white font-['Outfit']">Expense Transactions Log</h4>
            <div className="space-y-2.5">
              {expensesData.expenses &&
                expensesData.expenses.map((e: ExpenseData) => (
                  <div
                    key={e.id}
                    className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{e.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Paid by <strong className="text-cyan-300">{e.paidByName || 'Member'}</strong> • Category: {e.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-white">₹{e.amount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-500">Split Equally</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Travel Squad / Members */}
      {activeSubTab === 'MEMBERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">Travel Companions Roster</h3>
              <p className="text-xs text-slate-400">All registered participants sharing this itinerary</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Friend</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Vivek Pawar', email: 'vrpawar2004@gmail.com', role: 'ORGANIZER', initial: 'V' },
              { name: 'Rohan Sharma', email: 'rohan.sharma@gmail.com', role: 'MEMBER', initial: 'R' },
              { name: 'Ananya Deshmukh', email: 'ananya.d@gmail.com', role: 'MEMBER', initial: 'A' },
              { name: 'Siddharth Patil', email: 'sid.patil@gmail.com', role: 'MEMBER', initial: 'S' },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300">
                  {m.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate">{m.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                        m.role === 'ORGANIZER'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{m.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Invite Companion to Travel Squad</h4>
            <form onSubmit={handleInvite} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Companion Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Tanmay Joshi"
                  required
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="tanmay@example.com"
                  required
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg text-xs bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white">Record Shared Group Expense</h4>
            <form onSubmit={handleLogExpense} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Expense Description</label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Beach Shack Seafood Dinner"
                  required
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="FOOD">Food & Dining</option>
                    <option value="TRANSPORT">Transit & Taxi</option>
                    <option value="HOTEL">Accommodation</option>
                    <option value="ACTIVITY">Tickets / Passes</option>
                    <option value="OTHER">Other Expense</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Paid By</label>
                <select
                  value={expensePaidBy}
                  onChange={(e) => setExpensePaidBy(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="Vivek Pawar">Vivek Pawar</option>
                  <option value="Rohan Sharma">Rohan Sharma</option>
                  <option value="Ananya Deshmukh">Ananya Deshmukh</option>
                  <option value="Siddharth Patil">Siddharth Patil</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-lg text-xs bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Save & Split
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
