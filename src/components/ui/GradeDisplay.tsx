import { cn } from '@/lib/utils';

interface GradeDisplayProps {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gradeColors: Record<string, string> = {
  'A+': 'bg-success text-success-foreground',
  'A': 'bg-success/90 text-success-foreground',
  'B+': 'bg-accent text-accent-foreground',
  'B': 'bg-accent/90 text-accent-foreground',
  'C': 'bg-warning text-warning-foreground',
  'D': 'bg-warning/80 text-warning-foreground',
  'F': 'bg-destructive text-destructive-foreground',
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export function GradeDisplay({ grade, size = 'md', className }: GradeDisplayProps) {
  const colorClass = gradeColors[grade] || 'bg-muted text-muted-foreground';

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold',
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {grade}
    </div>
  );
}
