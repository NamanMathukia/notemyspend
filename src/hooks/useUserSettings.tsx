import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface UserSettings {
  id: string;
  user_id: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export const CURRENCIES = [
  { symbol: '₹', name: 'Indian Rupee (INR)', code: 'INR' },
  { symbol: '$', name: 'US Dollar (USD)', code: 'USD' },
  { symbol: '€', name: 'Euro (EUR)', code: 'EUR' },
  { symbol: '£', name: 'British Pound (GBP)', code: 'GBP' },
];

export function useUserSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['userSettings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .maybeSingle();
      
      if (error) throw error;
      return data as UserSettings | null;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (currency: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data: existing } = await supabase
        .from('user_settings')
        .select('id')
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('user_settings')
          .update({ currency })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('user_settings')
          .insert([{ currency, user_id: user.id }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
      toast({ title: 'Currency updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error updating settings', description: error.message, variant: 'destructive' });
    },
  });

  // Default to ₹ if no settings
  const currency = settings?.currency || '₹';

  return {
    settings,
    currency,
    isLoading,
    updateSettings,
  };
}
