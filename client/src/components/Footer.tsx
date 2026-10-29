import React from 'react';
import { BookOpen, ShieldCheck, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-navy-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Capacity<span className="text-brand-600 dark:text-brand-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Centralized Digital Capacity Building and Learning Management Portal for organizational workforce upskilling and competency benchmarking.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
              <Award className="h-3.5 w-3.5" />
              Smart India Hackathon 2026 • SIH26075
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Core Modules
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/courses" className="hover:text-brand-600 dark:hover:text-brand-400">Course Catalog & Tracks</Link></li>
              <li><Link to="/skills" className="hover:text-brand-600 dark:hover:text-brand-400">Competency & Skill Matrix</Link></li>
              <li><Link to="/training" className="hover:text-brand-600 dark:hover:text-brand-400">Live Interactive Workshops</Link></li>
              <li><Link to="/knowledge" className="hover:text-brand-600 dark:hover:text-brand-400">SOP & Knowledge Sharing</Link></li>
              <li><Link to="/certificates" className="hover:text-brand-600 dark:hover:text-brand-400">Verifiable Credentials</Link></li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Frameworks & Standards
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>CERT-In Mandatory Cyber Hygiene</li>
              <li>Mission Karmayogi Competency Taxonomy</li>
              <li>India Stack & DEPA Guidelines</li>
              <li>MeitY Cloud Tenancy Security</li>
              <li>NITI Aayog Responsible AI Principles</li>
            </ul>
          </div>

          {/* Operational Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              System Environment
            </h4>
            <div className="mt-3 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Operational (Local / Hybrid Engine)</span>
              </div>
              <p className="text-[11px]">
                Active DB: Prisma SQLite with PostgreSQL migration path.
              </p>
              <p className="text-[11px]">
                Auth: Role-Based Access Control (RBAC) & bcrypt hashing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Capacity Connect. Developed for Smart India Hackathon 2026.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for National Capacity Building
          </p>
        </div>
      </div>
    </footer>
  );
};
