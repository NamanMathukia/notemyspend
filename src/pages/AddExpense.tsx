import { Layout } from '@/components/Layout';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AddExpense() {
  return (
    <Layout>
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header */}
        <div className="animate-fade-up flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Add Expense
            </h2>
            <p className="text-muted-foreground">Record a new expense</p>
          </div>
        </div>

        {/* Form */}
        <div className="animate-fade-up stagger-1 glass-card rounded-2xl p-6">
          <ExpenseForm />
        </div>
      </div>
    </Layout>
  );
}
