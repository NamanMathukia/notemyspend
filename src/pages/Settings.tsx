import { Layout } from '@/components/Layout';
import { CategoryForm } from '@/components/CategoryForm';
import { FolderOpen, Coins, Check } from 'lucide-react';
import { useUserSettings, CURRENCIES } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { currency, updateSettings, isLoading } = useUserSettings();

  return (
    <Layout>
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header */}
        <div className="animate-fade-up">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Settings
          </h2>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>

        {/* Currency Section */}
        <div className="animate-fade-up stagger-1 glass-card rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Currency
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred currency
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CURRENCIES.map(({ symbol, name, code }) => (
              <Button
                key={code}
                variant="outline"
                disabled={isLoading || updateSettings.isPending}
                onClick={() => updateSettings.mutate(symbol)}
                className={cn(
                  'h-auto flex-col items-start p-4 transition-all',
                  currency === symbol && 'border-primary bg-primary/5'
                )}
              >
                <div className="flex w-full items-center justify-between mb-1">
                  <span className="font-display text-xl font-bold">{symbol}</span>
                  {currency === symbol && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground text-left">{name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="animate-fade-up stagger-2 glass-card rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <FolderOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Categories
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your expense categories
              </p>
            </div>
          </div>
          <CategoryForm />
        </div>
      </div>
    </Layout>
  );
}
