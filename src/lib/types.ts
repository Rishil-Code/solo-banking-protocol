
export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  creationDate: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  timestamp: string;
  type: "credit" | "debit";
  description?: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  activityType: "login" | "transfer" | "hack_attempt" | "security_protocol";
  timestamp: string;
  description: string;
  success: boolean;
}

export interface TransferData {
  receiverId: string;
  amount: number;
  description?: string;
}
