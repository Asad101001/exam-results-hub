import { useState, useRef } from 'react';
import { useExamResults } from '@/hooks/useExamResults';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { ExamResult, OOPS_QUESTIONS, TOTAL_EXAM_MARKS, TOTAL_SEMESTER_MARKS, QuestionMark, TeacherInfo } from '@/types/exam';
import { AdminLogin } from './AdminLogin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { GradeDisplay } from '@/components/ui/GradeDisplay';
import { Confetti } from '@/components/ui/Confetti';
import { exportResultToPDF, exportAllResultsToPDF } from '@/utils/pdfExport';
import { isEncrypted } from '@/utils/csvEncryption';
import { 
  Plus, Trash2, Users, LogOut, BarChart3, Award, TrendingUp, BookOpen, 
  Download, Upload, FileText, Edit, Search, RefreshCw, 
  CheckCircle2, FileSpreadsheet, Settings, AlertTriangle,
  Lock, Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function AdminDashboard() {
  const { isAuthenticated, login, logout, error } = useAdminAuth();
  const { results, addResult, updateResult, deleteResult, clearAllResults, importFromCSV, exportToCSV, generateSampleCSV, loadDemoData, getStatistics } = useExamResults();
  const { getFullDateTime, getISODate } = useCurrentDate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [encryptExports, setEncryptExports] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} error={error} />;
  }

  const stats = getStatistics();
  
  const filteredResults = results.filter(r => 
    r.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const wasEncrypted = isEncrypted(content);
      const { success, errors } = importFromCSV(content);
      
      if (success > 0) {
        toast.success(`Successfully imported ${success} results! ${wasEncrypted ? '🔓 (Decrypted)' : ''} 🎉`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
      if (errors.length > 0) {
        toast.error(`${errors.length} rows failed to import`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCSVExport = () => {
    const csv = exportToCSV(encryptExports);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oops_results_${getISODate()}${encryptExports ? '_encrypted' : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`CSV exported! ${encryptExports ? '🔒 Encrypted' : '📥'}`);
  };

  const handleGenerateSampleCSV = () => {
    const csv = generateSampleCSV(30, encryptExports);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_oops_data_${getISODate()}${encryptExports ? '_encrypted' : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Sample CSV generated! ${encryptExports ? '🔒 Encrypted' : '🎲'}`);
  };

  const handleEditResult = (result: ExamResult) => {
    setEditingResult(result);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Confetti trigger={showConfetti} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 gradient-primary rounded-xl shadow-sm">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Admin Control Center
            </h2>
            <p className="text-sm text-muted-foreground">
              {getFullDateTime()}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="overview" className="gap-2"><BarChart3 className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="students" className="gap-2"><Users className="w-4 h-4" /> Students</TabsTrigger>
          <TabsTrigger value="import-export" className="gap-2"><FileSpreadsheet className="w-4 h-4" /> Import/Export</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><Settings className="w-4 h-4" /> Config</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {stats ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="agent-card hover-lift">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats.totalStudents}</p>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="agent-card hover-lift">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats.avgPercentage}%</p>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="agent-card hover-lift">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-success/10 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats.passRate}%</p>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="agent-card hover-lift">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-warning/10 rounded-xl">
                      <Award className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats.avgExamMarks}/{TOTAL_EXAM_MARKS}</p>
                      <p className="text-sm text-muted-foreground">Avg Exam Marks</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top & Bottom Performers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="agent-card border-success/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="w-5 h-5 text-success" />
                      Top Performer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{stats.topPerformer.studentName}</p>
                        <p className="text-sm text-muted-foreground">{stats.topPerformer.seatNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">{stats.topPerformer.percentage}%</p>
                        <GradeDisplay grade={stats.topPerformer.grade} size="sm" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="agent-card border-warning/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Needs Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{stats.lowestPerformer.studentName}</p>
                        <p className="text-sm text-muted-foreground">{stats.lowestPerformer.seatNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-warning">{stats.lowestPerformer.percentage}%</p>
                        <GradeDisplay grade={stats.lowestPerformer.grade} size="sm" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Question-wise Performance Chart */}
              <Card className="agent-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Question-wise Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.questionStats.map(q => ({
                        name: `Q${q.questionNumber}`,
                        avg: q.avgMarks,
                        max: q.maxMarks,
                        percentage: q.avgPercentage
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                        <XAxis dataKey="name" stroke="hsl(0 0% 60%)" fontSize={12} />
                        <YAxis stroke="hsl(0 0% 60%)" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(0 0% 10%)', 
                            border: '1px solid hsl(0 0% 20%)',
                            borderRadius: '8px',
                            color: 'hsl(0 0% 95%)'
                          }}
                          formatter={(value: number, name: string) => [
                            name === 'avg' ? `${value} marks` : `${value}%`,
                            name === 'avg' ? 'Average' : 'Percentage'
                          ]}
                        />
                        <Bar dataKey="avg" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Grade Distribution Chart */}
              <Card className="agent-card">
                <CardHeader>
                  <CardTitle>
                    Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade, index) => ({
                              name: grade,
                              value: stats.gradeDistribution[grade] || 0,
                              color: [
                                'hsl(142 72% 42%)',
                                'hsl(142 60% 50%)',
                                'hsl(200 70% 50%)',
                                'hsl(200 50% 60%)',
                                'hsl(38 92% 50%)',
                                'hsl(25 80% 50%)',
                                'hsl(0 72% 51%)'
                              ][index]
                            })).filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={[
                                  'hsl(142 72% 42%)',
                                  'hsl(142 60% 50%)',
                                  'hsl(200 70% 50%)',
                                  'hsl(200 50% 60%)',
                                  'hsl(38 92% 50%)',
                                  'hsl(25 80% 50%)',
                                  'hsl(0 72% 51%)'
                                ][index]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(0 0% 10%)', 
                              border: '1px solid hsl(0 0% 20%)',
                              borderRadius: '8px',
                              color: 'hsl(0 0% 95%)'
                            }}
                            formatter={(value: number) => [`${value} students`, 'Count']}
                          />
                          <Legend 
                            wrapperStyle={{ color: 'hsl(0 0% 60%)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Grade List */}
                    <div className="flex flex-wrap gap-3 content-start">
                      {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade) => {
                        const count = stats.gradeDistribution[grade] || 0;
                        const percentage = stats.totalStudents > 0 ? Math.round((count / stats.totalStudents) * 100) : 0;
                        return (
                          <div key={grade} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg min-w-[110px] cursor-default hover:bg-muted/70 transition-colors">
                            <GradeDisplay grade={grade} size="sm" />
                            <div>
                              <span className="font-bold">{count}</span>
                              <span className="text-xs text-muted-foreground ml-1">({percentage}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="agent-card">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No results yet. Add some students to see statistics!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or seat number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => exportAllResultsToPDF(results)} className="gap-2">
                <FileText className="w-4 h-4" /> Export All PDF
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 gradient-primary text-primary-foreground">
                    <Plus className="w-4 h-4" /> Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Add New Student Result
                    </DialogTitle>
                    <DialogDescription>Enter the student's exam details below.</DialogDescription>
                  </DialogHeader>
                  <AddResultForm onSuccess={handleAddSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="agent-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seat No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Exam</TableHead>
                    <TableHead className="text-center">Semester</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Rank</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? 'No matching results found' : 'No students added yet'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result) => (
                      <TableRow key={result.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-medium">{result.seatNumber}</TableCell>
                        <TableCell>{result.studentName}</TableCell>
                        <TableCell className="text-center">{result.examMarks}/{TOTAL_EXAM_MARKS}</TableCell>
                        <TableCell className="text-center">{result.semesterMarks}/{TOTAL_SEMESTER_MARKS} ({result.percentage}%)</TableCell>
                        <TableCell className="text-center"><GradeDisplay grade={result.grade} size="sm" /></TableCell>
                        <TableCell className="text-center">{result.rank ? `#${result.rank}` : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => exportResultToPDF(result)} title="Download PDF">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditResult(result)} title="Edit">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { deleteResult(result.id); toast.success('Deleted!'); }} title="Delete">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import-export" className="space-y-4 mt-6">
          {/* Encryption Toggle */}
          <Card className="agent-card border-primary/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {encryptExports ? <Lock className="w-5 h-5 text-primary" /> : <Unlock className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium">CSV Encryption</p>
                  <p className="text-xs text-muted-foreground">
                    {encryptExports ? 'Exports will be encrypted (harder to read directly)' : 'Exports will be plain text'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="encrypt-toggle" className="text-sm">Encrypt</Label>
                <Switch 
                  id="encrypt-toggle" 
                  checked={encryptExports} 
                  onCheckedChange={setEncryptExports} 
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="agent-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import Data
                </CardTitle>
                <CardDescription>Upload a CSV file (plain or encrypted) to bulk import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="w-full h-24 border-dashed flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span>Click to upload CSV</span>
                  <span className="text-xs text-muted-foreground">(Auto-detects encrypted files)</span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  CSV columns: SeatNumber, Name, Q1-Q7, Semester, Rank, Remarks, Teacher, Date
                </p>
              </CardContent>
            </Card>

            <Card className="agent-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Data
                  {encryptExports && <Lock className="w-4 h-4 text-primary" />}
                </CardTitle>
                <CardDescription>Download all results as CSV or PDF</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleCSVExport}>
                  <FileSpreadsheet className="w-4 h-4" />
                  Export as CSV {encryptExports && '(Encrypted)'}
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => exportAllResultsToPDF(results)}>
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleGenerateSampleCSV}>
                  <RefreshCw className="w-4 h-4" />
                  Generate Sample CSV (30 students) {encryptExports && '(Encrypted)'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-primary/50 text-primary hover:bg-primary/10" 
                  onClick={() => { loadDemoData(100); toast.success('Loaded 100 demo students!'); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 100); }}
                >
                  <Users className="w-4 h-4" />
                  Load Demo Data (100 Students)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sample CSV Format */}
          <Card className="agent-card">
            <CardHeader>
              <CardTitle className="text-base">
                CSV Format Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono">
{`SeatNumber,Name,Q1,Q2,Q3,Q4,Q5,Q6,Q7,Semester,Rank,Remarks,Teacher,Date
OOP001,Rahul Sharma,8,9,7,5,8,9,12,83,3,Good work,Dr. Priya Mehta,${getISODate()}`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Encrypted files start with "OOPS_ENC_V1:" - the system auto-detects and decrypts them on import.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="agent-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Exam Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Question Structure</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {OOPS_QUESTIONS.map((q) => (
                      <div key={q.questionNumber} className="p-2 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">Q{q.questionNumber}</p>
                        <p className="font-bold">{q.maxMarks}</p>
                      </div>
                    ))}
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold text-primary">{TOTAL_EXAM_MARKS}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium">Semester Total: <span className="text-primary">{TOTAL_SEMESTER_MARKS} marks</span></p>
                </div>
              </CardContent>
            </Card>

            <Card className="agent-card border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete all {results.length} student results.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="destructive" onClick={() => { clearAllResults(); toast.success('All results cleared'); }}>
                        Yes, delete everything
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className="text-xs text-muted-foreground">
                  This will remove all {results.length} student results permanently.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Student Result
            </DialogTitle>
            <DialogDescription>Update {editingResult?.studentName}'s details</DialogDescription>
          </DialogHeader>
          {editingResult && (
            <EditResultForm 
              result={editingResult} 
              onSuccess={() => { setIsEditDialogOpen(false); setEditingResult(null); }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddResultForm({ onSuccess }: { onSuccess: () => void }) {
  const { addResult } = useExamResults();
  const { getISODate } = useCurrentDate();
  const [form, setForm] = useState({
    seatNumber: '',
    studentName: '',
    examName: 'OOPs Mid-Semester Examination 2024',
    examDate: getISODate(),
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
    toast.success('Result added successfully! 🎉');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Student Information <Users className="w-4 h-4" />
        </h4>
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

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Question-wise Marks <BookOpen className="w-4 h-4" />
          <span className="text-primary">(Total: {examMarksTotal}/{TOTAL_EXAM_MARKS})</span>
        </h4>
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

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Semester Information <TrendingUp className="w-4 h-4" />
        </h4>
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

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Teacher Information <Award className="w-4 h-4" />
        </h4>
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

function EditResultForm({ result, onSuccess }: { result: ExamResult; onSuccess: () => void }) {
  const { updateResult } = useExamResults();
  const [form, setForm] = useState({
    seatNumber: result.seatNumber,
    studentName: result.studentName,
    examName: result.examName,
    examDate: result.examDate,
    semesterMarks: result.semesterMarks,
    rank: result.rank,
    remarks: result.remarks || '',
  });
  
  const [questions, setQuestions] = useState<QuestionMark[]>(result.questions);
  const [teacher, setTeacher] = useState<TeacherInfo>(result.teacher);

  const examMarksTotal = questions.reduce((sum, q) => sum + q.marksObtained, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateResult(result.id, {
      ...form,
      questions,
      teacher,
    });
    toast.success('Result updated! ✨');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Student Information <Users className="w-4 h-4" />
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="Seat Number" 
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

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Question-wise Marks <BookOpen className="w-4 h-4" />
          <span className="text-primary">(Total: {examMarksTotal}/{TOTAL_EXAM_MARKS})</span>
        </h4>
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

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Semester Information <TrendingUp className="w-4 h-4" />
        </h4>
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

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          Teacher Information <Award className="w-4 h-4" />
        </h4>
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

      <div>
        <label className="text-xs text-muted-foreground">Remarks (optional)</label>
        <Input 
          placeholder="Teacher's remarks" 
          value={form.remarks} 
          onChange={(e) => setForm({ ...form, remarks: e.target.value })} 
        />
      </div>

      <Button type="submit" className="w-full gradient-primary text-primary-foreground">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Update Result
      </Button>
    </form>
  );
}
