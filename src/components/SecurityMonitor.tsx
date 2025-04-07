
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Fingerprint, 
  UserX, FileCode, Database, RefreshCw 
} from 'lucide-react';
import { format } from 'date-fns';

const SecurityMonitor = () => {
  const { securityLogs, activateSecurityProtocol, isSecurityProtocolActive, simulateHack } = useAuth();
  
  const handleSimulateHack = (type: string) => {
    simulateHack(type);
  };
  
  const getActivityIcon = (activityType: string, success: boolean) => {
    switch (activityType) {
      case 'login':
        return success ? <CheckCircle className="text-green-500" /> : <XCircle className="text-destructive" />;
      case 'hack_attempt':
        return <AlertTriangle className="text-yellow-500" />;
      case 'security_protocol':
        return <Shield className="text-purple" />;
      case 'transfer':
        return success ? <CheckCircle className="text-green-500" /> : <XCircle className="text-destructive" />;
      default:
        return <Fingerprint className="text-blue-500" />;
    }
  };
  
  const getFormatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm:ss a');
  };
  
  return (
    <Card className="bg-card glass-card shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Security Monitor
          {isSecurityProtocolActive && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-purple/20 text-purple rounded-full">
              Protected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            size="sm"
            className={`flex-1 ${isSecurityProtocolActive ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-purple text-white hover:bg-purple-dark'}`}
            onClick={activateSecurityProtocol}
            disabled={isSecurityProtocolActive}
          >
            <Shield className="h-4 w-4 mr-1" />
            {isSecurityProtocolActive ? "Protocol Active" : "Activate Security Protocol"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="bg-muted/50 hover:bg-muted"
            onClick={() => handleSimulateHack('account access')}
          >
            <UserX className="h-3 w-3 mr-1" />
            Simulate Account Hack
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="bg-muted/50 hover:bg-muted"
            onClick={() => handleSimulateHack('transaction')}
          >
            <Database className="h-3 w-3 mr-1" />
            Simulate Transaction Hack
          </Button>
        </div>
        
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium flex items-center">
            <FileCode className="h-4 w-4 mr-1" />
            Security Logs
          </h3>
          
          <div className="max-h-[240px] overflow-y-auto scrollbar-none space-y-2 pr-2">
            {securityLogs.length > 0 ? (
              securityLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="text-xs p-2 rounded-md bg-muted/50 border border-border flex items-start"
                >
                  <div className="mr-2 mt-0.5">
                    {getActivityIcon(log.activityType, log.success)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{log.description}</p>
                    <p className="text-muted-foreground">{getFormatDate(log.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 mx-auto mb-2" />
                No security logs yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <p className="text-xs text-muted-foreground">
          Security monitoring active. All login attempts and suspicious activities are being logged.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SecurityMonitor;
