export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Food' 
  | 'Rent' 
  | 'Salary' 
  | 'Entertainment' 
  | 'Transport' 
  | 'Shopping' 
  | 'Utilities' 
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
}

export type UserRole = 'Viewer' | 'Admin';

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}
