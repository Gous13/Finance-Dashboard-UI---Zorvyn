import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { DashboardStats } from '../../types';

interface SummaryCardsProps {
  stats: DashboardStats;
}

export const SummaryCards = ({ stats }: SummaryCardsProps) => {
  const cards = [
    {
      title: 'Total Balance',
      value: stats.totalBalance,
      icon: Wallet,
      color: 'text-zinc-900 dark:text-zinc-100',
      bg: 'bg-zinc-100 dark:bg-zinc-800',
    },
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 py-6">
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>
                ${card.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
