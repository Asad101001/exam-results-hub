import { useState } from 'react';
import { StudentPortal } from '@/components/student/StudentPortal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { BookOpen, Shield } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'student' | 'admin'>('student');
  const { getFullDateTime } = useCurrentDate();

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 gradient-glow pointer-events-none opacity-50" />
      
      {/* Header */}
      <header className="border-b bg-card/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 gradient-primary rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">
                OOPs Results Portal
              </h1>
              <p className="text-xs text-muted-foreground">
                Object Oriented Programming • {getFullDateTime()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={view === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('student')}
                className={`rounded-md transition-all ${view === 'student' ? 'gradient-primary text-primary-foreground shadow-sm' : ''}`}
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                Student
              </Button>
              <Button
                variant={view === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('admin')}
                className={`rounded-md transition-all ${view === 'admin' ? 'gradient-primary text-primary-foreground shadow-sm' : ''}`}
              >
                <Shield className="w-4 h-4 mr-1.5" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {view === 'student' ? <StudentPortal /> : <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto bg-card/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Object Oriented Programming • Department of Computer Science</p>
          <p className="text-xs mt-1 opacity-70">
            Built with care for students
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
