import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Navbar } from './components/Layout/Navbar';
import { SummaryCards } from './components/Dashboard/SummaryCards';
import { Charts } from './components/Dashboard/Charts';
import { TransactionTable } from './components/Dashboard/TransactionTable';
import { TransactionModal } from './components/Dashboard/TransactionModal';
import { Insights } from './components/Dashboard/Insights';
import { Button } from './components/ui/Button';
import { ConfirmationModal } from './components/ui/ConfirmationModal';
import { MOCK_TRANSACTIONS } from './data/mockData';
import { Transaction, UserRole, DashboardStats } from './types';

export default function App() {
  const [role, setRole] = useState<UserRole>('Admin');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  // Calculate stats
  const stats: DashboardStats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
    };
  }, [transactions]);

  const handleSaveTransaction = (data: Partial<Transaction>) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...data } as Transaction : t));
    } else {
      const newTransaction: Transaction = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      } as Transaction;
      setTransactions(prev => [newTransaction, ...prev]);
    }
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    setConfirmConfig({
      title: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      onConfirm: () => setTransactions(prev => prev.filter(t => t.id !== id))
    });
    setIsConfirmOpen(true);
  };

  const handleBulkDelete = (ids: string[]) => {
    setConfirmConfig({
      title: 'Delete Transactions',
      message: `Are you sure you want to delete ${ids.length} transactions? This action cannot be undone.`,
      onConfirm: () => setTransactions(prev => prev.filter(t => !ids.includes(t.id)))
    });
    setIsConfirmOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Navbar 
        role={role} 
        onRoleChange={setRole} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Welcome back! Here's what's happening with your finances today.
            </p>
          </div>
          {role === 'Admin' && (
            <Button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="shadow-lg shadow-zinc-900/10">
              <Plus className="w-5 h-5" />
              Add Transaction
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <SummaryCards stats={stats} />

        {/* Charts */}
        <Charts transactions={transactions} />

        {/* Insights */}
        <Insights transactions={transactions} />

        {/* Transactions Table */}
        <TransactionTable 
          transactions={transactions} 
          role={role} 
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onBulkDelete={handleBulkDelete}
        />
      </main>

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Confirmation Modal */}
      {confirmConfig && (
        <ConfirmationModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText="Delete"
        />
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <p>© 2026 FinTrack Dashboard. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
