
import { AuthForm } from '@/components/AuthForm';

const AuthPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Welcome
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
