import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Building,
  Briefcase,
  Target,
  Award,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [jobRole, setJobRole] = useState(user?.jobRole || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [learningGoals, setLearningGoals] = useState(user?.learningGoals || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      jobRole,
      bio,
      learningGoals,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 w-full">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Officer & Employee Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your organizational credentials, department alignment, and designated learning targets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="md:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 text-center space-y-4">
          <div className="relative mx-auto w-24 h-24">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover border-4 border-brand-500/20 shadow-md"
            />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h3>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="inline-block mt-2 rounded-full bg-brand-100 px-3 py-0.5 text-[10px] font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {user.role}
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-left text-xs space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-brand-500 flex-shrink-0" />
              <span className="truncate">{user.departmentName || 'General Administration'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-brand-500 flex-shrink-0" />
              <span className="truncate">{user.jobRole || 'Public Service Officer'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>RBAC Verified Account</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Edit Profile & Learning Aspirations
          </h3>

          {savedMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Profile and learning targets updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Job Role / Designation
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Professional Bio & Focus Areas
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-brand-600" />
                Declared Learning Goals (Used by Recommendation Engine)
              </label>
              <textarea
                rows={2}
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                placeholder="e.g. Master Cloud Native Architecture and Citizen-Centric Service Delivery frameworks."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
