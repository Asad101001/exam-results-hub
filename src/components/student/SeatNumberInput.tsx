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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seatNumber.trim()) {
      onSearch(seatNumber.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 overflow-hidden">
      <div className="gradient-primary p-6">
        <div className="flex items-center justify-center gap-3 text-primary-foreground">
          <GraduationCap className="w-8 h-8" />
          <h2 className="text-xl font-semibold">Check Your Results</h2>
        </div>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="seatNumber" className="text-sm font-medium text-foreground">
              Enter Your Seat Number
            </label>
            <div className="relative">
              <Input
                id="seatNumber"
                type="text"
                placeholder="e.g., A001"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                className="pl-4 pr-12 py-6 text-lg font-mono tracking-wider uppercase"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-6 text-lg font-medium gradient-primary hover:opacity-90 transition-opacity"
            disabled={!seatNumber.trim() || isLoading}
          >
            {isLoading ? 'Searching...' : 'View Results'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Try: <span className="font-mono text-primary cursor-pointer" onClick={() => setSeatNumber('A001')}>A001</span> or{' '}
          <span className="font-mono text-primary cursor-pointer" onClick={() => setSeatNumber('A002')}>A002</span>
        </p>
      </CardContent>
    </Card>
  );
}
