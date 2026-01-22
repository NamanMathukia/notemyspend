import { cn } from '@/lib/utils';

interface BudgetProgressRingProps {
  spent: number;
  budget: number;
  currency: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BudgetProgressRing({ spent, budget, currency, size = 'md' }: BudgetProgressRingProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const overBudget = spent > budget;
  
  const sizes = {
    sm: { ring: 80, stroke: 8, text: 'text-sm' },
    md: { ring: 120, stroke: 10, text: 'text-base' },
    lg: { ring: 160, stroke: 12, text: 'text-lg' },
  };
  
  const { ring, stroke, text } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (overBudget) return 'text-destructive';
    if (percentage >= 80) return 'text-orange-500';
    return 'text-primary';
  };

  const getTrackColor = () => {
    if (overBudget) return 'stroke-destructive/20';
    if (percentage >= 80) return 'stroke-orange-500/20';
    return 'stroke-primary/20';
  };

  const getStrokeColor = () => {
    if (overBudget) return 'stroke-destructive';
    if (percentage >= 80) return 'stroke-orange-500';
    return 'stroke-primary';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={ring} height={ring} className="-rotate-90">
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={cn('transition-all duration-300', getTrackColor())}
        />
        <circle
          cx={ring / 2}
          cy={ring / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-500 ease-out', getStrokeColor())}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn('font-display font-bold', text, getColor())}>
          {percentage.toFixed(0)}%
        </span>
        <span className="text-xs text-muted-foreground">
          {overBudget ? 'Over!' : 'of budget'}
        </span>
      </div>
    </div>
  );
}
