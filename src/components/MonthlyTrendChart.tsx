import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '@/hooks/useExpenses';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface MonthlyTrendChartProps {
  expenses: Expense[];
  currency: string;
}

export function MonthlyTrendChart({ expenses, currency }: MonthlyTrendChartProps) {
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const total = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return isWithinInterval(expDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      
      months.push({
        name: format(monthDate, 'MMM'),
        total: total,
      });
    }
    
    return months;
  }, [expenses]);

  return (
    <div className="h-[180px] w-full">
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number) => [`${currency}${value.toFixed(2)}`, 'Spent']}
          />
          <Bar 
            dataKey="total" 
            fill="hsl(var(--primary))"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
