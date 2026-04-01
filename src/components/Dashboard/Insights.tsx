import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Transaction } from '../../types';

interface InsightsProps {
  transactions: Transaction[];
}

export const Insights = ({ transactions }: InsightsProps) => {
  // Highest spending category
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const highestCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];

  // Monthly comparison (simplified for mock data)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  const insights = [
    {
      title: 'Top Spending',
      value: highestCategory ? `${highestCategory[0]} ($${highestCategory[1].toLocaleString()})` : 'N/A',
      icon: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Financial Tip',
      value: savingsRate < 20 ? 'Try to save at least 20% of your income.' : 'Great job! You are saving well.',
      icon: Lightbulb,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <Card key={insight.title} className="bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed">
          <CardContent className="flex items-start gap-4 py-4">
            <div className={`p-2 rounded-lg ${insight.bg} mt-1`}>
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {insight.title}
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {insight.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
