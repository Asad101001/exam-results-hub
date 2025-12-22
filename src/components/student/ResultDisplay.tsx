import { ExamResult } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradeDisplay } from '@/components/ui/GradeDisplay';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Award, TrendingUp, ArrowLeft, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  result: ExamResult;
  onBack: () => void;
  onAskAI?: () => void;
}

export function ResultDisplay({ result, onBack, onAskAI }: ResultDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        {onAskAI && (
          <Button onClick={onAskAI} variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Ask AI Assistant
          </Button>
        )}
      </div>

      {/* Student Info Card */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <div className="gradient-primary p-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-80">Seat Number</p>
              <h2 className="text-2xl font-bold font-mono">{result.seatNumber}</h2>
            </div>
            <GradeDisplay grade={result.grade} size="lg" />
          </div>
          <h3 className="text-xl font-semibold mt-4">{result.studentName}</h3>
          <p className="text-sm opacity-80">{result.examName}</p>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{new Date(result.examDate).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
            </div>
            {result.rank && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Rank: #{result.rank}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{result.totalMarks}/{result.maxTotalMarks} marks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <ProgressRing percentage={result.percentage} size={140} />
            <p className="mt-4 text-sm text-muted-foreground">Overall Performance</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h4 className="font-semibold text-lg mb-4">Performance Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Score</span>
                <span className="font-semibold">{result.totalMarks} / {result.maxTotalMarks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Percentage</span>
                <span className="font-semibold">{result.percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Grade</span>
                <Badge variant="secondary" className="font-semibold">{result.grade}</Badge>
              </div>
              {result.rank && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Class Rank</span>
                  <span className="font-semibold">#{result.rank}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Results */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Subject-wise Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.subjects.map((subject, index) => {
              const subjectPercentage = (subject.marksObtained / subject.maxMarks) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GradeDisplay grade={subject.grade || 'N/A'} size="sm" />
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <span className="text-sm font-mono">
                      {subject.marksObtained} / {subject.maxMarks}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${subjectPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      {result.remarks && (
        <Card className="shadow-md border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <h4 className="font-semibold text-accent mb-2">Teacher's Remarks</h4>
            <p className="text-foreground">{result.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
