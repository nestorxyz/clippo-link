
import { AuthForm } from '@/components/AuthForm';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background text-center p-4 sm:p-8 relative">
      <header className="absolute top-8">
        <Link to="/" className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Bookmark className="w-6 h-6" />
          <span>LinkWhisper</span>
        </Link>
      </header>

      <main className="w-full max-w-sm mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue to LinkWhisper
        </p>
        <div className="mt-8">
          <AuthForm />
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-xs text-muted-foreground max-w-md">
        <p>By proceeding, you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a> and acknowledge that our <a href="#" className="underline hover:text-foreground">Privacy Policy</a> applies to you.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
