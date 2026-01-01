import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;
export type PropertyWithRelations = Property & {
  city?: Tables<"cities"> | null;
  district?: Tables<"districts"> | null;
};

export interface PropertyFilters {
  cityId?: string;
  districtId?: string;
  status?: string;
  propertyType?: string;
  priceFrom?: number;
  priceTo?: number;
  areaFrom?: number;
  areaTo?: number;
  bedrooms?: number;
  isFeatured?: boolean;
  financingAvailable?: boolean;
  housingSupportEligible?: boolean;
  search?: string;
}

export const propertiesService = {
  async getAll(filters?: PropertyFilters): Promise<PropertyWithRelations[]> {
    let query = supabase
      .from("properties")
      .select(`
        *,
        city:cities(*),
        district:districts(*)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (filters?.cityId) {
      query = query.eq("city_id", filters.cityId);
    }
    if (filters?.districtId) {
      query = query.eq("district_id", filters.districtId);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.propertyType) {
      query = query.eq("property_type", filters.propertyType);
    }
    if (filters?.priceFrom) {
      query = query.gte("price", filters.priceFrom);
    }
    if (filters?.priceTo) {
      query = query.lte("price", filters.priceTo);
    }
    if (filters?.areaFrom) {
      query = query.gte("area", filters.areaFrom);
    }
    if (filters?.areaTo) {
      query = query.lte("area", filters.areaTo);
    }
    if (filters?.bedrooms) {
      query = query.eq("bedrooms", filters.bedrooms);
    }
    if (filters?.isFeatured !== undefined) {
      query = query.eq("is_featured", filters.isFeatured);
    }
    if (filters?.financingAvailable !== undefined) {
      query = query.eq("financing_available", filters.financingAvailable);
    }
    if (filters?.housingSupportEligible !== undefined) {
      query = query.eq("housing_support_eligible", filters.housingSupportEligible);
    }
    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<PropertyWithRelations | null> {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        city:cities(*),
        district:districts(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string): Promise<PropertyWithRelations | null> {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        city:cities(*),
        district:districts(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getFeatured(limit = 6): Promise<PropertyWithRelations[]> {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        city:cities(*),
        district:districts(*)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async create(property: Omit<Tables<"properties">, "id" | "created_at" | "updated_at">): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .insert(property)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, property: Partial<Tables<"properties">>): Promise<Property> {
    const { data, error } = await supabase
      .from("properties")
      .update(property)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("properties")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;
  },

  async incrementViewCount(id: string): Promise<void> {
    const { data: current } = await supabase
      .from("properties")
      .select("view_count")
      .eq("id", id)
      .single();

    if (current) {
      await supabase
        .from("properties")
        .update({ view_count: (current.view_count || 0) + 1 })
        .eq("id", id);
    }
  },
};
