import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Course } from '../types';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      try {
        const data = await api.getCourses({
          category: selectedCategory,
          level: selectedLevel,
          search,
        });
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, [selectedCategory, selectedLevel, search]);

  const categories = ['All', 'Governance & Tech', 'Cybersecurity', 'Analytics & Tech', 'Innovation'];
  const levels = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Curriculum & Course Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore accredited courses aligning with national Digital Public Infrastructure & CERT-In security standards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
            {courses.length} Course{courses.length === 1 ? '' : 's'} Available
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, code (e.g. DPI-101), or keyword..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 whitespace-nowrap">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2 whitespace-nowrap">
            <span>Level:</span>
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700 bg-white dark:bg-navy-900">
          <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
            No matching courses found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset your filters to explore all available capacity modules.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-navy-900 overflow-hidden"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                      {c.code}
                    </span>
                    <span className="rounded-md bg-brand-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                      {c.category}
                    </span>
                  </div>
                  {c.isEnrolled && (
                    <div className="absolute top-3 right-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      {c.progressPercent === 100 ? 'Completed' : `${c.progressPercent}% Enrolled`}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {c.durationMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="uppercase font-semibold tracking-wider text-slate-600 dark:text-slate-400">
                      {c.level}
                    </span>
                    {c.enrollmentCount && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {c.enrollmentCount}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                <div className="flex items-center justify-between pt-3">
                  <div className="text-[11px] text-slate-500">
                    Faculty: <span className="font-semibold text-slate-700 dark:text-slate-300">{c.instructorName}</span>
                  </div>
                  <Link
                    to={c.isEnrolled ? `/learning/${c.id}` : `/courses/${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
                  >
                    {c.isEnrolled ? 'Resume' : 'View Course'} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
