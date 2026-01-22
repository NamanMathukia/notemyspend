import { Expense } from '@/hooks/useExpenses';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  currency?: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: 'bg-category-food/20 text-category-food',
  Transport: 'bg-category-transport/20 text-category-transport',
  Entertainment: 'bg-category-entertainment/20 text-category-entertainment',
  Shopping: 'bg-category-shopping/20 text-category-shopping',
  Utilities: 'bg-category-utilities/20 text-category-utilities',
  Other: 'bg-category-other/20 text-category-other',
};

export function ExpenseCard({ expense, currency = '₹', onEdit, onDelete }: ExpenseCardProps) {
  const categoryStyle = categoryColors[expense.category] || categoryColors.Other;

  return (
    <div className="glass-card hover-lift group flex items-center justify-between rounded-xl p-4 transition-all">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold',
            categoryStyle
          )}
        >
          {expense.category.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-foreground">{expense.category}</p>
          {expense.note && (
            <p className="text-sm text-muted-foreground line-clamp-1">{expense.note}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-lg font-bold text-foreground">
          {currency}{Number(expense.amount).toFixed(2)}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(expense)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
