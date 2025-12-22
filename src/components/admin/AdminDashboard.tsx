import { useState } from 'react';
import { useExamResults } from '@/hooks/useExamResults';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ExamResult, OOPS_QUESTIONS, TOTAL_EXAM_MARKS, TOTAL_SEMESTER_MARKS, QuestionMark, TeacherInfo } from '@/types/exam';
import { AdminLogin } from './AdminLogin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GradeDisplay } from '@/components/ui/GradeDisplay';
import { Plus, Trash2, Users, LogOut, BarChart3, Award, TrendingUp, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { isAuthenticated, login, logout, error } = useAdminAuth();
  const { results, addResult, deleteResult, getStatistics } = useExamResults();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} error={error} />;
  }

  const stats = getStatistics();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">OOPs Examination Results Management</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4" /> Add Result
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New OOPs Result</DialogTitle>
              </DialogHeader>
              <AddResultForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Statistics Summary */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgPercentage}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-full">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.passRate}%</p>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-warning/10 rounded-full">
                  <BarChart3 className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgExamMarks}/{TOTAL_EXAM_MARKS}</p>
                  <p className="text-sm text-muted-foreground">Avg Exam Marks</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Question-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {stats.questionStats.map((q) => (
                  <div key={q.questionNumber} className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Q{q.questionNumber}</p>
                    <p className="text-lg font-bold">{q.avgMarks}/{q.maxMarks}</p>
                    <p className="text-xs text-muted-foreground">{q.avgPercentage}%</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{q.topic}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade) => (
                  <div key={grade} className="flex items-center gap-2">
                    <GradeDisplay grade={grade} size="sm" />
                    <span className="font-mono">{stats.gradeDistribution[grade] || 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seat No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Exam Marks</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono">{result.seatNumber}</TableCell>
                  <TableCell>{result.studentName}</TableCell>
                  <TableCell>{result.examMarks}/{TOTAL_EXAM_MARKS}</TableCell>
                  <TableCell>{result.semesterMarks}/{TOTAL_SEMESTER_MARKS} ({result.percentage}%)</TableCell>
                  <TableCell><GradeDisplay grade={result.grade} size="sm" /></TableCell>
                  <TableCell>{result.rank ? `#${result.rank}` : '-'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { deleteResult(result.id); toast.success('Result deleted'); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AddResultForm({ onSuccess }: { onSuccess: () => void }) {
  const { addResult } = useExamResults();
  const [form, setForm] = useState({
    seatNumber: '',
    studentName: '',
    examName: 'OOPs Mid-Semester Examination 2024',
    examDate: new Date().toISOString().split('T')[0],
    subject: 'Object Oriented Programming',
    semesterMarks: 0,
    rank: undefined as number | undefined,
    remarks: '',
  });
  
  const [questions, setQuestions] = useState<QuestionMark[]>(
    OOPS_QUESTIONS.map(q => ({ questionNumber: q.questionNumber, marksObtained: 0, maxMarks: q.maxMarks }))
  );
  
  const [teacher, setTeacher] = useState<TeacherInfo>({
    name: 'Dr. Priya Mehta',
    department: 'Computer Science',
    email: 'priya.mehta@university.edu',
    designation: 'Associate Professor',
  });

  const examMarksTotal = questions.reduce((sum, q) => sum + q.marksObtained, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResult({
      ...form,
      questions,
      teacher,
    });
    toast.success('Result added successfully!');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Info */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Student Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="Seat Number (e.g., OOP003)" 
            value={form.seatNumber} 
            onChange={(e) => setForm({ ...form, seatNumber: e.target.value.toUpperCase() })} 
            required 
          />
          <Input 
            placeholder="Student Name" 
            value={form.studentName} 
            onChange={(e) => setForm({ ...form, studentName: e.target.value })} 
            required 
          />
        </div>
      </div>

      {/* Question-wise Marks */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Question-wise Marks (Total: {examMarksTotal}/{TOTAL_EXAM_MARKS})</h4>
        <div className="grid grid-cols-7 gap-2">
          {questions.map((q, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs text-muted-foreground">Q{q.questionNumber} (max {q.maxMarks})</label>
              <Input
                type="number"
                min={0}
                max={q.maxMarks}
                value={q.marksObtained}
                onChange={(e) => {
                  const n = [...questions];
                  n[i].marksObtained = Math.min(+e.target.value, q.maxMarks);
                  setQuestions(n);
                }}
                className="text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Semester Marks */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Semester Information</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Semester Marks (out of 100)</label>
            <Input
              type="number"
              min={0}
              max={TOTAL_SEMESTER_MARKS}
              value={form.semesterMarks}
              onChange={(e) => setForm({ ...form, semesterMarks: Math.min(+e.target.value, TOTAL_SEMESTER_MARKS) })}
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Rank (optional)</label>
            <Input
              type="number"
              min={1}
              value={form.rank || ''}
              onChange={(e) => setForm({ ...form, rank: e.target.value ? +e.target.value : undefined })}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Exam Date</label>
            <Input 
              type="date" 
              value={form.examDate} 
              onChange={(e) => setForm({ ...form, examDate: e.target.value })} 
              required 
            />
          </div>
        </div>
      </div>

      {/* Teacher Info */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Teacher Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="Teacher Name" 
            value={teacher.name} 
            onChange={(e) => setTeacher({ ...teacher, name: e.target.value })} 
            required 
          />
          <Input 
            placeholder="Designation" 
            value={teacher.designation || ''} 
            onChange={(e) => setTeacher({ ...teacher, designation: e.target.value })} 
          />
          <Input 
            placeholder="Department" 
            value={teacher.department} 
            onChange={(e) => setTeacher({ ...teacher, department: e.target.value })} 
            required 
          />
          <Input 
            type="email"
            placeholder="Email" 
            value={teacher.email || ''} 
            onChange={(e) => setTeacher({ ...teacher, email: e.target.value })} 
          />
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="text-xs text-muted-foreground">Remarks (optional)</label>
        <Input 
          placeholder="Teacher's remarks" 
          value={form.remarks} 
          onChange={(e) => setForm({ ...form, remarks: e.target.value })} 
        />
      </div>

      <Button type="submit" className="w-full gradient-primary text-primary-foreground">
        Save Result
      </Button>
    </form>
  );
}
