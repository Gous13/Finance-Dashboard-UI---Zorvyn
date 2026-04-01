import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.ComponentPropsWithoutRef<'div'> {}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={cn("px-6 py-4 border-b border-zinc-100 dark:border-zinc-800", className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={cn("px-6 py-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className, ...props }) => (
  <h3 className={cn("text-lg font-semibold text-zinc-900 dark:text-zinc-100", className)} {...props}>
    {children}
  </h3>
);
