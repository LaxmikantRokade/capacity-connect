import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Bell,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  CheckCircle,
  Menu,
  X,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Notification } from '../types';

interface NavbarProps {
  onOpenBot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBot }) => {
  const { user, isAuthenticated, logout, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cc_dark_mode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cc_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cc_dark_mode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isAuthenticated) {
      api.getNotifications().then(setNotifications).catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const navLinks = [
    { label: 'Courses', path: '/courses' },
    { label: 'Competencies', path: '/skills' },
    { label: 'Workshops', path: '/training' },
    { label: 'Knowledge Base', path: '/knowledge' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-navy-900/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & SIH Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Capacity<span className="text-brand-600 dark:text-brand-400">Connect</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
                  SIH26075
                </span>
              </div>
              <p className="hidden text-[10px] text-slate-500 dark:text-slate-400 md:block">
                Digital Capacity Building & LMS
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                location.pathname.startsWith(link.path)
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                location.pathname === '/dashboard'
                  ? 'text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Dashboard
            </Link>
          )}
          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Learning Assistant Button */}
          {onOpenBot && (
            <button
              onClick={onOpenBot}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-50/70 px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm transition hover:bg-teal-100 dark:border-teal-500/30 dark:bg-teal-950/60 dark:text-teal-300"
              title="Open CapacityBot AI Learning Assistant"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span className="hidden sm:inline">CapacityBot</span>
            </button>
          )}

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              title="Switch demo user role for testing"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">{user ? user.role : 'Demo Role'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-navy-900 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => loginAsDemoRole('LEARNER')}
                  className="w-full text-left rounded-lg px-2.5 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Learner / Employee</p>
                    <p className="text-[11px] text-slate-500">Rahul Sharma (Operations)</p>
                  </div>
                  {user?.role === 'LEARNER' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </button>
                <button
                  onClick={() => loginAsDemoRole('TRAINER')}
                  className="w-full text-left rounded-lg px-2.5 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Trainer / Instructor</p>
                    <p className="text-[11px] text-slate-500">Priya Nair (Lead Faculty)</p>
                  </div>
                  {user?.role === 'TRAINER' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </button>
                <button
                  onClick={() => loginAsDemoRole('MANAGER')}
                  className="w-full text-left rounded-lg px-2.5 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Organization Manager</p>
                    <p className="text-[11px] text-slate-500">Anita Deshmukh (Director)</p>
                  </div>
                  {user?.role === 'MANAGER' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </button>
                <button
                  onClick={() => loginAsDemoRole('ADMIN')}
                  className="w-full text-left rounded-lg px-2.5 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Administrator</p>
                    <p className="text-[11px] text-slate-500">Vikram Malhotra (IT Sec)</p>
                  </div>
                  {user?.role === 'ADMIN' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Dropdown */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-navy-900 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications</span>
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-[11px] text-brand-600 hover:underline dark:text-brand-400"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-slate-400">No new notifications</p>
                    ) : (
                      notifications.slice(0, 4).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            handleMarkAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                          className={`cursor-pointer rounded-lg p-2 text-xs transition ${
                            n.isRead
                              ? 'bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              : 'bg-brand-50/60 text-slate-800 dark:bg-brand-950/40 dark:text-slate-200 font-medium'
                          }`}
                        >
                          <p className="font-semibold">{n.title}</p>
                          <p className="text-[11px] line-clamp-2 text-slate-500 dark:text-slate-400 mt-0.5">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Account or Sign In */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-brand-500/40 object-cover"
                />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-navy-900 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                      {user.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      Profile & Goals
                    </Link>
                    <Link
                      to="/certificates"
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Certificates
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-brand-600 dark:text-slate-300 px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 dark:border-slate-800 dark:bg-navy-900">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  to="/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Certificates
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  My Profile
                </Link>
                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400"
                  >
                    Admin & Manager Portal
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
