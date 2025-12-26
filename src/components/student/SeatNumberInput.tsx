import { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import heroPattern from '@/assets/hero-pattern.png';

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
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl opacity-30">
        <img src={heroPattern} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <Card className="w-full max-w-md mx-auto glass-card border-primary/20 overflow-hidden hover-lift">
        <div className="gradient-primary p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary-foreground/10" />
          <div className="relative flex flex-col items-center gap-4 text-primary-foreground">
            <div className="p-4 bg-primary-foreground/20 rounded-2xl backdrop-blur-sm">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Check Your Results</h2>
              <p className="text-sm opacity-80 mt-1">Enter your seat number to view your exam results</p>
            </div>
          </div>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="seatNumber" className="text-sm font-medium text-foreground">
                Seat Number
              </label>
              <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
                <Input
                  id="seatNumber"
                  type="text"
                  placeholder="e.g., OOP001"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value.toUpperCase())}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`pl-4 pr-12 py-6 text-lg font-mono tracking-widest uppercase bg-secondary/50 border-border/50 transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 border-primary/50 shadow-glow' : ''}`}
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search className={`w-5 h-5 transition-all duration-300 ${isFocused ? 'text-primary scale-110' : 'text-muted-foreground'}`} />
                </div>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold gradient-primary hover:opacity-90 transition-all shadow-glow"
              disabled={!seatNumber.trim() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Searching...
                </span>
              ) : (
                'View Results'
              )}
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-6 pt-6 border-t border-border/30">
            <p className="mb-2">Demo seat numbers:</p>
            <div className="flex justify-center gap-3">
              <span 
                className="font-mono text-primary cursor-pointer hover:underline px-3 py-1 bg-primary/10 rounded-lg transition-all hover:bg-primary/20" 
                onClick={() => setSeatNumber('OOP001')}
              >
                OOP001
              </span>
              <span 
                className="font-mono text-primary cursor-pointer hover:underline px-3 py-1 bg-primary/10 rounded-lg transition-all hover:bg-primary/20" 
                onClick={() => setSeatNumber('OOP002')}
              >
                OOP002
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
