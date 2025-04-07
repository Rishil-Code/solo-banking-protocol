
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="w-full py-4 px-6 flex items-center justify-between bg-dark-secondary border-b border-border">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-purple rounded-full flex items-center justify-center">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-lg text-white">Engineering Bank</span>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-white"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
