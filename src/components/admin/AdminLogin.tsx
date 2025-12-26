import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  error: string | null;
}

export function AdminLogin({ onLogin, error }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      onLogin(password);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <Card className="w-full max-w-md glass-card border-primary/20">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto p-5 gradient-primary rounded-2xl w-fit shadow-glow">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription className="mt-2">
              Enter the portal password to access the control center
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 py-6 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/30"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 gradient-primary text-primary-foreground font-semibold shadow-glow"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Access Control Center'
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center mt-6 pt-4 border-t border-border/30">
            Contact your department administrator for access credentials.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
