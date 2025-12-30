import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type ProjectWithRelations = Project & {
  city?: Tables<"cities"> | null;
  district?: Tables<"districts"> | null;
  developer?: Tables<"developers"> | null;
};

export interface ProjectFilters {
  cityId?: string;
  districtId?: string;
  status?: string;
  projectType?: string;
  priceFrom?: number;
  priceTo?: number;
  isFeatured?: boolean;
  isInvestment?: boolean;
  search?: string;
}

export const projectsService = {
  async getAll(filters?: ProjectFilters): Promise<ProjectWithRelations[]> {
    let query = supabase
      .from("projects")
      .select(`
        *,
        city:cities(*),
        district:districts(*),
        developer:developers(*)
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
    if (filters?.projectType) {
      query = query.eq("project_type", filters.projectType);
    }
    if (filters?.priceFrom) {
      query = query.gte("price_from", filters.priceFrom);
    }
    if (filters?.priceTo) {
      query = query.lte("price_to", filters.priceTo);
    }
    if (filters?.isFeatured !== undefined) {
      query = query.eq("is_featured", filters.isFeatured);
    }
    if (filters?.isInvestment !== undefined) {
      query = query.eq("is_investment", filters.isInvestment);
    }
    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<ProjectWithRelations | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        city:cities(*),
        district:districts(*),
        developer:developers(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getBySlug(slug: string): Promise<ProjectWithRelations | null> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        city:cities(*),
        district:districts(*),
        developer:developers(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getFeatured(limit = 6): Promise<ProjectWithRelations[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        city:cities(*),
        district:districts(*),
        developer:developers(*)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async create(project: Omit<Tables<"projects">, "id" | "created_at" | "updated_at">): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<Tables<"projects">>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;
  },

  async incrementViewCount(id: string): Promise<void> {
    const { data: current } = await supabase
      .from("projects")
      .select("view_count")
      .eq("id", id)
      .single();

    if (current) {
      await supabase
        .from("projects")
        .update({ view_count: (current.view_count || 0) + 1 })
        .eq("id", id);
    }
  },
};
