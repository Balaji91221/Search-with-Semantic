import React from 'react';
import { Button } from "@/components/ui/button";
import { loginWithGoogle } from '@/lib/api';
import { toast } from '@/lib/toast';
import { LogIn } from 'lucide-react';
import { GOOGLE_CLIENT_ID } from '@/lib/constants';

interface AuthButtonProps {
  onLoginSuccess: (accessToken: string) => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!GOOGLE_CLIENT_ID) {
        toast.error('Google Client ID is not configured');
        return;
      }

      const user = await loginWithGoogle();

      if (user?.accessToken) {
        toast.success('Successfully logged in');
        onLoginSuccess(user.accessToken);
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className="font-medium px-6 py-6 rounded-xl bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-subtle flex items-center gap-2 transition-all duration-300"
    >
      {isLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <LogIn className="h-5 w-5" />
          <span>Sign in with Google</span>
        </>
      )}
    </Button>
  );
};

export default AuthButton;
