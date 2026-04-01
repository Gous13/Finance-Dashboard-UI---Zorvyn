import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Transaction, TransactionCategory, TransactionType, UserRole } from '../../types';
import { format, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  role: UserRole;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

export const TransactionTable = ({ transactions, role, onEdit, onDelete, onBulkDelete }: TransactionTableProps) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const categories: TransactionCategory[] = [
    'Food', 'Rent', 'Salary', 'Entertainment', 'Transport', 'Shopping', 'Utilities', 'Other'
  ];

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                           t.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDeleteClick = () => {
    onBulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <div className="relative space-y-4">
      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && role === 'Admin' && (
        <div className="sticky top-20 z-30 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">
              {selectedIds.size} transaction{selectedIds.size > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-white dark:text-zinc-900 hover:bg-white/10 dark:hover:bg-zinc-100"
              onClick={() => setSelectedIds(new Set())}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="bg-red-500 hover:bg-red-600 border-none"
              onClick={handleBulkDeleteClick}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Recent Transactions</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select 
            className="w-full md:w-32"
            options={[
              { label: 'All Types', value: 'all' },
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
            ]}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Select 
            className="w-full md:w-40"
            options={[
              { label: 'All Categories', value: 'all' },
              ...categories.map(c => ({ label: c, value: c }))
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {role === 'Admin' && (
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                    checked={selectedIds.size === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Description</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400 text-right">Amount</th>
              {role === 'Admin' && (
                <th className="px-6 py-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr 
                  key={t.id} 
                  className={cn(
                    "border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors",
                    selectedIds.has(t.id) && "bg-zinc-50 dark:bg-zinc-800/50"
                  )}
                >
                  {role === 'Admin' && (
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                        checked={selectedIds.has(t.id)}
                        onChange={() => toggleSelect(t.id)}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {format(parseISO(t.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {t.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {t.category}
                    </span>
                  </td>
                  <td className={cn(
                    "px-6 py-4 text-sm font-bold text-right",
                    t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  {role === 'Admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(t)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'Admin' ? 6 : 4} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or search query</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
      </Card>
    </div>
  );
};
