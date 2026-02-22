export type TransactionType = 'sale' | 'expense' | 'withdrawal' | 'loss';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  image: string;
}

export interface DailySummary {
  revenue: number;
  expenses: number;
  withdrawals: number;
  losses: number;
  netProfit: number;
}

export interface AuditLog {
  id: string;
  action: string;
  targetId: string;
  details: string;
  timestamp: number;
}

export interface DaySession {
  id: string;
  openedAt: number;
  closedAt?: number;
  status: 'open' | 'closed';
}
