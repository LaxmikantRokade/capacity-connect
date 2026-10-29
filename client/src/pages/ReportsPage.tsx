import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Download,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [quarterFilter, setQuarterFilter] = useState('Q1 2026');

  // Realistic SIH26075 Training Effectiveness Data
  const monthlyProgressData = [
    { month: 'Oct 2025', completed: 18, active: 42, target: 30 },
    { month: 'Nov 2025', completed: 32, active: 65, target: 45 },
    { month: 'Dec 2025', completed: 48, active: 85, target: 60 },
    { month: 'Jan 2026', completed: 72, active: 110, target: 80 },
    { month: 'Feb 2026', completed: 95, active: 142, target: 100 },
  ];

  const competencyGapData = [
    { skill: 'CERT-In Incident SOP', current: 3.2, benchmark: 4.0, gap: 0.8 },
    { skill: 'India Stack & DPI', current: 3.8, benchmark: 4.5, gap: 0.7 },
    { skill: 'Data Policy Analytics', current: 2.4, benchmark: 4.0, gap: 1.6 },
    { skill: 'Cloud Tenancy Security', current: 2.8, benchmark: 4.0, gap: 1.2 },
    { skill: 'Ethical AI Accountability', current: 2.1, benchmark: 3.5, gap: 1.4 },
  ];

  const effectivenessMetrics = [
    {
      metric: 'National Mandate Compliance',
      score: '94.2%',
      delta: '+12.4% this quarter',
      status: 'On Track',
    },
    {
      metric: 'Average Assessment Score',
      score: '84.6%',
      delta: '+6.1% post-course revision',
      status: 'Optimal',
    },
    {
      metric: 'Knowledge Application Index',
      score: '4.2 / 5.0',
      delta: 'Supervisor 90-day review',
      status: 'Exceeding',
    },
    {
      metric: 'Verifiable Pass Rate',
      score: '88.5%',
      delta: 'First-time quiz takers',
      status: 'High',
    },
  ];

  const handleExportEffectivenessCSV = () => {
    const rows = competencyGapData.map((d) => ({
      CompetencyName: d.skill,
      CurrentEvaluatedProficiency: d.current,
      TargetBenchmark: d.benchmark,
      CalculatedDeficitGap: d.gap,
      ReportingQuarter: quarterFilter,
      DepartmentScope: departmentFilter,
    }));
    api.exportToCSV('Competency_Gap_Report_2026.csv', rows);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <BarChart2 className="h-4 w-4" />
            <span>SIH26075 Analytics & Audit Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Organizational Training Effectiveness & Capability Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Executive metrics on curriculum adoption, assessment pass rates, and department skill deficit reductions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportEffectivenessCSV}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Download className="h-4 w-4" /> Export Competency Gap CSV
          </button>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Filter className="h-3.5 w-3.5" /> Filter Scope:
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="All">All Departments</option>
          <option value="Digital Governance">Digital Governance & Public Operations</option>
          <option value="Security Division">Information Systems & Security Division</option>
          <option value="Capacity Cell">Talent & Capacity Building Cell</option>
        </select>

        <select
          value={quarterFilter}
          onChange={(e) => setQuarterFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="Q1 2026">Q1 2026 (Current)</option>
          <option value="Q4 2025">Q4 2025</option>
          <option value="Full Year 2025-26">Full Year 2025-26</option>
        </select>
      </div>

      {/* Executive Effectiveness Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {effectivenessMetrics.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-1"
          >
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {item.metric}
            </span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{item.score}</p>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-emerald-600 font-semibold">{item.delta}</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Trend Line Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Training Completion Trajectory vs Target
            </h3>
            <span className="text-[11px] text-slate-400">Monthly Headcount</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="completed" name="Completed Modules" stroke="#10b981" strokeWidth={2.5} />
                <Line type="monotone" dataKey="active" name="Active Learners" stroke="#0c87eb" strokeWidth={2} />
                <Line type="monotone" dataKey="target" name="National Target" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Gap Bar Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Department Competency Deficit (Gap Analysis)
            </h3>
            <span className="text-[11px] text-slate-400">Scale: 1-5</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competencyGapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="skill" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="current" name="Current Evaluated" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Target Benchmark" fill="#0c87eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
