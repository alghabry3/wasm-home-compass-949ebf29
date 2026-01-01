import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type FinancingRequest = Tables<"financing_requests">;
export type FinancingRequestWithRelations = FinancingRequest & {
  customer?: Tables<"customers"> | null;
  project?: Tables<"projects"> | null;
  property?: Tables<"properties"> | null;
  unit?: Tables<"units"> | null;
};

export interface FinancingFilters {
  status?: string;
  requestType?: string;
  hasHousingSupport?: boolean;
  assignedTo?: string;
}

export const financingService = {
  async getAll(filters?: FinancingFilters): Promise<FinancingRequestWithRelations[]> {
    let query = supabase
      .from("financing_requests")
      .select(`
        *,
        customer:customers(*),
        project:projects(*),
        property:properties(*),
        unit:units(*)
      `)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.requestType) {
      query = query.eq("request_type", filters.requestType);
    }
    if (filters?.hasHousingSupport !== undefined) {
      query = query.eq("has_housing_support", filters.hasHousingSupport);
    }
    if (filters?.assignedTo) {
      query = query.eq("assigned_to", filters.assignedTo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<FinancingRequestWithRelations | null> {
    const { data, error } = await supabase
      .from("financing_requests")
      .select(`
        *,
        customer:customers(*),
        project:projects(*),
        property:properties(*),
        unit:units(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(request: Omit<Tables<"financing_requests">, "id" | "created_at" | "updated_at">): Promise<FinancingRequest> {
    const { data, error } = await supabase
      .from("financing_requests")
      .insert(request)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, request: Partial<Tables<"financing_requests">>): Promise<FinancingRequest> {
    const { data, error } = await supabase
      .from("financing_requests")
      .update(request)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("financing_requests")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async updateStatus(id: string, status: string): Promise<FinancingRequest> {
    const { data, error } = await supabase
      .from("financing_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
