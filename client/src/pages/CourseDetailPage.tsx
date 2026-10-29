import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Users,
  ArrowLeft,
  PlayCircle,
  FileText,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (!courseId) return;
      try {
        const data = await api.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!course) return;

    setEnrolling(true);
    try {
      await api.enrollCourse(course.id);
      navigate(`/learning/${course.id}`);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Course Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">
          The requested course ID does not exist or has been archived.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Back button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
              {course.code}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {course.category}
            </span>
            <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-500/20">
              {course.level}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {course.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-500" />
              Duration: <strong>{course.durationMinutes} mins</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-brand-500" />
              Modules: <strong>{course.modules?.length || 0} units</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-500" />
              Accreditation: <strong>Verifiable Certificate</strong>
            </span>
          </div>
        </div>

        {/* Enrollment Card Sidebar */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900 space-y-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-44 w-full rounded-xl object-cover shadow-sm"
          />

          <div className="space-y-2">
            {course.isEnrolled ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Current Progress</span>
                  <span className="text-brand-600 dark:text-brand-400">{course.progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <button
                  onClick={() => navigate(`/learning/${course.id}`)}
                  className="w-full rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
                >
                  Continue Course
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in Course'}
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs text-slate-500">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-500" /> Free organizational access
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" /> 100% self-paced online
            </p>
            <p className="flex items-center gap-2">
              <Award className="h-4 w-4 text-teal-500" /> Tamper-evident digital badge
            </p>
          </div>
        </div>
      </div>

      {/* Learning Objectives & Syllabus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-8 space-y-8">
          {/* Objectives */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Learning Objectives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.learningObjectives?.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Curriculum Syllabus ({course.modules?.length || 0} Modules)
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {course.modules?.map((m, index) => (
                <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-bold dark:bg-slate-800 dark:text-slate-300">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{m.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {m.durationMinutes} mins • {m.contentType === 'VIDEO' ? 'Video Lecture' : 'Interactive Document'}
                      </p>
                    </div>
                  </div>
                  {m.isCompleted ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Criteria */}
          {course.assessmentCriteria && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-navy-950/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Accreditation & Assessment Criteria
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {course.assessmentCriteria}
              </p>
            </div>
          )}
        </div>

        {/* Faculty Profile */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Course Instructor
            </h4>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
                alt={course.instructorName}
                className="h-12 w-12 rounded-full object-cover border border-brand-500/30"
              />
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                  {course.instructorName}
                </h5>
                <p className="text-[11px] text-slate-500">{course.departmentName || 'Public Sector Faculty'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              Experienced educator and practitioner guiding organizational digital transformation across ministries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
