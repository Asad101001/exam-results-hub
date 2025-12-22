import { useState } from 'react';
import { StudentPortal } from '@/components/student/StudentPortal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, Moon, Sun } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'student' | 'admin'>('student');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen gradient-surface">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">OOPs Results Portal</h1>
              <p className="text-xs text-muted-foreground">Object Oriented Programming Examination</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={view === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('student')}
                className={view === 'student' ? 'gradient-primary text-primary-foreground' : ''}
              >
                Student
              </Button>
              <Button
                variant={view === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('admin')}
                className={view === 'admin' ? 'gradient-primary text-primary-foreground' : ''}
              >
                <Shield className="w-4 h-4 mr-1" /> Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === 'student' ? <StudentPortal /> : <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Object Oriented Programming • Department of Computer Science</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
