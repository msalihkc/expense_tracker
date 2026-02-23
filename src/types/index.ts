export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  paymentMode: "Cash" | "GPay" | "Other";
  notes?: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
