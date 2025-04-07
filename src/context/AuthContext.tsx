
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SecurityLog } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { AuthContextType, StoredUser, MOCK_USERS } from '@/types/auth';
import { useSecurityLogs } from '@/hooks/useSecurityLogs';
import { 
  saveToLocalStorage, 
  loadUserFromStorage, 
  loadLogsFromStorage,
  loadSecurityProtocolFromStorage,
  loadUsersFromStorage
} from '@/utils/localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSecurityProtocolActive, setIsSecurityProtocolActive] = useState(false);
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>(MOCK_USERS);
  
  useEffect(() => {
    // Load data from localStorage
    const savedUser = loadUserFromStorage();
    const savedLogs = loadLogsFromStorage();
    const securityProtocol = loadSecurityProtocolFromStorage();
    const savedUsers = loadUsersFromStorage();
    
    if (savedUser) {
      setUser(savedUser);
    }
    
    if (securityProtocol) {
      setIsSecurityProtocolActive(true);
    }

    if (savedUsers.length > 0) {
      setStoredUsers(savedUsers);
    } else {
      // Initialize users in localStorage if not already present
      localStorage.setItem('engineeringBankUsers', JSON.stringify(MOCK_USERS));
    }
    
    setIsLoading(false);
  }, []);
  
  // Initialize security logs
  const { securityLogs, addSecurityLog, setSecurityLogs } = useSecurityLogs(
    loadLogsFromStorage(), 
    user, 
    isSecurityProtocolActive, 
    storedUsers
  );
  
  const createAccount = async (username: string, password: string, email: string, initialBalance: number): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if username already exists
    if (storedUsers.some(u => u.username === username)) {
      addSecurityLog({
        userId: '0',
        activityType: 'security_protocol',
        description: `Failed account creation: Username "${username}" already exists`,
        success: false
      });
      return false;
    }
    
    // Create new user
    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      password, // In a real app, this would be hashed
      email,
      balance: initialBalance,
      creationDate: new Date().toISOString()
    };
    
    const updatedUsers = [...storedUsers, newUser];
    setStoredUsers(updatedUsers);
    
    addSecurityLog({
      userId: newUser.id,
      activityType: 'security_protocol',
      description: `Account created for user "${username}"`,
      success: true
    });
    
    saveToLocalStorage(user, securityLogs, isSecurityProtocolActive, updatedUsers);
    return true;
  };
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = storedUsers.find(u => u.username === username && u.password === password);
    
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
      
      saveToLocalStorage(userData, securityLogs, isSecurityProtocolActive, storedUsers);
      return true;
    } else {
      // Log failed login attempt
      addSecurityLog({
        userId: '0',
        activityType: 'login',
        description: `Failed login attempt with username: ${username}`,
        success: false
      });
      
      saveToLocalStorage(null, securityLogs, isSecurityProtocolActive, storedUsers);
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
    saveToLocalStorage(null, securityLogs, isSecurityProtocolActive, storedUsers);
  };
  
  const activateSecurityProtocol = () => {
    setIsSecurityProtocolActive(true);
    
    addSecurityLog({
      userId: user?.id || '0',
      activityType: 'security_protocol',
      description: 'Security protocol activated',
      success: true
    });
    
    saveToLocalStorage(user, securityLogs, true, storedUsers);
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
        simulateHack,
        createAccount
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
