import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Bookmark,
  Plus,
  Tag,
  Eye,
  Calendar,
  User as UserIcon,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { KnowledgeArticle } from '../types';
import { useAuth } from '../context/AuthContext';

export const KnowledgeBasePage: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(true);

  // Authoring Modal State
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Security & Compliance');
  const [tags, setTags] = useState('CERT-In, SOP, Compliance');

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await api.getKnowledgeArticles(search, selectedCategory);
        setArticles(data);
        if (data.length > 0 && !selectedArticle) {
          setSelectedArticle(data[0]);
        }
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [search, selectedCategory]);

  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isBookmarked = await api.toggleBookmark(id);
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isBookmarked } : a))
    );
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle({ ...selectedArticle, isBookmarked });
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const created = await api.createArticle({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        summary,
        content,
        category,
        tags: tags.split(',').map((t) => t.trim()),
        authorId: user.id,
      });

      setArticles([created, ...articles]);
      setSelectedArticle(created);
      setShowAuthorModal(false);

      // Reset form
      setTitle('');
      setSummary('');
      setContent('');
    } catch (err) {
      console.error('Failed to author article:', err);
    }
  };

  const categories = ['All', 'Security & Compliance', 'Technical Blueprints', 'Human Resources & Policy'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span>Organizational Knowledge Repository</span>
            <span>•</span>
            <span>Standard Operating Procedures</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Knowledge Library & SOP Guides
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official operational guidelines, compliance checklists, and cross-departmental documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAuthorModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" /> Publish Guide
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides by title, keyword, or compliance tags (e.g. CERT-In)..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 w-full sm:w-auto"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Article List Column */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Articles ({articles.length})
          </h3>

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {articles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`cursor-pointer rounded-2xl border p-4 transition shadow-sm ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {art.category}
                    </span>
                    <button
                      onClick={(e) => handleToggleBookmark(art.id, e)}
                      className={`p-1 transition ${
                        art.isBookmarked
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${art.isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {art.title}
                  </h4>

                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                    {art.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <span>By {art.authorName}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {art.viewsCount} views
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reader Column */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-navy-900">
          {selectedArticle ? (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {selectedArticle.category}
                  </span>
                  <button
                    onClick={(e) => handleToggleBookmark(selectedArticle.id, e)}
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-amber-600"
                  >
                    <Bookmark className={`h-4 w-4 ${selectedArticle.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                    {selectedArticle.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" /> Author: {selectedArticle.authorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {selectedArticle.viewsCount} views
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedArticle.tags?.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Tag className="h-2.5 w-2.5 text-slate-400" /> {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3 font-sans">
                {selectedArticle.content}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select an article to view details
            </div>
          )}
        </div>
      </div>

      {/* Publish New Guide Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-navy-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Publish SOP Guide / Policy Article
            </h3>

            <form onSubmit={handleCreateArticle} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Standard Procedure for Mandatory Log Retention"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Executive Summary
                </label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="1-2 sentence overview for catalog preview"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="Security & Compliance">Security & Compliance</option>
                    <option value="Technical Blueprints">Technical Blueprints</option>
                    <option value="Human Resources & Policy">Human Resources & Policy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="CERT-In, SOP, Incident"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Content Body
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed guidelines, step-by-step checklist, and compliance references..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAuthorModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 font-semibold text-white hover:bg-emerald-700"
                >
                  Publish to Repository
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
