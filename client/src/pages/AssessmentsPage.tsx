import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Assessment, AssessmentAttempt } from '../types';
import { useAuth } from '../context/AuthContext';

export const AssessmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [myAttempts, setMyAttempts] = useState<AssessmentAttempt[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [result, setResult] = useState<AssessmentAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load default DPI course assessment (assess-1)
        const assessData = await api.getAssessmentByCourseId('course-1');
        const attemptsData = await api.getMyAttempts();
        setAssessment(assessData);
        setMyAttempts(attemptsData);
      } catch (err) {
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return; // Locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    const unanswered = assessment.questions.some((q) => selectedAnswers[q.id] === undefined);
    if (unanswered) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([qId, optIdx]) => ({
        questionId: qId,
        selectedOption: optIdx,
      }));

      const res = await api.submitAssessment(assessment.id, answersPayload);
      setResult(res);

      // Refresh attempts
      const attemptsData = await api.getMyAttempts();
      setMyAttempts(attemptsData);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setResult(null);
    setActiveQuestionIndex(0);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
        <h2 className="mt-2 text-sm font-bold">Assessment not found</h2>
      </div>
    );
  }

  const currentQ = assessment.questions[activeQuestionIndex];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <span>Certification Assessment</span>
            <span>•</span>
            <span>Pass Threshold: {assessment.passPercentage}%</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {assessment.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {assessment.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Clock className="h-3.5 w-3.5" /> {assessment.timeLimitMinutes} Mins Allocated
          </span>
        </div>
      </div>

      {/* Result Card if Submitted */}
      {result && (
        <div
          className={`rounded-2xl border p-6 text-center space-y-4 animate-in fade-in ${
            result.passed
              ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent'
              : 'border-rose-500/50 bg-gradient-to-b from-rose-500/10 to-transparent'
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md dark:bg-navy-900">
            {result.passed ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            ) : (
              <XCircle className="h-8 w-8 text-rose-500" />
            )}
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {result.passed ? 'Assessment Passed with Distinction!' : 'Assessment Not Passed'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              You scored <strong>{result.score}</strong> out of <strong>{result.maxScore}</strong> (
              <strong>{result.percentage}%</strong>). Pass threshold is {assessment.passPercentage}%.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {result.passed ? (
              <Link
                to="/certificates"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                <Award className="h-4 w-4" /> View Verifiable Certificate
              </Link>
            ) : (
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
              >
                <RotateCcw className="h-4 w-4" /> Retake Assessment
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Runner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Question Box */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question {activeQuestionIndex + 1} of {assessment.questions.length}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {selectedAnswers[currentQ.id] !== undefined ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Answer Selected</span>
              ) : (
                <span className="text-slate-400">Not Answered</span>
              )}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const isCorrectAnswer = optIdx === currentQ.correctOptionIndex;

              let optionStyle =
                'border-slate-200 hover:border-brand-400 bg-white dark:border-slate-700 dark:bg-navy-950';

              if (result) {
                if (isCorrectAnswer) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={!!result}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  className={`w-full rounded-xl border p-4 text-left text-xs transition flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-600 dark:border-slate-600 dark:text-slate-300">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {result && isCorrectAnswer && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  )}
                  {result && isSelected && !isCorrectAnswer && (
                    <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {result && currentQ.explanation && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Explanation & National Directive Reference:
              </p>
              <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Bottom navigation & submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-40"
            >
              Previous
            </button>

            {activeQuestionIndex < assessment.questions.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition"
              >
                Next Question
              </button>
            ) : !result ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Assessment'}
              </button>
            ) : null}
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Navigator
            </h4>

            <div className="grid grid-cols-4 gap-2">
              {assessment.questions.map((q, idx) => {
                const isSelected = selectedAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                      idx === activeQuestionIndex
                        ? 'bg-brand-600 text-white ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-navy-900'
                        : isSelected
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-300 dark:border-brand-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Past Assessment Attempts History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-navy-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Previous Attempt History
            </h4>

            {myAttempts.length === 0 ? (
              <p className="text-xs text-slate-400">No previous attempts recorded.</p>
            ) : (
              <div className="space-y-2">
                {myAttempts.slice(0, 3).map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{att.assessmentTitle}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(att.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        att.passed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {att.percentage}% ({att.passed ? 'Passed' : 'Failed'})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
