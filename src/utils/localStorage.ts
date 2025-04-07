
import { User, SecurityLog } from '@/lib/types';
import { StoredUser } from '@/types/auth';

// Keys for localStorage
const KEYS = {
  USER: 'engineeringBankUser',
  LOGS: 'engineeringBankLogs',
  SECURITY_PROTOCOL: 'securityProtocolActive',
  USERS: 'engineeringBankUsers'
};

/**
 * Saves all auth-related data to localStorage
 */
export const saveToLocalStorage = (
  userData: User | null, 
  logs: SecurityLog[], 
  securityActive: boolean,
  users: StoredUser[]
) => {
  if (userData) {
    localStorage.setItem(KEYS.USER, JSON.stringify(userData));
  } else {
    localStorage.removeItem(KEYS.USER);
  }
  
  localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  localStorage.setItem(KEYS.SECURITY_PROTOCOL, securityActive.toString());
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

/**
 * Loads user data from localStorage
 */
export const loadUserFromStorage = (): User | null => {
  const savedUser = localStorage.getItem(KEYS.USER);
  return savedUser ? JSON.parse(savedUser) : null;
};

/**
 * Loads security logs from localStorage
 */
export const loadLogsFromStorage = (): SecurityLog[] => {
  const savedLogs = localStorage.getItem(KEYS.LOGS);
  return savedLogs ? JSON.parse(savedLogs) : [];
};

/**
 * Loads security protocol status from localStorage
 */
export const loadSecurityProtocolFromStorage = (): boolean => {
  return localStorage.getItem(KEYS.SECURITY_PROTOCOL) === 'true';
};

/**
 * Loads users from localStorage
 */
export const loadUsersFromStorage = (): StoredUser[] => {
  const savedUsers = localStorage.getItem(KEYS.USERS);
  return savedUsers ? JSON.parse(savedUsers) : [];
};
