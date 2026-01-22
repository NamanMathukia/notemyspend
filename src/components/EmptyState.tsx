import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Receipt, Target, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'expenses' | 'budget' | 'reports';
  className?: string;
}

const emptyStates = {
  expenses: {
    icon: Receipt,
    emoji: '📝',
    title: 'No expenses yet',
    description: 'Add your first expense to start tracking your spending.',
    action: { label: 'Add Expense', path: '/add' },
  },
  budget: {
    icon: Target,
    emoji: '🎯',
    title: 'No budget set',
    description: 'Set a monthly budget to track your spending goals.',
    action: null,
  },
  reports: {
    icon: PieChart,
    emoji: '📊',
    title: 'No data to report',
    description: 'Add some expenses to see your spending analytics.',
    action: { label: 'Add Expense', path: '/add' },
  },
};

export function EmptyState({ type, className }: EmptyStateProps) {
  const { emoji, title, description, action } = emptyStates[type];

  return (
    <div className={cn(
      'glass-card animate-fade-up flex flex-col items-center justify-center rounded-2xl py-16 px-6 text-center',
      className
    )}>
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
        <span className="text-4xl">{emoji}</span>
      </div>
      <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="mb-6 max-w-xs text-muted-foreground">
        {description}
      </p>
      {action && (
        <Link to={action.path}>
          <Button className="gap-2 gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  );
}
