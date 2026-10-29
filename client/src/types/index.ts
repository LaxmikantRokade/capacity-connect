export type UserRole = 'LEARNER' | 'TRAINER' | 'ADMIN' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jobRole?: string;
  departmentId?: string;
  departmentName?: string;
  bio?: string;
  avatarUrl?: string;
  learningGoals?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SkillCategory = 'Technical' | 'Governance' | 'Leadership' | 'Security' | 'Operational' | 'Innovation';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  selfProficiency: number; // 1 - 5
  verifiedProficiency?: number | null; // 1 - 5
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  targetProficiency: number; // 1 - 5
  notes?: string;
  updatedAt: string;
}

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  durationMinutes: number;
  contentType: 'TEXT' | 'VIDEO' | 'DOCUMENT';
  content: string;
  videoUrl?: string;
  resourceUrl?: string;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  level: CourseLevel;
  durationMinutes: number;
  instructorId?: string;
  instructorName?: string;
  departmentId?: string;
  departmentName?: string;
  learningObjectives: string[];
  prerequisites?: string;
  thumbnail: string;
  assessmentCriteria?: string;
  modules?: CourseModule[];
  assessmentId?: string;
  enrollmentCount?: number;
  isEnrolled?: boolean;
  progressPercent?: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED';
  enrolledAt: string;
  completedAt?: string | null;
  progressPercent: number;
  completedModuleIds: string[];
}

export interface Question {
  id: string;
  assessmentId: string;
  questionText: string;
  orderIndex: number;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  courseTitle?: string;
  title: string;
  description?: string;
  passPercentage: number;
  timeLimitMinutes: number;
  questions: Question[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  userId: string;
  userName: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: { questionId: string; selectedOption: number }[];
  submittedAt: string;
}

export type Modality = 'ONLINE' | 'IN_PERSON' | 'HYBRID';

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  instructorId?: string;
  instructorName?: string;
  modality: Modality;
  locationOrUrl: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolledCount: number;
  isRegistered?: boolean;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  viewsCount: number;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  verificationHash: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  authorName: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
