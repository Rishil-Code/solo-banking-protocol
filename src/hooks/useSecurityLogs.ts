
import { useState } from 'react';
import { SecurityLog } from '@/lib/types';
import { saveToLocalStorage } from '@/utils/localStorage';
import { StoredUser } from '@/types/auth';

export const useSecurityLogs = (
  initialLogs: SecurityLog[] = [],
  user: any,
  isSecurityProtocolActive: boolean,
  storedUsers: StoredUser[]
) => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(initialLogs);
  
  /**
   * Adds a new security log entry
   */
  const addSecurityLog = (log: Omit<SecurityLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    };
    
    const updatedLogs = [newLog, ...securityLogs];
    setSecurityLogs(updatedLogs);
    saveToLocalStorage(user, updatedLogs, isSecurityProtocolActive, storedUsers);
    return newLog;
  };
  
  return { securityLogs, addSecurityLog, setSecurityLogs };
};
