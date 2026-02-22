import { Category, Transaction, Budget, User } from '@/types';

export const mockUser: User = {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
};

export const mockCategories: Category[] = [
    { id: 'c1', name: 'Housing', color: '#EF4444', icon: 'Home' },
    { id: 'c2', name: 'Food', color: '#F59E0B', icon: 'Utensils' },
    { id: 'c3', name: 'Transportation', color: '#3B82F6', icon: 'Car' },
    { id: 'c4', name: 'Entertainment', color: '#8B5CF6', icon: 'Film' },
    { id: 'c5', name: 'Shopping', color: '#EC4899', icon: 'ShoppingBag' },
    { id: 'c6', name: 'Salary', color: '#10B981', icon: 'Briefcase' },
];

export const mockBudgets: Budget[] = [
    { categoryId: 'c1', amount: 1500 },
    { categoryId: 'c2', amount: 600 },
    { categoryId: 'c3', amount: 400 },
    { categoryId: 'c4', amount: 200 },
];

export const mockTransactions: Transaction[] = [
    { id: 't1', amount: 5000, type: 'income', categoryId: 'c6', date: '2023-10-01', notes: 'October Salary' },
    { id: 't2', amount: 1200, type: 'expense', categoryId: 'c1', date: '2023-10-05', notes: 'Rent' },
    { id: 't3', amount: 80, type: 'expense', categoryId: 'c2', date: '2023-10-06', notes: 'Groceries' },
    { id: 't4', amount: 35, type: 'expense', categoryId: 'c3', date: '2023-10-08', notes: 'Gas' },
    { id: 't5', amount: 45, type: 'expense', categoryId: 'c2', date: '2023-10-10', notes: 'Dinner out' },
    { id: 't6', amount: 150, type: 'expense', categoryId: 'c5', date: '2023-10-12', notes: 'New Shoes' },
    { id: 't7', amount: 60, type: 'expense', categoryId: 'c4', date: '2023-10-15', notes: 'Movie Night' },
    { id: 't8', amount: 120, type: 'expense', categoryId: 'c2', date: '2023-10-18', notes: 'Groceries' },
    { id: 't9', amount: 300, type: 'expense', categoryId: 'c1', date: '2023-10-20', notes: 'Utilities' },
];
