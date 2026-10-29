import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 mb-4">
        <Compass className="h-8 w-8 animate-spin" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="mt-2 text-base font-bold text-slate-700 dark:text-slate-300">
        Page or Learning Resource Not Found
      </h2>
      <p className="mt-2 max-w-sm text-xs text-slate-500">
        The route or course material you requested does not exist or has been relocated within the Capacity Connect portal.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Go to Dashboard
        </Link>
        <Link
          to="/courses"
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Browse Courses
        </Link>
      </div>
    </div>
  );
};
