
import { AuthForm } from '@/components/AuthForm';
import { Bookmark } from 'lucide-react';

const AuthPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background text-center p-4 sm:p-8 relative">
      <header className="absolute top-8">
        <div className="text-lg font-bold flex items-center gap-2 text-foreground">
          <Bookmark className="w-6 h-6" />
          <span>LinkWhisper</span>
        </div>
      </header>

      <main className="w-full max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Your super smart knowledge hub
        </h1>
        <p className="mt-4 text-md sm:text-lg text-muted-foreground">
          A smart tool to capture, organize and utilize your knowledge.
        </p>
        <div className="mt-12 max-w-sm mx-auto">
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
