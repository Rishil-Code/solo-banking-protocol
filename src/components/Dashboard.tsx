
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import TransactionHistory from './TransactionHistory';
import TransferFunds from './TransferFunds';
import SecurityMonitor from './SecurityMonitor';

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container py-8 px-4 md:px-8 mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Account Info & Transfer */}
        <div className="space-y-6">
          <Card className="bg-card glass-card shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Account Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold py-2 flex items-center">
                <span className="text-purple mr-1">$</span>
                {user.balance.toFixed(2)}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> 
                  Member since: {formatDate(user.creationDate)}
                </p>
                <div className="flex items-center text-xs font-medium text-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TransferFunds />
        </div>
        
        {/* Middle column - Transaction History */}
        <div>
          <TransactionHistory />
        </div>
        
        {/* Right column - Security Monitor */}
        <div>
          <SecurityMonitor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
