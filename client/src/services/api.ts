import {
  User,
  Course,
  Skill,
  UserSkill,
  TrainingSession,
  KnowledgeArticle,
  Certificate,
  Notification,
  Announcement,
  Assessment,
  AssessmentAttempt,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_COURSES,
  INITIAL_SKILLS,
  INITIAL_USER_SKILLS,
  INITIAL_TRAINING_SESSIONS,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ASSESSMENTS,
} from '../data/mockData';

const STORAGE_KEYS = {
  TOKEN: 'cc_auth_token',
  CURRENT_USER: 'cc_current_user',
  COURSES: 'cc_courses_store',
  ENROLLMENTS: 'cc_enrollments_store',
  SKILLS: 'cc_skills_store',
  USER_SKILLS: 'cc_user_skills_store',
  SESSIONS: 'cc_sessions_store',
  ARTICLES: 'cc_articles_store',
  CERTIFICATES: 'cc_certificates_store',
  NOTIFICATIONS: 'cc_notifications_store',
  ANNOUNCEMENTS: 'cc_announcements_store',
  ASSESSMENTS: 'cc_assessments_store',
  ATTEMPTS: 'cc_attempts_store',
};

// Initialize LocalStorage with seed data if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(INITIAL_SKILLS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_SKILLS)) {
    localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(INITIAL_USER_SKILLS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_TRAINING_SESSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_KNOWLEDGE_ARTICLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSESSMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
    // Rahul Sharma starts enrolled in course-1 with 66% progress
    const defaultEnrollments = [
      {
        id: 'enr-1',
        userId: 'user-learner-1',
        courseId: 'course-1',
        status: 'IN_PROGRESS',
        enrolledAt: '2026-02-18T10:00:00Z',
        progressPercent: 66,
        completedModuleIds: ['mod-1-1', 'mod-1-2'],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(defaultEnrollments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    const defaultAttempts: AssessmentAttempt[] = [
      {
        id: 'att-1',
        assessmentId: 'assess-1',
        assessmentTitle: 'DPI & India Stack Certification Examination',
        userId: 'user-learner-1',
        userName: 'Rahul Sharma',
        score: 4,
        maxScore: 4,
        percentage: 100,
        passed: true,
        answers: [
          { questionId: 'q-1-1', selectedOption: 1 },
          { questionId: 'q-1-2', selectedOption: 1 },
          { questionId: 'q-1-3', selectedOption: 1 },
          { questionId: 'q-1-4', selectedOption: 2 },
        ],
        submittedAt: '2026-02-20T16:30:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(defaultAttempts));
  }
}

initializeLocalStorage();

export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!envUrl) return '/api';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
};

export const API_BASE = getApiBaseUrl();

async function fetchWithFallback<T>(endpoint: string, options?: RequestInit, fallbackFn?: () => T): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Authorization failed');
      }
      throw new Error(`API returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackFn) {
      return fallbackFn();
    }
    throw err;
  }
}

export const api = {
  // COURSES
  async getCourses(filters?: { category?: string; level?: string; search?: string }): Promise<Course[]> {
    return fetchWithFallback<Course[]>(
      `/courses?${new URLSearchParams(filters as Record<string, string>).toString()}`,
      undefined,
      () => {
        let list: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
        const enrollments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENROLLMENTS) || '[]');
        const currentUser = api.getCurrentUser();

        list = list.map((c) => {
          const userEnrollment = currentUser
            ? enrollments.find((e: any) => e.userId === currentUser.id && e.courseId === c.id)
            : null;
          return {
            ...c,
            isEnrolled: !!userEnrollment,
            progressPercent: userEnrollment ? userEnrollment.progressPercent : 0,
          };
        });

        if (filters?.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            (c) =>
              c.title.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q) ||
              c.code.toLowerCase().includes(q)
          );
        }
        if (filters?.category && filters.category !== 'All') {
          list = list.filter((c) => c.category === filters.category);
        }
        if (filters?.level && filters.level !== 'All') {
          list = list.filter((c) => c.level === filters.level);
        }
        return list;
      }
    );
  },

  async getCourseById(id: string): Promise<Course | null> {
    return fetchWithFallback<Course | null>(`/courses/${id}`, undefined, () => {
      const list: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
      const course = list.find((c) => c.id === id);
      if (!course) return null;

      const enrollments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENROLLMENTS) || '[]');
      const currentUser = api.getCurrentUser();
      const userEnrollment = currentUser
        ? enrollments.find((e: any) => e.userId === currentUser.id && e.courseId === course.id)
        : null;

      const completedIds = userEnrollment ? userEnrollment.completedModuleIds || [] : [];
      const modules = (course.modules || []).map((m) => ({
        ...m,
        isCompleted: completedIds.includes(m.id),
      }));

      return {
        ...course,
        modules,
        isEnrolled: !!userEnrollment,
        progressPercent: userEnrollment ? userEnrollment.progressPercent : 0,
      };
    });
  },

  async enrollCourse(courseId: string): Promise<{ success: boolean; enrollment: any }> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in to enroll');

    return fetchWithFallback(
      `/courses/${courseId}/enroll`,
      { method: 'POST' },
      () => {
        const enrollments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENROLLMENTS) || '[]');
        const existing = enrollments.find((e: any) => e.userId === currentUser.id && e.courseId === courseId);
        if (existing) return { success: true, enrollment: existing };

        const newEnrollment = {
          id: `enr-${Date.now()}`,
          userId: currentUser.id,
          courseId,
          status: 'ENROLLED',
          enrolledAt: new Date().toISOString(),
          progressPercent: 0,
          completedModuleIds: [],
        };
        enrollments.push(newEnrollment);
        localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));

        // Create notification
        api.addNotification({
          userId: currentUser.id,
          title: 'Enrollment Confirmed',
          message: `You are enrolled. Dive into the modules now!`,
          type: 'SUCCESS',
          link: `/learning/${courseId}`,
        });

        return { success: true, enrollment: newEnrollment };
      }
    );
  },

  async markModuleComplete(courseId: string, moduleId: string): Promise<{ success: boolean; progressPercent: number }> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in');

    return fetchWithFallback(
      `/courses/${courseId}/modules/${moduleId}/complete`,
      { method: 'POST' },
      () => {
        const enrollments = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENROLLMENTS) || '[]');
        let enrollment = enrollments.find((e: any) => e.userId === currentUser.id && e.courseId === courseId);

        if (!enrollment) {
          enrollment = {
            id: `enr-${Date.now()}`,
            userId: currentUser.id,
            courseId,
            status: 'IN_PROGRESS',
            enrolledAt: new Date().toISOString(),
            progressPercent: 0,
            completedModuleIds: [],
          };
          enrollments.push(enrollment);
        }

        if (!enrollment.completedModuleIds) enrollment.completedModuleIds = [];
        if (!enrollment.completedModuleIds.includes(moduleId)) {
          enrollment.completedModuleIds.push(moduleId);
        }

        const courses: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
        const course = courses.find((c) => c.id === courseId);
        const totalModules = course?.modules?.length || 1;
        const progress = Math.min(100, Math.round((enrollment.completedModuleIds.length / totalModules) * 100));

        enrollment.progressPercent = progress;
        if (progress === 100) {
          enrollment.status = 'COMPLETED';
          enrollment.completedAt = new Date().toISOString();
        } else {
          enrollment.status = 'IN_PROGRESS';
        }

        localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
        return { success: true, progressPercent: progress };
      }
    );
  },

  // ASSESSMENTS & QUIZZES
  async getAssessmentByCourseId(courseId: string): Promise<Assessment | null> {
    return fetchWithFallback<Assessment | null>(`/assessments/course/${courseId}`, undefined, () => {
      const list: Assessment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
      return list.find((a) => a.courseId === courseId) || null;
    });
  },

  async submitAssessment(
    assessmentId: string,
    answers: { questionId: string; selectedOption: number }[]
  ): Promise<AssessmentAttempt> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in to submit assessment');

    return fetchWithFallback(
      `/assessments/${assessmentId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify({ answers }),
      },
      () => {
        const assessments: Assessment[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
        const assessment = assessments.find((a) => a.id === assessmentId);
        if (!assessment) throw new Error('Assessment not found');

        let correctCount = 0;
        assessment.questions.forEach((q) => {
          const userAns = answers.find((a) => a.questionId === q.id);
          if (userAns && userAns.selectedOption === q.correctOptionIndex) {
            correctCount++;
          }
        });

        const totalQuestions = assessment.questions.length;
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const passed = percentage >= assessment.passPercentage;

        const attempt: AssessmentAttempt = {
          id: `att-${Date.now()}`,
          assessmentId,
          assessmentTitle: assessment.title,
          userId: currentUser.id,
          userName: currentUser.name,
          score: correctCount,
          maxScore: totalQuestions,
          percentage,
          passed,
          answers,
          submittedAt: new Date().toISOString(),
        };

        const attempts: AssessmentAttempt[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '[]');
        attempts.unshift(attempt);
        localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));

        // If passed, check if course certificate can be issued
        if (passed) {
          const certificates: Certificate[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES) || '[]');
          const alreadyHasCert = certificates.some(
            (c) => c.userId === currentUser.id && c.courseId === assessment.courseId
          );

          if (!alreadyHasCert) {
            const courses: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
            const course = courses.find((c) => c.id === assessment.courseId);
            const newCert: Certificate = {
              id: `cert-${Date.now()}`,
              certificateNumber: `CC-2026-${(course?.code || 'CERT').replace(/[^a-zA-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
              userId: currentUser.id,
              userName: currentUser.name,
              courseId: assessment.courseId,
              courseTitle: course?.title || 'Certified Specialization',
              issueDate: new Date().toISOString(),
              grade: `Passed with Honors (${percentage}%)`,
              verificationHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            };
            certificates.unshift(newCert);
            localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));

            api.addNotification({
              userId: currentUser.id,
              title: 'Certificate Awarded!',
              message: `Congratulations! You passed "${assessment.title}" and earned your credential.`,
              type: 'SUCCESS',
              link: '/certificates',
            });
          }
        }

        return attempt;
      }
    );
  },

  async getMyAttempts(): Promise<AssessmentAttempt[]> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];

    return fetchWithFallback<AssessmentAttempt[]>(`/assessments/attempts/my`, undefined, () => {
      const attempts: AssessmentAttempt[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '[]');
      return attempts.filter((a) => a.userId === currentUser.id);
    });
  },

  // SKILLS & COMPETENCY
  async getAllSkills(): Promise<Skill[]> {
    return fetchWithFallback<Skill[]>('/skills', undefined, () => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
    });
  },

  async getUserSkills(userId?: string): Promise<UserSkill[]> {
    const targetUserId = userId || api.getCurrentUser()?.id;
    if (!targetUserId) return [];

    return fetchWithFallback<UserSkill[]>(`/skills/user/${targetUserId}`, undefined, () => {
      const list: UserSkill[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SKILLS) || '[]');
      return list.filter((s) => s.userId === targetUserId);
    });
  },

  async updateUserSkill(skillId: string, selfProficiency: number, targetProficiency: number): Promise<UserSkill> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in');

    return fetchWithFallback(
      `/skills/user/${skillId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ selfProficiency, targetProficiency }),
      },
      () => {
        const list: UserSkill[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SKILLS) || '[]');
        const allSkills: Skill[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
        const meta = allSkills.find((s) => s.id === skillId);

        let existing = list.find((s) => s.userId === currentUser.id && s.skillId === skillId);
        if (existing) {
          existing.selfProficiency = selfProficiency;
          existing.targetProficiency = targetProficiency;
          existing.updatedAt = new Date().toISOString();
        } else {
          existing = {
            id: `usk-${Date.now()}`,
            userId: currentUser.id,
            skillId,
            skillName: meta?.name || 'Skill',
            category: meta?.category || 'Technical',
            selfProficiency,
            verifiedProficiency: null,
            targetProficiency,
            updatedAt: new Date().toISOString(),
          };
          list.push(existing);
        }
        localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(list));
        return existing;
      }
    );
  },

  async verifyUserSkill(userSkillId: string, verifiedProficiency: number, notes?: string): Promise<UserSkill> {
    const currentUser = api.getCurrentUser();
    if (!currentUser || (currentUser.role !== 'MANAGER' && currentUser.role !== 'TRAINER' && currentUser.role !== 'ADMIN')) {
      throw new Error('Only Managers, Trainers, or Admins can verify skills');
    }

    return fetchWithFallback(
      `/skills/verify/${userSkillId}`,
      {
        method: 'POST',
        body: JSON.stringify({ verifiedProficiency, notes }),
      },
      () => {
        const list: UserSkill[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SKILLS) || '[]');
        const item = list.find((s) => s.id === userSkillId);
        if (!item) throw new Error('Skill record not found');

        item.verifiedProficiency = verifiedProficiency;
        item.verifiedBy = `${currentUser.name} (${currentUser.role})`;
        item.verifiedAt = new Date().toISOString();
        if (notes) item.notes = notes;
        item.updatedAt = new Date().toISOString();

        localStorage.setItem(STORAGE_KEYS.USER_SKILLS, JSON.stringify(list));
        return item;
      }
    );
  },

  // TRAINING SESSIONS
  async getTrainingSessions(): Promise<TrainingSession[]> {
    const currentUser = api.getCurrentUser();
    return fetchWithFallback<TrainingSession[]>('/training/sessions', undefined, () => {
      const list: TrainingSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
      return list.map((s) => ({
        ...s,
        isRegistered: currentUser ? (s as any).registeredUserIds?.includes(currentUser.id) || s.isRegistered : false,
      }));
    });
  },

  async registerSession(sessionId: string): Promise<{ success: boolean; session: TrainingSession }> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in');

    return fetchWithFallback(
      `/training/sessions/${sessionId}/register`,
      { method: 'POST' },
      () => {
        const list: TrainingSession[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
        const session = list.find((s) => s.id === sessionId);
        if (!session) throw new Error('Session not found');

        if (session.enrolledCount >= session.capacity) {
          throw new Error('Session is fully booked');
        }

        session.isRegistered = true;
        session.enrolledCount += 1;
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(list));

        api.addNotification({
          userId: currentUser.id,
          title: 'Training Seat Reserved',
          message: `Your seat in "${session.title}" has been confirmed.`,
          type: 'SUCCESS',
          link: '/training',
        });

        return { success: true, session };
      }
    );
  },

  // KNOWLEDGE BASE
  async getKnowledgeArticles(search?: string, category?: string): Promise<KnowledgeArticle[]> {
    return fetchWithFallback<KnowledgeArticle[]>(
      `/knowledge/articles?search=${encodeURIComponent(search || '')}&category=${encodeURIComponent(category || '')}`,
      undefined,
      () => {
        let list: KnowledgeArticle[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
        if (search) {
          const q = search.toLowerCase();
          list = list.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.summary.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q) ||
              a.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        if (category && category !== 'All') {
          list = list.filter((a) => a.category === category);
        }
        return list;
      }
    );
  },

  async createArticle(data: Omit<KnowledgeArticle, 'id' | 'viewsCount' | 'createdAt' | 'updatedAt' | 'authorName'>): Promise<KnowledgeArticle> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in');

    return fetchWithFallback(
      '/knowledge/articles',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      () => {
        const list: KnowledgeArticle[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
        const newArt: KnowledgeArticle = {
          ...data,
          id: `art-${Date.now()}`,
          authorName: currentUser.name,
          viewsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        list.unshift(newArt);
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
        return newArt;
      }
    );
  },

  async toggleBookmark(articleId: string): Promise<boolean> {
    const list: KnowledgeArticle[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
    const article = list.find((a) => a.id === articleId);
    if (article) {
      article.isBookmarked = !article.isBookmarked;
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
      return article.isBookmarked;
    }
    return false;
  },

  // CERTIFICATES
  async getMyCertificates(): Promise<Certificate[]> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];

    return fetchWithFallback<Certificate[]>('/certificates/my', undefined, () => {
      const list: Certificate[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES) || '[]');
      return list.filter((c) => c.userId === currentUser.id);
    });
  },

  async getCertificateByNumber(certNumber: string): Promise<Certificate | null> {
    return fetchWithFallback<Certificate | null>(`/certificates/verify/${certNumber}`, undefined, () => {
      const list: Certificate[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTIFICATES) || '[]');
      return list.find((c) => c.certificateNumber.toLowerCase() === certNumber.toLowerCase()) || null;
    });
  },

  // NOTIFICATIONS
  async getNotifications(): Promise<Notification[]> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];

    return fetchWithFallback<Notification[]>('/notifications', undefined, () => {
      const list: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
      return list.filter((n) => n.userId === currentUser.id);
    });
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetchWithFallback(
      `/notifications/${id}/read`,
      { method: 'POST' },
      () => {
        const list: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
        const item = list.find((n) => n.id === id);
        if (item) {
          item.isRead = true;
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
        }
      }
    );
  },

  async markAllNotificationsRead(): Promise<void> {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return;

    await fetchWithFallback(
      `/notifications/mark-all-read`,
      { method: 'POST' },
      () => {
        const list: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
        list.forEach((n) => {
          if (n.userId === currentUser.id) n.isRead = true;
        });
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      }
    );
  },

  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const list: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  // ANNOUNCEMENTS
  async getAnnouncements(): Promise<Announcement[]> {
    return fetchWithFallback<Announcement[]>('/announcements', undefined, () => {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
    });
  },

  // AUTH HELPERS
  getCurrentUser(): User | null {
    const str = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null, token?: string) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  // AI-READY LEARNING ASSISTANT (Deterministic Local Knowledge Bot)
  askCapacityBot(query: string, user: User | null): { answer: string; recommendedCourses: Course[]; relatedArticles: KnowledgeArticle[] } {
    const q = query.toLowerCase();
    const courses: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
    const articles: KnowledgeArticle[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
    const userSkills: UserSkill[] = user ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SKILLS) || '[]').filter((s: any) => s.userId === user.id) : [];

    let answer = '';
    let matchedCourses: Course[] = [];
    let matchedArticles: KnowledgeArticle[] = [];

    if (q.includes('cert-in') || q.includes('incident') || q.includes('hack') || q.includes('ransomware') || q.includes('cyber')) {
      answer = `Under mandatory CERT-In directives issued pursuant to Section 70B of the IT Act (2000), any covered cybersecurity incident must be formally reported within 6 hours of detection. Furthermore, organizations must retain all system, firewall, and proxy logs within India for at least 180 calendar days. We recommend reviewing the standard response checklist and completing our CERT-In incident management course.`;
      matchedCourses = courses.filter((c) => c.code === 'SEC-202');
      matchedArticles = articles.filter((a) => a.slug.includes('cert-in'));
    } else if (q.includes('dpi') || q.includes('india stack') || q.includes('aadhaar') || q.includes('upi') || q.includes('digilocker')) {
      answer = `Digital Public Infrastructure (DPI) in India is built upon open, interoperable rails consisting of Identity (Aadhaar), Real-time Payments (UPI), and Consented Data Exchange (DigiLocker & DEPA). Issued DigiLocker records carry legal parity with physical originals under Rule 9A of the IT Rules. Explore our foundational course to learn architectural patterns.`;
      matchedCourses = courses.filter((c) => c.code === 'DPI-101');
      matchedArticles = articles.filter((a) => a.slug.includes('digilocker'));
    } else if (q.includes('skill') || q.includes('gap') || q.includes('competency') || q.includes('karmayogi') || q.includes('recommend')) {
      // Find user skill gaps
      const gaps = userSkills.filter((s) => (s.verifiedProficiency || s.selfProficiency) < s.targetProficiency);
      if (gaps.length > 0) {
        const gapNames = gaps.map((g) => g.skillName).join(', ');
        answer = `Based on your profile competency matrix, we identified skill gaps in: ${gapNames}. To bridge these gaps, our algorithmic engine matched courses directly targeted at your departmental benchmarks.`;
      } else {
        answer = `Your verified competencies are currently aligned with your target proficiency tiers. To advance your career towards Senior Architect / Policy Director roles, consider enrolling in Advanced Ethical AI and Data-Driven Governance.`;
      }
      matchedCourses = courses.slice(0, 3);
      matchedArticles = articles.filter((a) => a.category.includes('Human'));
    } else if (q.includes('certificate') || q.includes('exam') || q.includes('test') || q.includes('quiz')) {
      answer = `Certificates in Capacity Connect are cryptographically verifiable with a unique Certificate ID and SHA-256 hash. To earn a certificate, you must complete all course modules (100% progress) and score at or above the designated threshold (typically 75-80%) on the final assessment examination.`;
      matchedCourses = courses.slice(0, 2);
    } else {
      answer = `Capacity Connect (SIH26075) is the centralized Digital Capacity Building & Competency Platform. You can explore curated courses, track verified skill levels, register for live interactive training sessions, and access organizational knowledge standard operating procedures. How can I assist your learning path today?`;
      matchedCourses = courses.slice(0, 2);
      matchedArticles = articles.slice(0, 2);
    }

    return {
      answer,
      recommendedCourses: matchedCourses,
      relatedArticles: matchedArticles,
    };
  },

  // ADMIN OPERATIONS
  async getAdminUsers(): Promise<User[]> {
    return fetchWithFallback<User[]>('/admin/users', undefined, () => {
      return DEMO_USERS.map(({ passwordText: _, ...u }) => u);
    });
  },

  async assignCourse(courseId: string, userId?: string, departmentId?: string): Promise<{ success: boolean; assignedCount?: number; message?: string }> {
    return fetchWithFallback(
      '/admin/assign-course',
      {
        method: 'POST',
        body: JSON.stringify({ courseId, userId, departmentId }),
      },
      () => {
        if (userId) {
          const courses: Course[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
          const course = courses.find((c) => c.id === courseId);
          api.addNotification({
            userId,
            title: 'Course Assigned by Management',
            message: `You have been officially assigned to complete "${course?.title || 'Course'}".`,
            type: 'INFO',
            link: `/learning/${courseId}`,
          });
        }
        return {
          success: true,
          assignedCount: 1,
          message: 'Course assigned successfully.',
        };
      }
    );
  },

  // EXPORT UTILITIES (CSV)
  exportToCSV(filename: string, rows: Record<string, any>[]) {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row) =>
          keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
              cell = cell.replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator)
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
};
