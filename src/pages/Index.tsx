
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { BankProvider } from '@/context/BankContext';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/Navbar';

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-purple h-16 w-16 rounded-full bg-purple/20 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-purple"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated ? (
        <>
          <Navbar />
          <Dashboard />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6">
          <LoginForm />
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <BankProvider>
        <AuthenticatedApp />
      </BankProvider>
    </AuthProvider>
  );
};

export default Index;
