import { useLocalStorage } from './useLocalStorage';
import { ExamResult, calculateGrade, calculateSubjectGrade } from '@/types/exam';
import { useCallback } from 'react';

const STORAGE_KEY = 'exam-results';

// Sample data for demonstration
const sampleResults: ExamResult[] = [
  {
    id: '1',
    seatNumber: 'A001',
    studentName: 'John Doe',
    examName: 'Final Semester Examination 2024',
    examDate: '2024-12-15',
    subjects: [
      { name: 'Mathematics', marksObtained: 85, maxMarks: 100, grade: 'A' },
      { name: 'Physics', marksObtained: 78, maxMarks: 100, grade: 'B+' },
      { name: 'Chemistry', marksObtained: 92, maxMarks: 100, grade: 'A+' },
      { name: 'English', marksObtained: 88, maxMarks: 100, grade: 'A' },
      { name: 'Computer Science', marksObtained: 95, maxMarks: 100, grade: 'A+' },
    ],
    totalMarks: 438,
    maxTotalMarks: 500,
    percentage: 87.6,
    grade: 'A',
    rank: 5,
    remarks: 'Excellent performance!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    seatNumber: 'A002',
    studentName: 'Jane Smith',
    examName: 'Final Semester Examination 2024',
    examDate: '2024-12-15',
    subjects: [
      { name: 'Mathematics', marksObtained: 92, maxMarks: 100, grade: 'A+' },
      { name: 'Physics', marksObtained: 88, maxMarks: 100, grade: 'A' },
      { name: 'Chemistry', marksObtained: 85, maxMarks: 100, grade: 'A' },
      { name: 'English', marksObtained: 90, maxMarks: 100, grade: 'A+' },
      { name: 'Computer Science', marksObtained: 94, maxMarks: 100, grade: 'A+' },
    ],
    totalMarks: 449,
    maxTotalMarks: 500,
    percentage: 89.8,
    grade: 'A',
    rank: 3,
    remarks: 'Outstanding performance!',
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

  const addResult = useCallback((result: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt' | 'percentage' | 'grade' | 'totalMarks' | 'maxTotalMarks'>) => {
    const totalMarks = result.subjects.reduce((sum, s) => sum + s.marksObtained, 0);
    const maxTotalMarks = result.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage = (totalMarks / maxTotalMarks) * 100;
    
    const subjectsWithGrades = result.subjects.map(s => ({
      ...s,
      grade: calculateSubjectGrade((s.marksObtained / s.maxMarks) * 100),
    }));

    const newResult: ExamResult = {
      ...result,
      id: crypto.randomUUID(),
      subjects: subjectsWithGrades,
      totalMarks,
      maxTotalMarks,
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
        
        const updatedSubjects = updates.subjects || r.subjects;
        const totalMarks = updatedSubjects.reduce((sum, s) => sum + s.marksObtained, 0);
        const maxTotalMarks = updatedSubjects.reduce((sum, s) => sum + s.maxMarks, 0);
        const percentage = (totalMarks / maxTotalMarks) * 100;
        
        const subjectsWithGrades = updatedSubjects.map(s => ({
          ...s,
          grade: calculateSubjectGrade((s.marksObtained / s.maxMarks) * 100),
        }));

        return {
          ...r,
          ...updates,
          subjects: subjectsWithGrades,
          totalMarks,
          maxTotalMarks,
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

  return {
    results,
    findBySeatNumber,
    addResult,
    updateResult,
    deleteResult,
    clearAllResults,
  };
}
