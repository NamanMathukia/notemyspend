import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { BudgetProgressRing } from '@/components/BudgetProgressRing';
import { useBudget } from '@/hooks/useBudget';
import { useExpenses } from '@/hooks/useExpenses';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Loader2, Edit2, Check, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

export default function Budget() {
  const { budget, isLoading: budgetLoading, setBudget } = useBudget();
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { currency } = useUserSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const monthSpent = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return isWithinInterval(expDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses]);

  const handleSave = async () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    await setBudget.mutateAsync(amount);
    setIsEditing(false);
    setBudgetAmount('');
  };

  const startEditing = () => {
    setBudgetAmount(budget?.amount?.toString() || '');
    setIsEditing(true);
  };

  if (budgetLoading || expensesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const budgetAmount_ = budget?.amount || 0;
  const remaining = budgetAmount_ - monthSpent;
  const dailyAllowance = remaining > 0 
    ? remaining / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1)
    : 0;

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="animate-fade-up">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Budget
          </h2>
          <p className="mt-1 text-muted-foreground">
            {format(new Date(), 'MMMM yyyy')} budget tracking
          </p>
        </div>

        {/* Budget Overview Card */}
        <div className="animate-fade-up stagger-1 glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Monthly Budget
              </h3>
              <p className="text-sm text-muted-foreground">
                Track your spending limit
              </p>
            </div>
            {!isEditing && (
              <Button variant="ghost" size="icon" onClick={startEditing}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Amount ({currency})</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter budget amount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={setBudget.isPending}
                  className="flex-1 gradient-primary text-primary-foreground"
                >
                  {setBudget.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : budgetAmount_ > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <BudgetProgressRing 
                spent={monthSpent} 
                budget={budgetAmount_} 
                currency={currency}
                size="lg"
              />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Budget</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {currency}{budgetAmount_.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Spent</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {currency}{monthSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                    <p className={`font-display text-xl font-bold ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {currency}{Math.abs(remaining).toLocaleString()}
                      {remaining < 0 && ' over'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Daily Allowance</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      {currency}{dailyAllowance.toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-secondary">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="mb-2 font-display text-lg font-semibold text-foreground">
                No budget set
              </h4>
              <p className="mb-4 text-muted-foreground">
                Set a monthly budget to track your spending
              </p>
              <Button onClick={startEditing} className="gradient-primary text-primary-foreground">
                Set Budget
              </Button>
            </div>
          )}
        </div>

        {/* Tips Card */}
        {budgetAmount_ > 0 && (
          <div className="animate-fade-up stagger-2 glass-card rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Budget Tips
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary">•</span>
                <span>You have {currency}{dailyAllowance.toFixed(0)} left to spend per day this month</span>
              </li>
              {remaining < budgetAmount_ * 0.2 && remaining > 0 && (
                <li className="flex items-start gap-3">
                  <span className="text-orange-500">•</span>
                  <span className="text-orange-600">You're approaching your budget limit!</span>
                </li>
              )}
              {remaining < 0 && (
                <li className="flex items-start gap-3">
                  <span className="text-destructive">•</span>
                  <span className="text-destructive">You've exceeded your budget by {currency}{Math.abs(remaining).toFixed(0)}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
