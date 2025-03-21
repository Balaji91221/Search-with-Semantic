
import React from 'react';
import AuthButton from '@/components/AuthButton';
import BrandLogo from '@/components/BrandLogo';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (accessToken: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full glass-card flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <BrandLogo />
        </motion.div>
        
        <motion.div 
          className="mt-8 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h1 className="text-2xl font-medium">Semantic Search for Drive</h1>
          <p className="mt-2 text-muted-foreground">
            Connect your Google Drive to search documents using natural language
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <AuthButton onLoginSuccess={onLogin} />
        </motion.div>
      </motion.div>
      
      <motion.p 
        className="mt-8 text-sm text-muted-foreground text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        This app requires access to your Google Drive to fetch and search your text files.
        Your data is secured with proper authentication and is never shared.
      </motion.p>
    </div>
  );
};

export default LoginPage;
