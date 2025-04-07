
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SecurityLog } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  securityLogs: SecurityLog[];
  activateSecurityProtocol: () => void;
  isSecurityProtocolActive: boolean;
  simulateHack: (type: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    username: 'jaya',
    password: 'ntr',
    email: 'jaya@example.com',
    balance: 10000,
    creationDate: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [isSecurityProtocolActive, setIsSecurityProtocolActive] = useState(false);
  
  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('engineeringBankUser');
    const savedLogs = localStorage.getItem('engineeringBankLogs');
    const securityProtocol = localStorage.getItem('securityProtocolActive');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedLogs) {
      setSecurityLogs(JSON.parse(savedLogs));
    }
    
    if (securityProtocol === 'true') {
      setIsSecurityProtocolActive(true);
    }
    
    setIsLoading(false);
  }, []);
  
  const saveToLocalStorage = (userData: User | null, logs: SecurityLog[], securityActive: boolean) => {
    if (userData) {
      localStorage.setItem('engineeringBankUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('engineeringBankUser');
    }
    
    localStorage.setItem('engineeringBankLogs', JSON.stringify(logs));
    localStorage.setItem('securityProtocolActive', securityActive.toString());
  };
  
  const addSecurityLog = (log: Omit<SecurityLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    
    const updatedLogs = [newLog, ...securityLogs];
    setSecurityLogs(updatedLogs);
    saveToLocalStorage(user, updatedLogs, isSecurityProtocolActive);
    return newLog;
  };
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        balance: foundUser.balance,
        creationDate: foundUser.creationDate
      };
      
      setUser(userData);
      
      addSecurityLog({
        userId: userData.id,
        activityType: 'login',
        description: `Successful login by ${username}`,
        success: true
      });
      
      saveToLocalStorage(userData, securityLogs, isSecurityProtocolActive);
      return true;
    } else {
      // Log failed login attempt
      addSecurityLog({
        userId: '0',
        activityType: 'login',
        description: `Failed login attempt with username: ${username}`,
        success: false
      });
      
      saveToLocalStorage(null, securityLogs, isSecurityProtocolActive);
      return false;
    }
  };
  
  const logout = () => {
    if (user) {
      addSecurityLog({
        userId: user.id,
        activityType: 'login',
        description: `User ${user.username} logged out`,
        success: true
      });
    }
    
    setUser(null);
    saveToLocalStorage(null, securityLogs, isSecurityProtocolActive);
  };
  
  const activateSecurityProtocol = () => {
    setIsSecurityProtocolActive(true);
    
    addSecurityLog({
      userId: user?.id || '0',
      activityType: 'security_protocol',
      description: 'Security protocol activated',
      success: true
    });
    
    saveToLocalStorage(user, securityLogs, true);
    toast({
      title: "Security Protocol Activated",
      description: "Your account is now protected against hacking attempts",
      variant: "default",
    });
  };
  
  const simulateHack = (type: string) => {
    if (isSecurityProtocolActive) {
      toast({
        title: "Hacking Attempt Blocked",
        description: "You can't hack this account as it is protected",
        variant: "destructive",
      });
      
      addSecurityLog({
        userId: user?.id || '0',
        activityType: 'hack_attempt',
        description: `Blocked ${type} hack attempt - Security Protocol Active`,
        success: false
      });
    } else {
      toast({
        title: "Hacking Attempt Detected",
        description: `Simulated ${type} hack detected in your account`,
        variant: "destructive",
      });
      
      addSecurityLog({
        userId: user?.id || '0',
        activityType: 'hack_attempt',
        description: `Successful ${type} hack attempt`,
        success: true
      });
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        securityLogs,
        activateSecurityProtocol,
        isSecurityProtocolActive,
        simulateHack
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
