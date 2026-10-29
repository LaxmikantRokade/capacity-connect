import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Calendar,
  AlertCircle,
  Flame,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Course, Certificate, TrainingSession, Announcement, UserSkill } from '../types';

export const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cList, certList, sList, aList, skList] = await Promise.all([
          api.getCourses(),
          api.getMyCertificates(),
          api.getTrainingSessions(),
          api.getAnnouncements(),
          api.getUserSkills(),
        ]);
        setCourses(cList);
        setCertificates(certList);
        setSessions(sList);
        setAnnouncements(aList);
        setUserSkills(skList);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const enrolledCourses = courses.filter((c) => c.isEnrolled);
  const inProgressCourses = enrolledCourses.filter((c) => (c.progressPercent || 0) < 100);
  const completedCourses = enrolledCourses.filter((c) => (c.progressPercent || 0) === 100);

  // Transparent Local Recommendation Rules:
  // Identify user's declared skill gaps (where verified or self level is below target)
  const gapSkillNames = userSkills
    .filter((s) => (s.verifiedProficiency || s.selfProficiency) < s.targetProficiency)
    .map((s) => s.skillName.toLowerCase());

  const recommendedCourses = courses
    .filter((c) => !c.isEnrolled)
    .filter((c) => {
      if (gapSkillNames.length === 0) return true;
      const title = c.title.toLowerCase();
      const desc = c.description.toLowerCase();
      return gapSkillNames.some((gap) => {
        const keywords = gap.split(' ');
        return keywords.some((kw) => kw.length > 3 && (title.includes(kw) || desc.includes(kw)));
      });
    })
    .slice(0, 3);

  // Total learning hours accumulated
  const totalMinutes = enrolledCourses.reduce(
    (sum, c) => sum + Math.round((c.durationMinutes * (c.progressPercent || 0)) / 100),
    0
  );
  const learningHours = (totalMinutes / 60).toFixed(1);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-900 via-navy-900 to-slate-900 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-teal-400">SIH26075 Competency Portal</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">{user?.departmentName || 'Public Operations'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Learner'}!
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Your organizational learning pathway is active. You have completed {completedCourses.length} accredited course(s) and accumulated {learningHours} training hours this quarter.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-600 transition"
            >
              Explore Catalog <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Enrolled Courses</span>
            <BookOpen className="h-4 w-4 text-brand-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{enrolledCourses.length}</p>
          <p className="mt-1 text-[11px] text-slate-400">{inProgressCourses.length} in progress</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Certificates Earned</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{certificates.length}</p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">100% Verifiable</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Training Hours</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{learningHours} hrs</p>
          <p className="mt-1 text-[11px] text-slate-400">Audited learning time</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Competency Level</span>
            <TrendingUp className="h-4 w-4 text-teal-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Tier 3</p>
          <p className="mt-1 text-[11px] text-slate-400">{userSkills.length} mapped skills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Active Courses & Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          {/* In-Progress Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-600" />
                Continue Learning
              </h2>
              <Link to="/courses" className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400">
                View all ({enrolledCourses.length})
              </Link>
            </div>

            {inProgressCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700 bg-white dark:bg-navy-900">
                <CheckCircle className="mx-auto h-8 w-8 text-emerald-500" />
                <h3 className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  You're all caught up!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Browse our catalog to enroll in upcoming modules or bridge your competency gaps.
                </p>
                <Link
                  to="/courses"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {inProgressCourses.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-navy-900 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="h-14 w-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            {c.code}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.level}</span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                          {c.title}
                        </h3>
                        <p className="text-[11px] text-slate-500">Instructor: {c.instructorName}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1.5 min-w-[130px]">
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{c.progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-500"
                            style={{ width: `${c.progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        to={`/learning/${c.id}`}
                        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
                      >
                        Resume
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Courses based on skill gaps */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-500" />
                  Recommended Based on Competency Gaps
                </h2>
                <p className="text-[11px] text-slate-500">
                  Targeted by local rules matching your department's evaluated benchmarks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-navy-900 flex flex-col justify-between"
                >
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="h-28 w-full rounded-lg object-cover mb-2.5"
                  />
                  <div>
                    <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                      {c.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {c.description}
                    </p>
                  </div>
                  <Link
                    to={`/courses/${c.id}`}
                    className="mt-3 block text-center rounded-lg border border-brand-500/40 bg-brand-50/50 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Sessions & Announcements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Live Workshops */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                Live Training Sessions
              </h3>
              <Link to="/training" className="text-[11px] text-brand-600 hover:underline dark:text-brand-400">
                Calendar
              </Link>
            </div>

            <div className="space-y-3">
              {sessions.slice(0, 2).map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {s.modality}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(s.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    Instructor: {s.instructorName}
                  </p>
                  <Link
                    to="/training"
                    className="mt-2 block text-right text-[11px] font-semibold text-brand-600 hover:underline dark:text-brand-400"
                  >
                    {s.isRegistered ? 'Seat Confirmed' : 'Register Now'}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Departmental Announcements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Announcements
              </h3>
            </div>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 p-3 dark:bg-amber-950/20"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {a.title}
                    </h4>
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                      {a.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {a.content}
                  </p>
                  <p className="mt-1.5 text-[9px] text-slate-400">Issued by: {a.authorName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Certificate View Link */}
          {certificates.length > 0 && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-4 dark:bg-emerald-950/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                    Latest Credential Ready
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    {certificates[0].courseTitle}
                  </p>
                </div>
              </div>
              <Link
                to="/certificates"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
              >
                View
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
