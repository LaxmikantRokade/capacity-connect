import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Course, CourseModule } from '../types';

export const InteractiveLearningPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!courseId) return;
      try {
        const data = await api.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error('Failed to load course player:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-base font-bold">Course modules unavailable.</h2>
        <Link to="/courses" className="mt-4 inline-block text-brand-600 underline text-xs">
          Return to catalog
        </Link>
      </div>
    );
  }

  const activeModule: CourseModule = course.modules[activeModuleIndex];
  const allModulesCompleted = course.modules.every((m) => m.isCompleted);

  const handleMarkComplete = async () => {
    if (!course || !course.modules || !activeModule) return;
    setUpdating(true);
    try {
      const res = await api.markModuleComplete(course.id, activeModule.id);
      // Update local state
      const updatedModules = [...course.modules];
      updatedModules[activeModuleIndex].isCompleted = true;
      setCourse({
        ...course,
        modules: updatedModules,
        progressPercent: res.progressPercent,
      });

      // Advance to next module if available
      if (activeModuleIndex < course.modules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
      }
    } catch (err) {
      console.error('Failed to mark module complete:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top Learning Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-navy-900 z-10">
        <div className="flex items-center gap-3">
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Exit
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {course.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Overall Progress:</span>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {course.progressPercent}%
            </span>
          </div>
          <div className="h-2 w-28 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-300"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Split Player */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Module Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 dark:bg-navy-950">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Module Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
                <span>Unit {activeModuleIndex + 1} of {course.modules.length}</span>
                <span>•</span>
                <span>{activeModule.durationMinutes} mins</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {activeModule.title}
              </h1>
            </div>

            {/* Video Player if module is video */}
            {activeModule.contentType === 'VIDEO' && activeModule.videoUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-lg">
                <iframe
                  src={activeModule.videoUrl}
                  title={activeModule.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Rich Text / Document Content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900 prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
              <div className="whitespace-pre-line font-sans text-slate-700 dark:text-slate-300">
                {activeModule.content}
              </div>

              {activeModule.resourceUrl && (
                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-bold text-xs text-blue-900 dark:text-blue-200">
                        Official SOP Reference Document
                      </p>
                      <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                        Accompanying architectural whitepaper & compliance checklist
                      </p>
                    </div>
                  </div>
                  <a
                    href={activeModule.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF
                  </a>
                </div>
              )}
            </div>

            {/* Completion & Next Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={activeModuleIndex === 0}
                onClick={() => setActiveModuleIndex(activeModuleIndex - 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous Unit
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkComplete}
                  disabled={updating}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition shadow-sm ${
                    activeModule.isCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  {activeModule.isCompleted ? 'Marked Complete' : 'Complete & Continue'}
                </button>
              </div>
            </div>

            {/* Final Exam Trigger Prompt if 100% or nearly completed */}
            {allModulesCompleted && (
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 dark:bg-emerald-950/30 text-center space-y-3">
                <Sparkles className="mx-auto h-8 w-8 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Curriculum Modules Finished!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  You have successfully completed all instruction units. Take the certification assessment to qualify for your verifiable digital credential.
                </p>
                <Link
                  to="/assessments"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                >
                  <Award className="h-4 w-4" /> Take Certification Exam
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar Module Outline */}
        <div className="w-80 border-l border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-navy-900 hidden lg:flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Module Syllabus Outline
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2">
            {course.modules.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveModuleIndex(idx)}
                className={`w-full text-left rounded-xl p-3 text-xs transition flex items-start gap-2.5 ${
                  idx === activeModuleIndex
                    ? 'border border-brand-500/40 bg-brand-50 text-brand-900 dark:bg-brand-950/60 dark:text-brand-200 font-semibold'
                    : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {m.isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="line-clamp-2">{m.title}</p>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {m.durationMinutes} mins • {m.contentType}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <Link
              to="/assessments"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50/50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300"
            >
              <Award className="h-3.5 w-3.5" /> Course Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
