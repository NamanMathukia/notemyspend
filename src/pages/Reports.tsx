import { useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useExpenses, Expense } from '@/hooks/useExpenses';
import { useUserSettings } from '@/hooks/useUserSettings';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';
import { Download, FileText, Loader2 } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const COLORS = [
  'hsl(173, 58%, 39%)',
  'hsl(12, 76%, 61%)',
  'hsl(197, 37%, 24%)',
  'hsl(43, 74%, 66%)',
  'hsl(27, 87%, 67%)',
  'hsl(215, 25%, 27%)',
];

export default function Reports() {
  const { expenses, isLoading } = useExpenses();
  const { currency } = useUserSettings();
  const [period, setPeriod] = useState('3');

  const filteredExpenses = useMemo(() => {
    const months = parseInt(period);
    const now = new Date();
    const startDate = startOfMonth(subMonths(now, months - 1));
    
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= startDate;
    });
  }, [expenses, period]);

  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + Number(exp.amount);
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  const monthlyData = useMemo(() => {
    const months = parseInt(period);
    const data = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const total = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return isWithinInterval(expDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      
      data.push({
        name: format(monthDate, 'MMM yyyy'),
        total,
      });
    }
    
    return data;
  }, [expenses, period]);

  const totalSpent = useMemo(() => 
    filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    [filteredExpenses]
  );

  const exportCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const rows = filteredExpenses.map(exp => [
      exp.date,
      exp.category,
      exp.amount.toString(),
      exp.note || '',
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const exportPDF = () => {
    // Simple text-based export for now
    const content = `Expense Report - ${format(new Date(), 'MMMM yyyy')}
    
Total Spent: ${currency}${totalSpent.toFixed(2)}

Expenses by Category:
${categoryData.map(c => `  ${c.name}: ${currency}${c.value.toFixed(2)}`).join('\n')}

All Expenses:
${filteredExpenses.map(exp => `  ${exp.date} | ${exp.category} | ${currency}${exp.amount} | ${exp.note || '-'}`).join('\n')}
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (expenses.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-up mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Reports
            </h2>
            <p className="mt-1 text-muted-foreground">
              Analyze your spending patterns
            </p>
          </div>
          <EmptyState type="reports" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="animate-fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Reports
            </h2>
            <p className="mt-1 text-muted-foreground">
              Analyze your spending patterns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last month</SelectItem>
                <SelectItem value="3">Last 3 months</SelectItem>
                <SelectItem value="6">Last 6 months</SelectItem>
                <SelectItem value="12">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Card */}
        <div className="animate-fade-up stagger-1 glass-card rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {currency}{totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Transactions</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {filteredExpenses.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Categories</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {categoryData.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Avg/Transaction</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {currency}{(totalSpent / filteredExpenses.length || 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trend */}
          <div className="animate-fade-up stagger-2 glass-card rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Monthly Spending
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `${currency}${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--secondary))', radius: 8 }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`${currency}${value.toFixed(2)}`, 'Spent']}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="animate-fade-up stagger-3 glass-card rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Spending by Category
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value: number) => [`${currency}${value.toFixed(2)}`, '']}
                  />
                  <Legend 
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Details */}
        <div className="animate-fade-up stagger-4 glass-card rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {categoryData.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="flex-1 font-medium text-foreground">{cat.name}</span>
                <span className="text-muted-foreground">
                  {((cat.value / totalSpent) * 100).toFixed(1)}%
                </span>
                <span className="font-display font-semibold text-foreground min-w-[100px] text-right">
                  {currency}{cat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="animate-fade-up stagger-5 flex justify-center gap-4">
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
    </Layout>
  );
}
