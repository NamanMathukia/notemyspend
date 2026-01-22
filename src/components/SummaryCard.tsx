import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  currency?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function SummaryCard({ title, amount, currency = '₹', icon: Icon, variant = 'primary', className }: SummaryCardProps) {
  return (
    <div
      className={cn(
        'glass-card hover-lift rounded-2xl p-5 md:p-6',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {currency}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            variant === 'primary' ? 'gradient-primary' : 'gradient-accent'
          )}
        >
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}
