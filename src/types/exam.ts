export interface Subject {
  name: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
}

export interface ExamResult {
  id: string;
  seatNumber: string;
  studentName: string;
  examName: string;
  examDate: string;
  subjects: Subject[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AISettings {
  apiKey: string;
  model: string;
}

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
