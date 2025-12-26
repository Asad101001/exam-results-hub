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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 gradient-primary rounded-2xl shadow-glow">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground tracking-tight">
                OOPs Results Portal
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Object Oriented Programming • {getFullDateTime()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex glass-subtle rounded-xl p-1.5">
              <Button
                variant={view === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('student')}
                className={`rounded-lg transition-all ${view === 'student' ? 'gradient-primary text-primary-foreground shadow-glow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Student
              </Button>
              <Button
                variant={view === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('admin')}
                className={`rounded-lg transition-all ${view === 'admin' ? 'gradient-primary text-primary-foreground shadow-glow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Shield className="w-4 h-4 mr-2" />
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
      <footer className="glass border-t border-border/30 py-6 mt-auto relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-medium">Object Oriented Programming • Department of Computer Science</p>
          <p className="text-xs mt-1 opacity-60 font-mono">
            v1.0.0 • Built for academic excellence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
