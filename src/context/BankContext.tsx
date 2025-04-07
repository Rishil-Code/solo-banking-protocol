
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransferData, User } from '@/lib/types';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface BankContextType {
  transactions: Transaction[];
  transferFunds: (transferData: TransferData) => Promise<boolean>;
  pendingTransfers: boolean;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      // Load transactions from localStorage
      const savedTransactions = localStorage.getItem('engineeringBankTransactions');
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);
        // Filter transactions for current user
        const userTransactions = parsedTransactions.filter(
          (t: Transaction) => t.senderId === user?.id || t.receiverId === user?.id
        );
        setTransactions(userTransactions);
      }
    } else {
      setTransactions([]);
    }
  }, [isAuthenticated, user]);
  
  const saveTransactions = (updatedTransactions: Transaction[]) => {
    localStorage.setItem('engineeringBankTransactions', JSON.stringify(updatedTransactions));
  };
  
  const updateUserBalance = (userId: string, newBalance: number) => {
    const savedUser = localStorage.getItem('engineeringBankUser');
    if (savedUser) {
      const userData: User = JSON.parse(savedUser);
      if (userData.id === userId) {
        userData.balance = newBalance;
        localStorage.setItem('engineeringBankUser', JSON.stringify(userData));
      }
    }
  };
  
  const transferFunds = async (transferData: TransferData): Promise<boolean> => {
    if (!user) return false;
    
    setPendingTransfers(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Check if user has enough funds
      if (user.balance < transferData.amount) {
        toast({
          title: "Transfer Failed",
          description: "Insufficient funds in your account",
          variant: "destructive",
        });
        setPendingTransfers(false);
        return false;
      }
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(2, 9),
        senderId: user.id,
        receiverId: transferData.receiverId,
        amount: transferData.amount,
        timestamp: new Date().toISOString(),
        type: "debit",
        description: transferData.description
      };
      
      // Update user's balance
      const newBalance = user.balance - transferData.amount;
      user.balance = newBalance;
      updateUserBalance(user.id, newBalance);
      
      // Update transactions list
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
      
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred $${transferData.amount.toFixed(2)}`,
        variant: "default",
      });
      
      setPendingTransfers(false);
      return true;
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: "An error occurred during the transfer",
        variant: "destructive",
      });
      setPendingTransfers(false);
      return false;
    }
  };
  
  return (
    <BankContext.Provider value={{ transactions, transferFunds, pendingTransfers }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
