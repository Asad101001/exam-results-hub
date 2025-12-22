import { useState } from 'react';
import { useExamResults } from '@/hooks/useExamResults';
import { ExamResult, Subject } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GradeDisplay } from '@/components/ui/GradeDisplay';
import { Plus, Trash2, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { results, addResult, deleteResult } = useExamResults();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage exam results</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary">
              <Plus className="w-4 h-4" /> Add Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Result</DialogTitle>
            </DialogHeader>
            <AddResultForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full"><Users className="w-6 h-6 text-primary" /></div>
          <div><p className="text-2xl font-bold">{results.length}</p><p className="text-sm text-muted-foreground">Total Results</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>All Results</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seat No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono">{result.seatNumber}</TableCell>
                  <TableCell>{result.studentName}</TableCell>
                  <TableCell>{result.examName}</TableCell>
                  <TableCell>{result.totalMarks}/{result.maxTotalMarks} ({result.percentage}%)</TableCell>
                  <TableCell><GradeDisplay grade={result.grade} size="sm" /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { deleteResult(result.id); toast.success('Deleted'); }}>
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
  const [form, setForm] = useState({ seatNumber: '', studentName: '', examName: 'Final Examination 2024', examDate: new Date().toISOString().split('T')[0] });
  const [subjects, setSubjects] = useState<Subject[]>([{ name: 'Mathematics', marksObtained: 0, maxMarks: 100 }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResult({ ...form, subjects });
    toast.success('Result added!');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Seat Number" value={form.seatNumber} onChange={(e) => setForm({ ...form, seatNumber: e.target.value.toUpperCase() })} required />
        <Input placeholder="Student Name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required />
        <Input placeholder="Exam Name" value={form.examName} onChange={(e) => setForm({ ...form, examName: e.target.value })} required />
        <Input type="date" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center"><span className="font-medium">Subjects</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setSubjects([...subjects, { name: '', marksObtained: 0, maxMarks: 100 }])}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {subjects.map((s, i) => (
          <div key={i} className="flex gap-2">
            <Input placeholder="Subject" value={s.name} onChange={(e) => { const n = [...subjects]; n[i].name = e.target.value; setSubjects(n); }} />
            <Input type="number" placeholder="Marks" className="w-24" value={s.marksObtained} onChange={(e) => { const n = [...subjects]; n[i].marksObtained = +e.target.value; setSubjects(n); }} />
            <Input type="number" placeholder="Max" className="w-24" value={s.maxMarks} onChange={(e) => { const n = [...subjects]; n[i].maxMarks = +e.target.value; setSubjects(n); }} />
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full gradient-primary">Save Result</Button>
    </form>
  );
}
