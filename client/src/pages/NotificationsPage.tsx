import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'WARNING':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'ALERT':
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <Info className="h-5 w-5 text-brand-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time in-app alerts for course assignments, assessments, workshop registrations, and certifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-300 transition"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Honest Demo Notification Disclaimer */}
      <div className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        <ShieldAlert className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <span>
          Local in-app notifications are operational. Real external SMTP/SMS services are simulated in this prototype environment.
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
            filter === 'unread'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700 bg-white dark:bg-navy-900">
          <Bell className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No notifications in this filter
          </h3>
          <p className="text-xs text-slate-500 mt-1">You are up to date on all organizational events.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between rounded-2xl border p-4 transition ${
                n.isRead
                  ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-navy-900'
                  : 'border-brand-500/40 bg-brand-50/40 dark:border-brand-500/30 dark:bg-brand-950/20'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    {!n.isRead && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={() => handleMarkAsRead(n.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
