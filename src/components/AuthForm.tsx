
import { useState } from 'react';
import { retired-provider } from '@/integrations/retired-provider/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await retired-provider.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error('Error signing up', { description: error.message });
      } else {
        toast.success('Check your email!', { description: 'We sent you a confirmation link.' });
      }
    } else {
      const { error } = await retired-provider.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error('Error signing in', { description: error.message });
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAuth} className="space-y-6">
      {isSignUp && (
        <div>
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your Name" />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
      </div>
      <div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </div>
      <div className="text-center">
        <Button variant="link" type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </div>
    </form>
  );
};
