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
  subject: string; // OOPs
  questions: QuestionMark[]; // 7 questions
  examMarks: number; // Total of question marks (out of 70)
  semesterMarks: number; // Final semester marks (out of 100, includes exam marks)
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

// Admin password - in production, this should be environment variable
export const ADMIN_PASSWORD = 'oops2024teacher';

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

// Question structure for OOPs exam
export const OOPS_QUESTIONS = [
  { questionNumber: 1, maxMarks: 10, topic: 'Basic Concepts' },
  { questionNumber: 2, maxMarks: 10, topic: 'Classes & Objects' },
  { questionNumber: 3, maxMarks: 10, topic: 'Inheritance' },
  { questionNumber: 4, maxMarks: 6, topic: 'Polymorphism' },
  { questionNumber: 5, maxMarks: 10, topic: 'Abstraction' },
  { questionNumber: 6, maxMarks: 10, topic: 'Encapsulation' },
  { questionNumber: 7, maxMarks: 14, topic: 'Advanced Topics' },
] as const;

export const TOTAL_EXAM_MARKS = 70;
export const TOTAL_SEMESTER_MARKS = 100;
