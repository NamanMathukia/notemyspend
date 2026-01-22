import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { ExpenseCard } from '@/components/ExpenseCard';
import { ExpenseForm } from '@/components/ExpenseForm';
import { EmptyState } from '@/components/EmptyState';
import { ExpensesSkeleton } from '@/components/LoadingSkeleton';
import { useExpenses, Expense } from '@/hooks/useExpenses';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Plus, Search, Calendar, CalendarDays, List } from 'lucide-react';
import { format, parseISO, isToday, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'today' | 'month';

export default function Expenses() {
  const { expenses, isLoading, deleteExpense } = useExpenses();
  const { currency } = useUserSettings();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [openDates, setOpenDates] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let result = expenses;

    // Apply date filter
    if (filter === 'today') {
      result = result.filter(exp => isToday(new Date(exp.date)));
    } else if (filter === 'month') {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      result = result.filter(exp => {
        const expDate = new Date(exp.date);
        return isWithinInterval(expDate, { start: monthStart, end: monthEnd });
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(exp => 
        exp.category.toLowerCase().includes(query) ||
        (exp.note && exp.note.toLowerCase().includes(query))
      );
    }

    return result;
  }, [expenses, filter, searchQuery]);

  // Group expenses by date
  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    filteredExpenses.forEach((expense) => {
      const dateKey = expense.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
    });
    return groups;
  }, [filteredExpenses]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedExpenses).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedExpenses]);

  const toggleDate = (date: string) => {
    setOpenDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    await deleteExpense.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <Layout>
        <ExpensesSkeleton />
      </Layout>
    );
  }

  const filterButtons: { label: string; value: FilterType; icon: React.ReactNode }[] = [
    { label: 'Today', value: 'today', icon: <Calendar className="h-4 w-4" /> },
    { label: 'This Month', value: 'month', icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'All', value: 'all', icon: <List className="h-4 w-4" /> },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-up flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Expenses
            </h2>
            <p className="mt-1 text-muted-foreground">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
            </p>
          </div>
          <Link to="/add">
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="animate-fade-up stagger-1 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            {filterButtons.map(({ label, value, icon }) => (
              <Button
                key={value}
                variant={filter === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(value)}
                className={cn(
                  'gap-1.5 transition-all',
                  filter === value && 'gradient-primary text-primary-foreground'
                )}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by category or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Expense Groups */}
        {sortedDates.length > 0 ? (
          <div className="space-y-3">
            {sortedDates.map((dateKey, index) => {
              const dateExpenses = groupedExpenses[dateKey];
              const dateTotal = dateExpenses.reduce(
                (sum, exp) => sum + Number(exp.amount),
                0
              );
              const isOpen = openDates.has(dateKey);

              return (
                <Collapsible
                  key={dateKey}
                  open={isOpen}
                  onOpenChange={() => toggleDate(dateKey)}
                  className="animate-fade-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="glass-card w-full justify-between rounded-xl px-4 py-5 hover:bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <span className="font-display text-lg font-bold text-foreground">
                            {format(parseISO(dateKey), 'd')}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground">
                            {format(parseISO(dateKey), 'EEEE')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(dateKey), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-lg font-bold text-foreground">
                          {currency}{dateTotal.toFixed(2)}
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-5 w-5 text-muted-foreground transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="space-y-2 pt-2">
                      {dateExpenses.map((expense) => (
                        <ExpenseCard
                          key={expense.id}
                          expense={expense}
                          currency={currency}
                          onEdit={setEditingExpense}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        ) : expenses.length === 0 ? (
          <EmptyState type="expenses" />
        ) : (
          <div className="glass-card animate-fade-up flex flex-col items-center justify-center rounded-2xl py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
              No matches found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
