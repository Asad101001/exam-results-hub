import { useState } from 'react';
import { useExamResults } from '@/hooks/useExamResults';
import { SeatNumberInput } from './SeatNumberInput';
import { ResultDisplay } from './ResultDisplay';
import { AIAssistant } from '../ai/AIAssistant';
import { Confetti } from '@/components/ui/Confetti';
import { ExamResult } from '@/types/exam';
import { toast } from 'sonner';

export function StudentPortal() {
  const { findBySeatNumber } = useExamResults();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSearch = (seatNumber: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const foundResult = findBySeatNumber(seatNumber);
      
      if (foundResult) {
        setResult(foundResult);
        toast.success('Result found!');
        if (foundResult.percentage >= 60) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 100);
        }
      } else {
        toast.error('No result found for this seat number');
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    setResult(null);
    setShowAI(false);
  };

  if (showAI && result) {
    return (
      <AIAssistant 
        result={result} 
        onClose={() => setShowAI(false)} 
      />
    );
  }

  if (result) {
    return (
      <>
        <Confetti trigger={showConfetti} />
        <ResultDisplay 
          result={result} 
          onBack={handleBack} 
          onAskAI={() => setShowAI(true)}
        />
      </>
    );
  }

  return <SeatNumberInput onSearch={handleSearch} isLoading={isLoading} />;
}
