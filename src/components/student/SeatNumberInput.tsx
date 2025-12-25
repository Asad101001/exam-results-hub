import { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SeatNumberInputProps {
  onSearch: (seatNumber: string) => void;
  isLoading?: boolean;
}

export function SeatNumberInput({ onSearch, isLoading }: SeatNumberInputProps) {
  const [seatNumber, setSeatNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seatNumber.trim()) {
      onSearch(seatNumber.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 overflow-hidden hover-lift">
      <div className="gradient-primary p-6">
        <div className="flex items-center justify-center gap-3 text-primary-foreground">
          <GraduationCap className="w-7 h-7" />
          <h2 className="text-xl font-semibold">Check Your Results</h2>
        </div>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="seatNumber" className="text-sm font-medium text-foreground">
              Enter Your Seat Number
            </label>
            <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-[1.01]' : ''}`}>
              <Input
                id="seatNumber"
                type="text"
                placeholder="e.g., OOP001"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`pl-4 pr-12 py-6 text-lg font-mono tracking-wider uppercase transition-all duration-200 ${isFocused ? 'ring-2 ring-primary/40' : ''}`}
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-primary' : ''}`} />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-6 text-lg font-medium gradient-primary hover:opacity-90 transition-all"
            disabled={!seatNumber.trim() || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Searching...
              </span>
            ) : (
              'View Results'
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Try: 
          <span 
            className="font-mono text-primary cursor-pointer hover:underline ml-1" 
            onClick={() => setSeatNumber('OOP001')}
          >
            OOP001
          </span> 
          {' '}or{' '}
          <span 
            className="font-mono text-primary cursor-pointer hover:underline" 
            onClick={() => setSeatNumber('OOP002')}
          >
            OOP002
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
