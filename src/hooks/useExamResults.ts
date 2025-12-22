import { useLocalStorage } from './useLocalStorage';
import { ExamResult, calculateGrade, OOPS_QUESTIONS, TOTAL_EXAM_MARKS, TOTAL_SEMESTER_MARKS } from '@/types/exam';
import { useCallback } from 'react';

const STORAGE_KEY = 'exam-results';

// Sample data for demonstration
const sampleResults: ExamResult[] = [
  {
    id: '1',
    seatNumber: 'OOP001',
    studentName: 'Rahul Sharma',
    examName: 'OOPs Mid-Semester Examination 2024',
    examDate: '2024-12-15',
    subject: 'Object Oriented Programming',
    questions: [
      { questionNumber: 1, marksObtained: 8, maxMarks: 10 },
      { questionNumber: 2, marksObtained: 9, maxMarks: 10 },
      { questionNumber: 3, marksObtained: 7, maxMarks: 10 },
      { questionNumber: 4, marksObtained: 5, maxMarks: 6 },
      { questionNumber: 5, marksObtained: 8, maxMarks: 10 },
      { questionNumber: 6, marksObtained: 9, maxMarks: 10 },
      { questionNumber: 7, marksObtained: 12, maxMarks: 14 },
    ],
    examMarks: 58,
    semesterMarks: 83,
    percentage: 83,
    grade: 'A',
    rank: 3,
    remarks: 'Excellent understanding of OOPs concepts!',
    teacher: {
      name: 'Dr. Priya Mehta',
      department: 'Computer Science',
      email: 'priya.mehta@university.edu',
      designation: 'Associate Professor',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    seatNumber: 'OOP002',
    studentName: 'Ananya Patel',
    examName: 'OOPs Mid-Semester Examination 2024',
    examDate: '2024-12-15',
    subject: 'Object Oriented Programming',
    questions: [
      { questionNumber: 1, marksObtained: 10, maxMarks: 10 },
      { questionNumber: 2, marksObtained: 10, maxMarks: 10 },
      { questionNumber: 3, marksObtained: 9, maxMarks: 10 },
      { questionNumber: 4, marksObtained: 6, maxMarks: 6 },
      { questionNumber: 5, marksObtained: 9, maxMarks: 10 },
      { questionNumber: 6, marksObtained: 10, maxMarks: 10 },
      { questionNumber: 7, marksObtained: 13, maxMarks: 14 },
    ],
    examMarks: 67,
    semesterMarks: 95,
    percentage: 95,
    grade: 'A+',
    rank: 1,
    remarks: 'Outstanding performance! Top of the class.',
    teacher: {
      name: 'Dr. Priya Mehta',
      department: 'Computer Science',
      email: 'priya.mehta@university.edu',
      designation: 'Associate Professor',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useExamResults() {
  const [results, setResults] = useLocalStorage<ExamResult[]>(STORAGE_KEY, sampleResults);

  const findBySeatNumber = useCallback((seatNumber: string): ExamResult | undefined => {
    return results.find(
      (r) => r.seatNumber.toLowerCase() === seatNumber.toLowerCase()
    );
  }, [results]);

  const addResult = useCallback((result: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt' | 'percentage' | 'grade' | 'examMarks'>) => {
    const examMarks = result.questions.reduce((sum, q) => sum + q.marksObtained, 0);
    const percentage = (result.semesterMarks / TOTAL_SEMESTER_MARKS) * 100;

    const newResult: ExamResult = {
      ...result,
      id: crypto.randomUUID(),
      examMarks,
      percentage: Math.round(percentage * 100) / 100,
      grade: calculateGrade(percentage),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setResults((prev) => [...prev, newResult]);
    return newResult;
  }, [setResults]);

  const updateResult = useCallback((id: string, updates: Partial<ExamResult>) => {
    setResults((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        
        const updatedQuestions = updates.questions || r.questions;
        const examMarks = updatedQuestions.reduce((sum, q) => sum + q.marksObtained, 0);
        const semesterMarks = updates.semesterMarks ?? r.semesterMarks;
        const percentage = (semesterMarks / TOTAL_SEMESTER_MARKS) * 100;

        return {
          ...r,
          ...updates,
          questions: updatedQuestions,
          examMarks,
          percentage: Math.round(percentage * 100) / 100,
          grade: calculateGrade(percentage),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [setResults]);

  const deleteResult = useCallback((id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  }, [setResults]);

  const clearAllResults = useCallback(() => {
    setResults([]);
  }, [setResults]);

  // Summary statistics for admin
  const getStatistics = useCallback(() => {
    if (results.length === 0) return null;
    
    const totalStudents = results.length;
    const avgPercentage = results.reduce((sum, r) => sum + r.percentage, 0) / totalStudents;
    const avgExamMarks = results.reduce((sum, r) => sum + r.examMarks, 0) / totalStudents;
    const passedStudents = results.filter(r => r.percentage >= 40).length;
    const gradeDistribution = results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const questionStats = OOPS_QUESTIONS.map((q, idx) => {
      const avgMarks = results.reduce((sum, r) => sum + r.questions[idx].marksObtained, 0) / totalStudents;
      return {
        ...q,
        avgMarks: Math.round(avgMarks * 100) / 100,
        avgPercentage: Math.round((avgMarks / q.maxMarks) * 100),
      };
    });

    return {
      totalStudents,
      avgPercentage: Math.round(avgPercentage * 100) / 100,
      avgExamMarks: Math.round(avgExamMarks * 100) / 100,
      passedStudents,
      failedStudents: totalStudents - passedStudents,
      passRate: Math.round((passedStudents / totalStudents) * 100),
      gradeDistribution,
      questionStats,
    };
  }, [results]);

  return {
    results,
    findBySeatNumber,
    addResult,
    updateResult,
    deleteResult,
    clearAllResults,
    getStatistics,
  };
}
