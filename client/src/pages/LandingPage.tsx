import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const { loginAsDemoRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRoleLaunch = (role: UserRole) => {
    loginAsDemoRole(role);
    if (role === 'ADMIN' || role === 'MANAGER') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col">
      {/* SIH Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-navy-900 to-brand-950 py-3 text-white border-b border-brand-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded bg-brand-500/30 px-2 py-0.5 font-bold text-brand-300 border border-brand-400/30">
              SIH 2026 OFFICIAL SOLUTION
            </span>
            <span className="hidden sm:inline text-slate-300">
              Problem ID: <strong className="text-white">SIH26075</strong> — Digital Capacity Building & Learning Management Portal
            </span>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-teal-300 hover:text-white font-medium"
          >
            Explore Public Catalog <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28 dark:bg-navy-950">
        <div className="absolute inset-0 bg-[radial-gradient(#0c87eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] dark:opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" />
                Modern Organizational Capability & Reskilling Platform
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Bridging Competency Gaps Through{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-teal-500 bg-clip-text text-transparent">
                  Centralized Learning
                </span>
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Capacity Connect is an enterprise-grade digital portal designed for public administration and large organizations. Benchmark workforce skills against national frameworks, deliver modular courses, verify proficiencies, and share standard operating procedures.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition"
                  >
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition"
                    >
                      Sign In to Platform <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                    >
                      Browse Courses
                    </Link>
                  </>
                )}
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">100%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verifiable Credentials</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">5-Tier</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Competency Matrix</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">RBAC</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Multi-Role Governance</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick Demo Account Launcher */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Interactive Role Sandbox
                    </h3>
                    <p className="text-xs text-slate-500">
                      Explore the portal as different stakeholders with 1 click
                    </p>
                  </div>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => handleRoleLaunch('LEARNER')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:bg-slate-800/80 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">
                          Learner / Employee
                        </h4>
                        <p className="text-[11px] text-slate-500">Rahul Sharma (Operations Analyst)</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                  </button>

                  <button
                    onClick={() => handleRoleLaunch('TRAINER')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:bg-slate-800/80 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">
                          Trainer / Instructor
                        </h4>
                        <p className="text-[11px] text-slate-500">Priya Nair (Lead Capability Faculty)</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                  </button>

                  <button
                    onClick={() => handleRoleLaunch('MANAGER')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:bg-slate-800/80 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">
                          Organization Manager
                        </h4>
                        <p className="text-[11px] text-slate-500">Anita Deshmukh (Director Initiatives)</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                  </button>

                  <button
                    onClick={() => handleRoleLaunch('ADMIN')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:bg-slate-800/80 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600">
                          System Administrator
                        </h4>
                        <p className="text-[11px] text-slate-500">Vikram Malhotra (IT Security Head)</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of SIH26075 Problem Statement */}
      <section className="bg-slate-50 py-16 dark:bg-navy-900/60 border-t border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Architectural Solution Pillars
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              End-to-End Capacity Building Lifecycle
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Addressing Problem Statement SIH26075 through an integrated continuum of competency evaluation, targeted curriculum, interactive workshops, and peer knowledge exchange.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">1. Competency Matrix</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                5-tier proficiency evaluation distinguishing self-reported interest from manager-verified capability. Automatic gap calculation against target roles.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">2. Modular Learning</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Structured courses with rich multimedia, downloadable whitepapers, interactive checkpoint quizzes, and verifiable completion tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">3. Training Workshops</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Real-time capacity tracking, conflict prevention, online/in-person modalities, and automated attendance registers for live faculty sessions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">4. SOP Knowledge Base</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Centralized repository for organizational standard operating procedures, CERT-In compliance guides, and citizen-service blueprints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alignment with National Frameworks */}
      <section className="py-16 bg-white dark:bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-900 via-navy-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="rounded-md bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30">
                  National Mission Alignment
                </span>
                <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight">
                  Aligned with Mission Karmayogi & CERT-In Directives
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Capacity Connect embodies the core ethos of India's National Programme for Civil Services Capacity Building: transitioning from rule-based to role-based competency modeling, with continuous micro-learning and tamper-evident digital credentialing.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    to="/skills"
                    className="rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
                  >
                    View Competency Framework
                  </Link>
                  <Link
                    to="/certificates"
                    className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
                  >
                    Verify Credentials
                  </Link>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Transparent Local Recommendation Rules</h4>
                    <p className="text-xs text-slate-300">
                      Algorithmic matching between user declared skill gaps and corresponding accredited curriculum.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Cryptographic Verification Hashes</h4>
                    <p className="text-xs text-slate-300">
                      Unique SHA-256 digital certificate credentials generated strictly upon 100% module progress and passing exam marks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Exportable Executive Analytics</h4>
                    <p className="text-xs text-slate-300">
                      Department-level training effectiveness reporting with instant CSV export for administrative audits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
