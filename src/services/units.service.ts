import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Unit = Tables<"units">;
export type UnitWithRelations = Unit & {
  project?: Tables<"projects"> | null;
};

export interface UnitFilters {
  projectId?: string;
  status?: string;
  unitType?: string;
  saleType?: string;
  priceFrom?: number;
  priceTo?: number;
  areaFrom?: number;
  areaTo?: number;
  bedrooms?: number;
  isFeatured?: boolean;
}

export const unitsService = {
  async getAll(filters?: UnitFilters): Promise<UnitWithRelations[]> {
    let query = supabase
      .from("units")
      .select(`
        *,
        project:projects(*)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (filters?.projectId) {
      query = query.eq("project_id", filters.projectId);
    }
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.unitType) {
      query = query.eq("unit_type", filters.unitType);
    }
    if (filters?.saleType) {
      query = query.eq("sale_type", filters.saleType);
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

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<UnitWithRelations | null> {
    const { data, error } = await supabase
      .from("units")
      .select(`
        *,
        project:projects(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getByProject(projectId: string): Promise<Unit[]> {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .eq("project_id", projectId)
      .eq("is_active", true)
      .order("unit_number");

    if (error) throw error;
    return data || [];
  },

  async getFeatured(limit = 6): Promise<UnitWithRelations[]> {
    const { data, error } = await supabase
      .from("units")
      .select(`
        *,
        project:projects(*)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async create(unit: Omit<Tables<"units">, "id" | "created_at" | "updated_at">): Promise<Unit> {
    const { data, error } = await supabase
      .from("units")
      .insert(unit)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, unit: Partial<Tables<"units">>): Promise<Unit> {
    const { data, error } = await supabase
      .from("units")
      .update(unit)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("units")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;
  },
};
