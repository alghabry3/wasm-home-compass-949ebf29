import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  project_type: string | null;
  status: string | null;
  completion_percentage: number;
  expected_delivery_date: string | null;
  total_units: number;
  available_units: number;
  price_from: number | null;
  price_to: number | null;
  area_from: number | null;
  area_to: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  features: string[];
  amenities: string[];
  images: string[];
  floor_plans: string[];
  video_url: string | null;
  brochure_url: string | null;
  sale_terms: string | null;
  payment_plans: any[];
  roi_percentage: number | null;
  is_featured: boolean;
  is_investment: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  developer: {
    id: string;
    name: string;
    logo_url: string | null;
  } | null;
  city: {
    id: string;
    name: string;
    name_en: string | null;
  } | null;
  district: {
    id: string;
    name: string;
    name_en: string | null;
  } | null;
}

export const useProjects = (filters?: {
  cityId?: string;
  status?: string;
  projectType?: string;
  isInvestment?: boolean;
  isFeatured?: boolean;
}) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          developer:developers(id, name, logo_url),
          city:cities(id, name, name_en),
          district:districts(id, name, name_en)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.cityId) {
        query = query.eq('city_id', filters.cityId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.projectType) {
        query = query.eq('project_type', filters.projectType);
      }
      if (filters?.isInvestment !== undefined) {
        query = query.eq('is_investment', filters.isInvestment);
      }
      if (filters?.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          developer:developers(id, name, logo_url, description, website, phone, email),
          city:cities(id, name, name_en, region),
          district:districts(id, name, name_en)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!id,
  });
};
