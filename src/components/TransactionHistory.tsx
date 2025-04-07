
import React from 'react';
import { useBank } from '@/context/BankContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const TransactionHistory = () => {
  const { transactions } = useBank();
  const { user } = useAuth();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      time: format(date, 'h:mm a'),
      date: format(date, 'MMM d, yyyy')
    };
  };
  
  return (
    <Card className="bg-card glass-card shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-none pr-2">
            {transactions.map((transaction) => {
              const isCredit = transaction.receiverId === user?.id;
              const { time, date } = formatDate(transaction.timestamp);
              
              return (
                <div 
                  key={transaction.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${isCredit ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}`}>
                      {isCredit ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm">
                        {isCredit 
                          ? 'Money Received' 
                          : transaction.description || 'Transfer'}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{time} - {date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`font-medium ${isCredit ? 'text-green-500' : 'text-destructive'}`}>
                    {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
