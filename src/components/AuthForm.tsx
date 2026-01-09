import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-6 w-6 mr-3"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.486,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export const AuthForm = () => {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState<
    'google' | 'email-signin' | 'email-signup' | null
  >(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');

  const signInWithGoogle = async () => {
    setLoading('google');
    try {
      await signIn('google', { redirectTo: '/dashboard' });
    } catch (error) {
      toast.error('Error with Google Sign-in', {
        description: (error as Error).message,
      });
      setLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }
    setLoading(flow === 'signIn' ? 'email-signin' : 'email-signup');
    try {
      await signIn('password', {
        email,
        password,
        flow: flow,
        redirectTo: '/dashboard',
      });
      // Note: Convex Auth handles redirect or success state.
    } catch (error) {
      toast.error(`Error signing ${flow === 'signIn' ? 'in' : 'up'}`, {
        description: (error as Error).message,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={!!loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={!!loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            type="submit"
            onClick={() => setFlow('signIn')}
            disabled={!!loading}
            className="w-full"
          >
            {loading === 'email-signin' && (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            Sign In
          </Button>
          <Button
            type="submit"
            onClick={() => setFlow('signUp')}
            disabled={!!loading}
            className="w-full"
            variant="secondary"
          >
            {loading === 'email-signup' && (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            )}
            Sign Up
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full text-base bg-[#EBEBEB] hover:bg-[#EBEBEB] hover:text-black text-black py-6 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        style={{
          boxShadow:
            '0 8px 32px rgba(234, 100, 211, 0.3), 0 4px 16px rgba(234, 100, 211, 0.2)',
        }}
        onClick={signInWithGoogle}
        disabled={!!loading}
      >
        {loading === 'google' ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
};
