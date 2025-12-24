import { useLocalStorage } from './useLocalStorage';
import { ExamResult, calculateGrade, OOPS_QUESTIONS, TOTAL_SEMESTER_MARKS } from '@/types/exam';
import { useCallback } from 'react';
import { encryptCSV, decryptCSV } from '@/utils/csvEncryption';

const STORAGE_KEY = 'exam-results';

// Sample data for demonstration - uses current date dynamically
const createSampleResults = (): ExamResult[] => {
  const currentDate = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();
  
  return [
    {
      id: '1',
      seatNumber: 'OOP001',
      studentName: 'Rahul Sharma',
      examName: 'OOPs Mid-Semester Examination 2024',
      examDate: currentDate,
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
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '2',
      seatNumber: 'OOP002',
      studentName: 'Ananya Patel',
      examName: 'OOPs Mid-Semester Examination 2024',
      examDate: currentDate,
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
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export function useExamResults() {
  const [results, setResults] = useLocalStorage<ExamResult[]>(STORAGE_KEY, createSampleResults());

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

  const importFromCSV = useCallback((csvContent: string) => {
    // First try to decrypt (will return as-is if not encrypted)
    const decryptedContent = decryptCSV(csvContent);
    const lines = decryptedContent.trim().split('\n');
    if (lines.length < 2) return { success: 0, errors: [] };
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const errors: string[] = [];
    let success = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
        
        const questions = OOPS_QUESTIONS.map((q, idx) => ({
          questionNumber: q.questionNumber,
          marksObtained: Math.min(parseInt(row[`q${idx + 1}`] || '0'), q.maxMarks),
          maxMarks: q.maxMarks,
        }));
        
        const examMarks = questions.reduce((sum, q) => sum + q.marksObtained, 0);
        const semesterMarks = Math.min(parseInt(row['semester'] || row['semestermarks'] || '0'), 100);
        const percentage = (semesterMarks / TOTAL_SEMESTER_MARKS) * 100;
        
        const newResult: ExamResult = {
          id: crypto.randomUUID(),
          seatNumber: row['seatnumber'] || row['seat'] || `OOP${String(i).padStart(3, '0')}`,
          studentName: row['name'] || row['studentname'] || 'Unknown',
          examName: row['examname'] || 'OOPs Mid-Semester Examination 2024',
          examDate: row['date'] || row['examdate'] || new Date().toISOString().split('T')[0],
          subject: 'Object Oriented Programming',
          questions,
          examMarks,
          semesterMarks,
          percentage: Math.round(percentage * 100) / 100,
          grade: calculateGrade(percentage),
          rank: row['rank'] ? parseInt(row['rank']) : undefined,
          remarks: row['remarks'] || '',
          teacher: {
            name: row['teacher'] || row['teachername'] || 'Dr. Priya Mehta',
            department: row['department'] || 'Computer Science',
            email: row['teacheremail'] || '',
            designation: row['designation'] || 'Professor',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setResults((prev) => [...prev, newResult]);
        success++;
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err}`);
      }
    }
    
    return { success, errors };
  }, [setResults]);

  const exportToCSV = useCallback((encrypted: boolean = false) => {
    const headers = ['SeatNumber', 'Name', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'ExamMarks', 'Semester', 'Percentage', 'Grade', 'Rank', 'Remarks', 'Teacher', 'Date'];
    const rows = results.map(r => [
      r.seatNumber,
      r.studentName,
      ...r.questions.map(q => q.marksObtained),
      r.examMarks,
      r.semesterMarks,
      r.percentage,
      r.grade,
      r.rank || '',
      r.remarks || '',
      r.teacher.name,
      r.examDate,
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    if (encrypted) {
      return encryptCSV(csvContent);
    }
    
    return csvContent;
  }, [results]);

  const generateSampleCSV = useCallback((count: number = 30, encrypted: boolean = false) => {
    const names = ['Amit Kumar', 'Priya Singh', 'Rohit Verma', 'Sneha Gupta', 'Vikram Patel', 'Anjali Sharma', 'Karthik Nair', 'Pooja Reddy', 'Arjun Das', 'Neha Joshi', 'Siddharth Rao', 'Kavya Menon', 'Rahul Saxena', 'Divya Pillai', 'Manish Tiwari', 'Shruti Iyer', 'Akash Pandey', 'Riya Kapoor', 'Deepak Mishra', 'Megha Choudhury', 'Nikhil Agarwal', 'Tanvi Bhatt', 'Varun Khanna', 'Ishita Sen', 'Gaurav Malhotra', 'Pallavi Jain', 'Rohan Bose', 'Simran Kaur', 'Aditya Hegde', 'Kriti Banerjee'];
    
    const headers = ['SeatNumber', 'Name', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Semester', 'Rank', 'Remarks', 'Teacher', 'Date'];
    
    const rows = Array.from({ length: count }, (_, i) => {
      const q1 = Math.floor(Math.random() * 11);
      const q2 = Math.floor(Math.random() * 11);
      const q3 = Math.floor(Math.random() * 11);
      const q4 = Math.floor(Math.random() * 7);
      const q5 = Math.floor(Math.random() * 11);
      const q6 = Math.floor(Math.random() * 11);
      const q7 = Math.floor(Math.random() * 15);
      const examTotal = q1 + q2 + q3 + q4 + q5 + q6 + q7;
      const internal = Math.floor(Math.random() * 31);
      const semester = Math.min(Math.round(examTotal * 100 / 70) + internal, 100);
      
      return [
        `OOP${String(i + 3).padStart(3, '0')}`,
        names[i % names.length],
        q1, q2, q3, q4, q5, q6, q7,
        semester,
        '',
        '',
        'Dr. Priya Mehta',
        new Date().toISOString().split('T')[0],
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    if (encrypted) {
      return encryptCSV(csvContent);
    }
    
    return csvContent;
  }, []);

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
        questionNumber: q.questionNumber,
        maxMarks: q.maxMarks,
        avgMarks: Math.round(avgMarks * 100) / 100,
        avgPercentage: Math.round((avgMarks / q.maxMarks) * 100),
      };
    });

    const topPerformer = results.reduce((best, r) => r.percentage > best.percentage ? r : best, results[0]);
    const lowestPerformer = results.reduce((worst, r) => r.percentage < worst.percentage ? r : worst, results[0]);

    return {
      totalStudents,
      avgPercentage: Math.round(avgPercentage * 100) / 100,
      avgExamMarks: Math.round(avgExamMarks * 100) / 100,
      passedStudents,
      failedStudents: totalStudents - passedStudents,
      passRate: Math.round((passedStudents / totalStudents) * 100),
      gradeDistribution,
      questionStats,
      topPerformer,
      lowestPerformer,
    };
  }, [results]);

  return {
    results,
    setResults,
    findBySeatNumber,
    addResult,
    updateResult,
    deleteResult,
    clearAllResults,
    importFromCSV,
    exportToCSV,
    generateSampleCSV,
    getStatistics,
  };
}
