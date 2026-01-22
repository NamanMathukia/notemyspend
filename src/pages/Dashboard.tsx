import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SummaryCard } from '@/components/SummaryCard';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import { BudgetProgressRing } from '@/components/BudgetProgressRing';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import { useExpenses } from '@/hooks/useExpenses';
import { useCategories } from '@/hooks/useCategories';
import { useBudget } from '@/hooks/useBudget';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Plus, Receipt, Target } from 'lucide-react';
import { format, isToday, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export default function Dashboard() {
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { initializeDefaultCategories } = useCategories();
  const { budget, isLoading: budgetLoading } = useBudget();
  const { currency } = useUserSettings();

  // Initialize default categories on first load
  useEffect(() => {
    initializeDefaultCategories.mutate();
  }, []);

  const { todayTotal, monthTotal, monthExpenses } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    let todaySum = 0;
    let monthSum = 0;
    const monthExp: typeof expenses = [];

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const amount = Number(expense.amount);

      if (isToday(expenseDate)) {
        todaySum += amount;
      }

      if (isWithinInterval(expenseDate, { start: monthStart, end: monthEnd })) {
        monthSum += amount;
        monthExp.push(expense);
      }
    });

    return {
      todayTotal: todaySum,
      monthTotal: monthSum,
      monthExpenses: monthExp,
    };
  }, [expenses]);

  if (expensesLoading || budgetLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const budgetAmount = budget?.amount || 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-up">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Welcome back! 👋
          </h2>
          <p className="mt-1 text-muted-foreground">
            Here's your spending overview for {format(new Date(), 'MMMM yyyy')}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="animate-fade-up stagger-1">
            <SummaryCard
              title="Today's Spending"
              amount={todayTotal}
              currency={currency}
              icon={Calendar}
              variant="primary"
            />
          </div>
          <div className="animate-fade-up stagger-2">
            <SummaryCard
              title="This Month"
              amount={monthTotal}
              currency={currency}
              icon={TrendingUp}
              variant="secondary"
            />
          </div>
          {/* Budget Progress Card */}
          <div className="animate-fade-up stagger-3">
            <Link to="/budget" className="block">
              <div className="glass-card rounded-2xl p-4 hover-lift cursor-pointer h-full">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                      <Target className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget</p>
                      <p className="font-display text-xl font-bold text-foreground">
                        {budgetAmount > 0 ? `${currency}${budgetAmount.toLocaleString()}` : 'Not set'}
                      </p>
                    </div>
                  </div>
                  {budgetAmount > 0 && (
                    <BudgetProgressRing 
                      spent={monthTotal} 
                      budget={budgetAmount} 
                      currency={currency}
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Pie Chart - Compact */}
          <div className="animate-fade-up stagger-4">
            <CategoryPieChart expenses={monthExpenses} currency={currency} />
          </div>
          
          {/* Monthly Trend Chart */}
          <div className="animate-fade-up stagger-5 glass-card rounded-2xl p-4 md:p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
              6-Month Trend
            </h3>
            <MonthlyTrendChart expenses={expenses} currency={currency} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="animate-fade-up stagger-6 flex gap-3 sm:gap-4">
          <Link to="/add" className="flex-1">
            <Button className="w-full gap-2 gradient-primary py-5 sm:py-6 text-primary-foreground">
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add Expense</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
          <Link to="/expenses" className="flex-1">
            <Button variant="outline" className="w-full gap-2 py-5 sm:py-6">
              <Receipt className="h-5 w-5" />
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">View</span>
            </Button>
          </Link>
        </div>

        {/* Recent Expenses Preview */}
        {expenses.length > 0 && (
          <div className="animate-fade-up glass-card rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Recent Expenses
              </h3>
              <Link to="/expenses" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {expenses.slice(0, 3).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between rounded-xl bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(expense.date), 'MMM d')}
                    </p>
                  </div>
                  <span className="font-display font-bold text-foreground">
                    {currency}{Number(expense.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
