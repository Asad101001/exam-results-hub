import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExamResult, TOTAL_EXAM_MARKS, TOTAL_SEMESTER_MARKS } from '@/types/exam';

export function exportResultToPDF(result: ExamResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('OOPs Examination Results', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Object Oriented Programming - Department of Computer Science', pageWidth / 2, 30, { align: 'center' });
  
  // Student Info Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 14, 55);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const studentInfo = [
    ['Seat Number', result.seatNumber],
    ['Student Name', result.studentName],
    ['Exam Name', result.examName],
    ['Exam Date', new Date(result.examDate).toLocaleDateString('en-US', { dateStyle: 'long' })],
    ['Subject', result.subject],
  ];
  
  autoTable(doc, {
    startY: 60,
    head: [],
    body: studentInfo,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 100 },
    },
  });
  
  // Question-wise Breakdown
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Question-wise Breakdown', 14, 115);
  
  const questionData = result.questions.map((q) => [
    `Question ${q.questionNumber}`,
    `${q.marksObtained}`,
    `${q.maxMarks}`,
    `${Math.round((q.marksObtained / q.maxMarks) * 100)}%`,
  ]);
  
  autoTable(doc, {
    startY: 120,
    head: [['Question', 'Obtained', 'Maximum', 'Percentage']],
    body: questionData,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 4, halign: 'center' },
  });
  
  // Summary Section
  const summaryY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Summary', 14, summaryY);
  
  const summaryData = [
    ['Total Exam Marks', `${result.examMarks} / ${TOTAL_EXAM_MARKS}`],
    ['Semester Marks', `${result.semesterMarks} / ${TOTAL_SEMESTER_MARKS}`],
    ['Percentage', `${result.percentage}%`],
    ['Grade', result.grade],
    ['Rank', result.rank ? `#${result.rank}` : 'N/A'],
  ];
  
  autoTable(doc, {
    startY: summaryY + 5,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: { fontSize: 11, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 60 },
    },
  });
  
  // Remarks
  if (result.remarks) {
    const remarksY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(240, 248, 255);
    doc.rect(14, remarksY, pageWidth - 28, 25, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Teacher's Remarks:", 18, remarksY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(result.remarks, 18, remarksY + 18);
  }
  
  // Teacher Info
  const teacherY = result.remarks ? (doc as any).lastAutoTable.finalY + 45 : (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Examiner Information', 14, teacherY);
  
  const teacherData = [
    ['Name', result.teacher.name],
    ['Designation', result.teacher.designation || 'N/A'],
    ['Department', result.teacher.department],
    ['Email', result.teacher.email || 'N/A'],
  ];
  
  autoTable(doc, {
    startY: teacherY + 5,
    head: [],
    body: teacherData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 80 },
    },
  });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY, { align: 'center' });
  doc.text('This is a computer-generated document.', pageWidth / 2, footerY + 5, { align: 'center' });
  
  // Save
  doc.save(`${result.seatNumber}_${result.studentName.replace(/\s+/g, '_')}_Result.pdf`);
}

export function exportAllResultsToPDF(results: ExamResult[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('OOPs Examination Results - All Students', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleString()} | Total Students: ${results.length}`, pageWidth / 2, 27, { align: 'center' });
  
  // Results Table
  const tableData = results.map((r, idx) => [
    idx + 1,
    r.seatNumber,
    r.studentName,
    r.examMarks,
    r.semesterMarks,
    `${r.percentage}%`,
    r.grade,
    r.rank || '-',
  ]);
  
  autoTable(doc, {
    startY: 45,
    head: [['#', 'Seat No.', 'Student Name', 'Exam', 'Semester', '%', 'Grade', 'Rank']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34], textColor: 255, fontSize: 9 },
    styles: { fontSize: 8, cellPadding: 3, halign: 'center' },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 45, halign: 'left' },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
      6: { cellWidth: 18 },
      7: { cellWidth: 15 },
    },
  });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('OOPs Results Portal - Computer Science Department', pageWidth / 2, footerY, { align: 'center' });
  
  doc.save(`OOPs_All_Results_${new Date().toISOString().split('T')[0]}.pdf`);
}