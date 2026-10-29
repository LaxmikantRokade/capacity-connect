import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShieldAlert, ArrowRight, UserCheck, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../data/mockData';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleSelectDemo = (userDemo: (typeof DEMO_USERS)[0]) => {
    setEmail(userDemo.email);
    setPassword(userDemo.passwordText);
    setError(null);
  };

  const handleQuickLaunch = (role: UserRole) => {
    loginAsDemoRole(role);
    if (role === 'ADMIN' || role === 'MANAGER') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign In to Capacity Connect
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Smart India Hackathon 2026 Portal • SIH26075
          </p>
        </div>

        {/* Auth Mode Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          <ShieldAlert className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Local Authenticated Environment</p>
            <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
              Pass-through JWT with bcrypt hashing. Use pre-configured demo credentials or register an account.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dept.gov.in"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo passwords listed below</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Fill Demo Roles */}
          <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Quick 1-Click Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLaunch(u.role)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-left hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-800 transition"
                >
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{u.role} • {u.jobRole?.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
