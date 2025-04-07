
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, Lock, User, Mail, UserPlus, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LoginForm = () => {
  const { login, createAccount } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [initialBalance, setInitialBalance] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await createAccount(username, password, email, parseFloat(initialBalance) || 1000);
      if (success) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully. You can now log in.",
          variant: "default",
        });
      } else {
        toast({
          title: "Account Creation Failed",
          description: "Username may already exist or there was an issue creating your account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Account Creation Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="h-12 w-12 bg-purple rounded-full flex items-center justify-center purple-glow">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">Engineering Bank</h1>
        <div className="solo-gradient h-1 w-24 rounded-full" />
        <p className="text-muted-foreground">Solo Banking Protocol</p>
      </div>
      
      <Card className="w-full bg-card glass-card shadow-lg">
        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="create">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                  </div>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="bg-muted border-none"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Lock size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-muted-foreground">
                      Password
                    </label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-muted border-none"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full solo-gradient hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Login"}
                  </Button>
                </div>
                
                <div className="text-xs text-center text-muted-foreground">
                  <p>Demo credentials: username: "jaya", password: "ntr"</p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="create">
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserPlus size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                  </div>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="bg-muted border-none"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-muted border-none"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Key size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-muted-foreground">
                      Password
                    </label>
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="bg-muted border-none"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="text-muted-foreground">$</div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Initial Balance
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    placeholder="Initial balance"
                    className="bg-muted border-none"
                    disabled={isLoading}
                    min="0"
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full solo-gradient hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
