
import { User, SecurityLog } from '@/lib/types';

// Extended User with password for storage
export interface StoredUser extends User {
  password: string;
}

// Auth context type definition
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  securityLogs: SecurityLog[];
  activateSecurityProtocol: () => void;
  isSecurityProtocolActive: boolean;
  simulateHack: (type: string) => void;
  createAccount: (username: string, password: string, email: string, initialBalance: number) => Promise<boolean>;
}

// Initial mock users
export const MOCK_USERS: StoredUser[] = [
  {
    id: '1',
    username: 'jaya',
    password: 'ntr',
    email: 'jaya@example.com',
    balance: 10000,
    creationDate: new Date().toISOString()
  }
];
