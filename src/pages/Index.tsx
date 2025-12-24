import { useState } from 'react';
import { StudentPortal } from '@/components/student/StudentPortal';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FloatingShapes } from '@/components/ui/FloatingShapes';
import { Button } from '@/components/ui/button';
import { useCurrentDate } from '@/hooks/useCurrentDate';
import { BookOpen, Shield, Sparkles, Zap, Rocket, Star } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'student' | 'admin'>('student');
  const { getFullDateTime } = useCurrentDate();

  return (
    <div className="min-h-screen gradient-surface relative">
      {/* Floating background shapes for fun */}
      <FloatingShapes count={10} />
      
      {/* Ambient glow effect */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />
      
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 gradient-primary rounded-xl shadow-glow relative group hover-lift cursor-pointer">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card status-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <span className="fun-gradient-text">OOPs Results Portal</span>
                <Rocket className="w-4 h-4 text-accent fun-wiggle" />
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3 text-warning" />
                Object Oriented Programming • {getFullDateTime()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-muted rounded-xl p-1">
              <Button
                variant={view === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('student')}
                className={`rounded-lg transition-all ${view === 'student' ? 'gradient-primary text-primary-foreground shadow-md fun-pop' : ''}`}
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                Student
              </Button>
              <Button
                variant={view === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('admin')}
                className={`rounded-lg transition-all ${view === 'admin' ? 'gradient-primary text-primary-foreground shadow-md fun-pop' : ''}`}
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
          <p className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Object Oriented Programming • Department of Computer Science
            <Zap className="w-4 h-4 text-primary" />
          </p>
          <p className="text-xs mt-1 flex items-center justify-center gap-1 opacity-60">
            Built with <span className="text-destructive">❤️</span> for students
            <Star className="w-3 h-3 text-warning inline animate-sparkle" />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
