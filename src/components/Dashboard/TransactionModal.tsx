import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Transaction, TransactionCategory, TransactionType } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Partial<Transaction>) => void;
  editingTransaction: Transaction | null;
}

export const TransactionModal = ({ isOpen, onClose, onSave, editingTransaction }: TransactionModalProps) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData(editingTransaction);
    } else {
      setFormData({
        description: '',
        amount: 0,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTransaction, isOpen]);

  const categories: TransactionCategory[] = [
    'Food', 'Rent', 'Salary', 'Entertainment', 'Transport', 'Shopping', 'Utilities', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Description" 
          placeholder="e.g. Grocery Shopping" 
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Amount ($)" 
            type="number" 
            placeholder="0.00" 
            required
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          />
          <Input 
            label="Date" 
            type="date" 
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Type"
            options={[
              { label: 'Income', value: 'income' },
              { label: 'Expense', value: 'expense' },
            ]}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
          />
          <Select 
            label="Category"
            options={categories.map(c => ({ label: c, value: c }))}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
          />
        </div>
        <div className="pt-4 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {editingTransaction ? 'Update' : 'Save'} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};
