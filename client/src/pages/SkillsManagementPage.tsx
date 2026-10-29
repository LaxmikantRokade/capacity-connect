import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Filter,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { api } from '../services/api';
import { Skill, UserSkill } from '../types';
import { useAuth } from '../context/AuthContext';

export const SkillsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const isManagerOrAdmin = user?.role === 'MANAGER' || user?.role === 'ADMIN' || user?.role === 'TRAINER';

  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingSkill, setEditingSkill] = useState<UserSkill | null>(null);
  const [selfLevel, setSelfLevel] = useState(3);
  const [targetLevel, setTargetLevel] = useState(4);
  const [notes, setNotes] = useState('');
  const [verifyingSkill, setVerifyingSkill] = useState<UserSkill | null>(null);
  const [verifyScore, setVerifyScore] = useState(4);

  useEffect(() => {
    async function loadData() {
      try {
        const [allSkills, mySkills] = await Promise.all([
          api.getAllSkills(),
          api.getUserSkills(),
        ]);
        setSkills(allSkills);
        setUserSkills(mySkills);
      } catch (err) {
        console.error('Failed to load skills:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSaveSelfAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      const updated = await api.updateUserSkill(editingSkill.skillId, selfLevel, targetLevel);
      setUserSkills((prev) =>
        prev.map((s) => (s.skillId === editingSkill.skillId ? updated : s))
      );
      setEditingSkill(null);
    } catch (err) {
      console.error('Failed to save self-assessment:', err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingSkill) return;

    try {
      const updated = await api.verifyUserSkill(verifyingSkill.id, verifyScore, 'Manager Verified');
      setUserSkills((prev) =>
        prev.map((s) => (s.id === verifyingSkill.id ? updated : s))
      );
      setVerifyingSkill(null);
    } catch (err) {
      console.error('Failed to verify skill:', err);
    }
  };

  const categories = ['All', 'Security', 'Governance', 'Technical', 'Leadership', 'Innovation'];

  const filteredUserSkills = userSkills.filter((us) => {
    if (selectedCategory === 'All') return true;
    return us.category === selectedCategory;
  });

  // Chart data for Radar
  const radarData = userSkills.map((us) => ({
    skill: us.skillName.split(' ')[0] + ' ' + (us.skillName.split(' ')[1] || ''),
    self: us.selfProficiency,
    verified: us.verifiedProficiency || 0,
    target: us.targetProficiency,
  }));

  const getLevelName = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Elementary';
      case 3:
        return 'Intermediate';
      case 4:
        return 'Advanced';
      case 5:
        return 'Expert';
      default:
        return `Level ${lvl}`;
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
            <span>Mission Karmayogi Alignment</span>
            <span>•</span>
            <span>5-Tier Proficiency Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Organizational Competency Framework
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transparent distinction between self-evaluated proficiencies and supervisor-verified competency scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-navy-900 dark:text-slate-100 shadow-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Radar Chart & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Competency Radar (Self vs Verified vs Target)
            </h3>
            <span className="text-[11px] text-slate-400">Scale: 1 (Beginner) to 5 (Expert)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Radar name="Target Proficiency" dataKey="target" stroke="#0c87eb" fill="#0c87eb" fillOpacity={0.15} />
                <Radar name="Self-Reported" dataKey="self" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                <Radar name="Manager-Verified" dataKey="verified" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend & Action Insight */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proficiency Benchmark Guide
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Level 1 - Beginner</span>
                <span className="text-[11px] text-slate-500">Conceptual awareness</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Level 3 - Intermediate</span>
                <span className="text-[11px] text-slate-500">Autonomous standard tasks</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Level 5 - Expert</span>
                <span className="text-[11px] text-slate-500">Defines enterprise policy</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900 dark:bg-blue-950/40 text-xs text-blue-900 dark:text-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Verified Competency Safeguard
            </div>
            <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
              Self-reported ratings can be updated by employees at any time. Verified ratings are authorized exclusively by designated Department Managers or Certified Trainers.
            </p>
          </div>
        </div>
      </div>

      {/* Skills Matrix Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Individual Competency Inventory ({filteredUserSkills.length} Mapped)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-navy-950">
              <tr>
                <th className="py-3 px-4">Skill & Competency</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Self-Assessment</th>
                <th className="py-3 px-4">Verified Rating</th>
                <th className="py-3 px-4">Target Level</th>
                <th className="py-3 px-4">Skill Gap</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUserSkills.map((us) => {
                const current = us.verifiedProficiency || us.selfProficiency;
                const gap = us.targetProficiency - current;

                return (
                  <tr key={us.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {us.skillName}
                      {us.notes && (
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5 line-clamp-1">{us.notes}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {us.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-amber-600">
                        Level {us.selfProficiency}/5
                      </span>{' '}
                      <span className="text-[10px] text-slate-400">({getLevelName(us.selfProficiency)})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {us.verifiedProficiency ? (
                        <div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            Level {us.verifiedProficiency}/5
                          </span>
                          <p className="text-[9px] text-slate-400">{us.verifiedBy}</p>
                        </div>
                      ) : (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400 italic">
                          Pending Verification
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-600">
                      Level {us.targetProficiency}/5
                    </td>
                    <td className="py-3.5 px-4">
                      {gap > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded text-[10px]">
                          <AlertCircle className="h-3 w-3" /> -{gap} Level Gap
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Benchmark Met
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingSkill(us);
                          setSelfLevel(us.selfProficiency);
                          setTargetLevel(us.targetProficiency);
                        }}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold hover:border-brand-500 hover:text-brand-600 dark:border-slate-700"
                      >
                        Self-Rate
                      </button>
                      {isManagerOrAdmin && (
                        <button
                          onClick={() => {
                            setVerifyingSkill(us);
                            setVerifyScore(us.verifiedProficiency || us.selfProficiency);
                          }}
                          className="rounded-lg bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-teal-700"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Self-Assessment Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Update Self-Assessment
            </h3>
            <p className="text-xs text-slate-500 mt-1">{editingSkill.skillName}</p>

            <form onSubmit={handleSaveSelfAssessment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Self-Evaluated Level: {selfLevel} ({getLevelName(selfLevel)})
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={selfLevel}
                  onChange={(e) => setSelfLevel(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Proficiency Level: {targetLevel} ({getLevelName(targetLevel)})
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  Save Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manager Verification Modal */}
      {verifyingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-500" />
              Manager Competency Verification
            </h3>
            <p className="text-xs text-slate-500 mt-1">{verifyingSkill.skillName}</p>

            <form onSubmit={handleVerify} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Authorized Verified Score: {verifyScore} ({getLevelName(verifyScore)})
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={verifyScore}
                  onChange={(e) => setVerifyScore(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setVerifyingSkill(null)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Confirm Official Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
