
import React, { useState } from 'react';
import { useBank } from '@/context/BankContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, User, DollarSign, FileText } from 'lucide-react';

const TransferFunds = () => {
  const { transferFunds, pendingTransfers } = useBank();
  const { user } = useAuth();
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiverId || !amount) return;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    
    const result = await transferFunds({
      receiverId,
      amount: amountNum,
      description
    });
    
    if (result) {
      setReceiverId('');
      setAmount('');
      setDescription('');
    }
  };
  
  return (
    <Card className="bg-card glass-card shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <ArrowRight className="w-4 h-4 mr-2" />
          Transfer Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User size={14} className="text-muted-foreground" />
              <label className="text-sm text-muted-foreground">
                Recipient ID
              </label>
            </div>
            <Input
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="Enter recipient ID"
              className="bg-muted border-none"
              disabled={pendingTransfers}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign size={14} className="text-muted-foreground" />
              <label className="text-sm text-muted-foreground">
                Amount
              </label>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-muted border-none"
              disabled={pendingTransfers}
            />
            {user && (
              <p className="text-xs text-muted-foreground">
                Available balance: ${user.balance.toFixed(2)}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText size={14} className="text-muted-foreground" />
              <label className="text-sm text-muted-foreground">
                Description (optional)
              </label>
            </div>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              className="bg-muted border-none"
              disabled={pendingTransfers}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full solo-gradient hover:opacity-90 transition-opacity"
            disabled={pendingTransfers || !receiverId || !amount}
          >
            {pendingTransfers ? "Processing..." : "Transfer Funds"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferFunds;
