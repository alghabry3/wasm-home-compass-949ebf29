import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name: string;
  name_en: string | null;
  region: string | null;
  is_active: boolean;
}

export interface District {
  id: string;
  city_id: string;
  name: string;
  name_en: string | null;
  is_active: boolean;
}

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as City[];
    },
  });
};

export const useDistricts = (cityId?: string) => {
  return useQuery({
    queryKey: ['districts', cityId],
    queryFn: async () => {
      let query = supabase
        .from('districts')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (cityId) {
        query = query.eq('city_id', cityId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as District[];
    },
  });
};
