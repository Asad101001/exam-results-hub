import { useState } from 'react';
import { Search, GraduationCap, Sparkles, Rocket, Star } from 'lucide-react';
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
      <div className="gradient-primary p-6 relative overflow-hidden">
        {/* Fun floating elements */}
        <div className="absolute top-2 right-4 animate-float">
          <Star className="w-4 h-4 text-primary-foreground/30" />
        </div>
        <div className="absolute bottom-3 left-6 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-3 h-3 text-primary-foreground/20" />
        </div>
        
        <div className="flex items-center justify-center gap-3 text-primary-foreground relative">
          <div className="relative">
            <GraduationCap className="w-8 h-8" />
            <Rocket className="w-4 h-4 absolute -top-1 -right-1 fun-wiggle" />
          </div>
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Check Your Results
              <Sparkles className="w-4 h-4 animate-sparkle" />
            </h2>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="seatNumber" className="text-sm font-medium text-foreground flex items-center gap-2">
              Enter Your Seat Number
              <Star className="w-3 h-3 text-warning" />
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
                className={`pl-4 pr-12 py-6 text-lg font-mono tracking-wider uppercase transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 shadow-glow' : ''}`}
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className={`w-5 h-5 transition-all ${isFocused ? 'text-primary' : ''}`} />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className={`w-full py-6 text-lg font-medium gradient-primary hover:opacity-90 transition-all ${isLoading ? '' : 'hover-lift'}`}
            disabled={!seatNumber.trim() || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                View Results
                <Rocket className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          <span className="flex items-center justify-center gap-2">
            Try: 
            <span 
              className="font-mono text-primary cursor-pointer hover:underline transition-all hover:text-primary/80" 
              onClick={() => setSeatNumber('OOP001')}
            >
              OOP001
            </span> 
            or 
            <span 
              className="font-mono text-primary cursor-pointer hover:underline transition-all hover:text-primary/80" 
              onClick={() => setSeatNumber('OOP002')}
            >
              OOP002
            </span>
            <Sparkles className="w-3 h-3 text-accent" />
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
