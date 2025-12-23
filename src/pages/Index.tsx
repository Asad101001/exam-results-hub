import { useState } from 'react';
import { StudentPortal } from '@/components/student/StudentPortal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, Moon, Sun, Sparkles, Zap } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'student' | 'admin'>('student');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen gradient-surface">
      {/* Ambient glow effect */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />
      
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 gradient-primary rounded-xl shadow-glow relative">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card status-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                OOPs Results Portal
                <Sparkles className="w-4 h-4 text-accent" />
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Object Oriented Programming • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="flex bg-muted rounded-xl p-1">
              <Button
                variant={view === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('student')}
                className={`rounded-lg ${view === 'student' ? 'gradient-primary text-primary-foreground shadow-md' : ''}`}
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                Student
              </Button>
              <Button
                variant={view === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('admin')}
                className={`rounded-lg ${view === 'admin' ? 'gradient-primary text-primary-foreground shadow-md' : ''}`}
              >
                <Shield className="w-4 h-4 mr-1.5" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative">
        {view === 'student' ? <StudentPortal /> : <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Object Oriented Programming • Department of Computer Science
            <Zap className="w-4 h-4 text-primary" />
          </p>
          <p className="text-xs mt-1 opacity-60">Built with ❤️ for students</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;