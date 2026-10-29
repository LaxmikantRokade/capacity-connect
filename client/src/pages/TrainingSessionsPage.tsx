import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  CheckCircle2,
  Plus,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { TrainingSession, Modality } from '../types';
import { useAuth } from '../context/AuthContext';

export const TrainingSessionsPage: React.FC = () => {
  const { user } = useAuth();
  const isTrainerOrAdmin = user?.role === 'TRAINER' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'registered'>('upcoming');
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  // New session modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modality, setModality] = useState<Modality>('ONLINE');
  const [locationOrUrl, setLocationOrUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState(30);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await api.getTrainingSessions();
        setSessions(data);
      } catch (err) {
        console.error('Failed to load training sessions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, [user]);

  const handleRegister = async (sessionId: string) => {
    setRegisteringId(sessionId);
    try {
      await api.registerSession(sessionId);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, isRegistered: true, enrolledCount: s.enrolledCount + 1 } : s
        )
      );
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSess: TrainingSession = {
        id: `sess-${Date.now()}`,
        title,
        description,
        instructorName: user?.name || 'Lead Trainer',
        modality,
        locationOrUrl,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        capacity: Number(capacity),
        enrolledCount: 0,
        status: 'SCHEDULED',
      };

      setSessions([newSess, ...sessions]);
      setShowCreateModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      setLocationOrUrl('');
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'registered') return s.isRegistered;
    return true;
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <span>Live Interactive Capacity Building</span>
            <span>•</span>
            <span>Attendance & Rosters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Training Sessions & Faculty Workshops
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reserve seats in synchronous training workshops, live architectural code walkthroughs, and executive roundtables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isTrainerOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" /> Schedule New Session
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'upcoming'
              ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          All Scheduled Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setActiveTab('registered')}
          className={`pb-3 text-xs font-bold transition border-b-2 ml-4 ${
            activeTab === 'registered'
              ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          My Registered Seats ({sessions.filter((s) => s.isRegistered).length})
        </button>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700 bg-white dark:bg-navy-900">
          <Calendar className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No training sessions in this view
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Check the upcoming sessions tab to register for new workshops.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((s) => {
            const isFull = s.enrolledCount >= s.capacity;
            const startD = new Date(s.startTime);
            const endD = new Date(s.endTime);

            return (
              <div
                key={s.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        s.modality === 'ONLINE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : s.modality === 'HYBRID'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {s.modality}
                    </span>

                    {s.isRegistered && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Confirmed
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-purple-500" />
                      <span>{startD.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-purple-500" />
                      <span>
                        {startD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {endD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                      </span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{s.locationOrUrl}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 space-y-3">
                  {/* Capacity Progress Indicator */}
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                      <span>Seat Capacity</span>
                      <span>{s.enrolledCount} / {s.capacity}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-purple-500'}`}
                        style={{ width: `${Math.min(100, (s.enrolledCount / s.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {s.isRegistered ? (
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                      <span>Registered for Session</span>
                      {s.modality === 'ONLINE' && (
                        <a
                          href={s.locationOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-brand-600 hover:underline"
                        >
                          Join Meeting <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(s.id)}
                      disabled={isFull || registeringId === s.id}
                      className="w-full rounded-xl bg-purple-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition disabled:opacity-40"
                    >
                      {registeringId === s.id
                        ? 'Reserving Seat...'
                        : isFull
                        ? 'Session Full'
                        : 'Register Attendance'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create New Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Schedule Training Workshop
            </h3>

            <form onSubmit={handleCreateSession} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workshop Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Sovereign Cloud Data Storage"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics, learning goals, and prerequisites..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Modality
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as Modality)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="ONLINE">Online (Webinar / Stream)</option>
                    <option value="IN_PERSON">In-Person (Physical Hall)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Participant Capacity
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting URL or Room Location
                </label>
                <input
                  type="text"
                  required
                  value={locationOrUrl}
                  onChange={(e) => setLocationOrUrl(e.target.value)}
                  placeholder="https://meet.capacityconnect.in/session-abc or Room 402"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-4 py-1.5 font-semibold text-white hover:bg-purple-700"
                >
                  Schedule Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
