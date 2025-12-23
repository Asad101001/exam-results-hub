export interface QuestionMark {
  questionNumber: number;
  marksObtained: number;
  maxMarks: number;
}

export interface TeacherInfo {
  name: string;
  department: string;
  email?: string;
  designation?: string;
}

export interface ExamResult {
  id: string;
  seatNumber: string;
  studentName: string;
  examName: string;
  examDate: string;
  subject: string;
  questions: QuestionMark[];
  examMarks: number;
  semesterMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  remarks?: string;
  teacher: TeacherInfo;
  createdAt: string;
  updatedAt: string;
}

export interface AISettings {
  apiKey: string;
  model: string;
}

// Admin password
export const ADMIN_PASSWORD = 'portalAdmin';

export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export function calculateSubjectGrade(percentage: number): string {
  return calculateGrade(percentage);
}

// Question structure for OOPs exam - No descriptions
export const OOPS_QUESTIONS = [
  { questionNumber: 1, maxMarks: 10 },
  { questionNumber: 2, maxMarks: 10 },
  { questionNumber: 3, maxMarks: 10 },
  { questionNumber: 4, maxMarks: 6 },
  { questionNumber: 5, maxMarks: 10 },
  { questionNumber: 6, maxMarks: 10 },
  { questionNumber: 7, maxMarks: 14 },
] as const;

export const TOTAL_EXAM_MARKS = 70;
export const TOTAL_SEMESTER_MARKS = 100;

// Fun encouragement messages based on performance
export function getEncouragementMessage(percentage: number): { emoji: string; message: string } {
  if (percentage >= 90) return { emoji: '🚀', message: 'Outstanding! You\'re a coding superstar!' };
  if (percentage >= 80) return { emoji: '🌟', message: 'Excellent work! Keep shining!' };
  if (percentage >= 70) return { emoji: '💪', message: 'Great job! You\'re getting stronger!' };
  if (percentage >= 60) return { emoji: '📈', message: 'Good progress! Keep climbing!' };
  if (percentage >= 50) return { emoji: '🎯', message: 'You passed! Stay focused!' };
  if (percentage >= 40) return { emoji: '🔧', message: 'Close call! A bit more practice!' };
  return { emoji: '💡', message: 'Don\'t give up! Every expert was once a beginner!' };
}