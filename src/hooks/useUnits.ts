import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Unit {
  id: string;
  project_id: string;
  unit_number: string;
  unit_type: string | null;
  floor_number: number | null;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  living_rooms: number | null;
  price: number;
  price_per_sqm: number | null;
  status: string | null;
  sale_type: string | null;
  expected_delivery_date: string | null;
  payment_plan: any;
  booking_amount: number | null;
  booking_terms: string | null;
  features: string[];
  images: string[];
  floor_plan_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
    city: {
      id: string;
      name: string;
    } | null;
  };
}

export const useUnits = (filters?: {
  projectId?: string;
  unitType?: string;
  status?: string;
  saleType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
}) => {
  return useQuery({
    queryKey: ['units', filters],
    queryFn: async () => {
      let query = supabase
        .from('units')
        .select(`
          *,
          project:projects(id, name, city:cities(id, name))
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.projectId) {
        query = query.eq('project_id', filters.projectId);
      }
      if (filters?.unitType) {
        query = query.eq('unit_type', filters.unitType);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.saleType) {
        query = query.eq('sale_type', filters.saleType);
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.minArea !== undefined) {
        query = query.gte('area', filters.minArea);
      }
      if (filters?.maxArea !== undefined) {
        query = query.lte('area', filters.maxArea);
      }
      if (filters?.bedrooms !== undefined) {
        query = query.eq('bedrooms', filters.bedrooms);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Unit[];
    },
  });
};

export const useUnit = (id: string) => {
  return useQuery({
    queryKey: ['unit', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          project:projects(
            id, name, slug, status, completion_percentage,
            developer:developers(id, name, logo_url),
            city:cities(id, name, name_en),
            district:districts(id, name, name_en)
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Unit | null;
    },
    enabled: !!id,
  });
};

export const useProjectUnits = (projectId: string) => {
  return useQuery({
    queryKey: ['project-units', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('unit_number', { ascending: true });
      
      if (error) throw error;
      return data as Unit[];
    },
    enabled: !!projectId,
  });
};
