import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Lead = Tables<"leads">;
export type LeadWithRelations = Lead & {
  customer?: Tables<"customers"> | null;
  project?: Tables<"projects"> | null;
  property?: Tables<"properties"> | null;
  unit?: Tables<"units"> | null;
};

export interface LeadFilters {
  status?: string;
  priority?: string;
  leadType?: string;
  assignedTo?: string;
  search?: string;
}

export const leadsService = {
  async getAll(filters?: LeadFilters): Promise<LeadWithRelations[]> {
    let query = supabase
      .from("leads")
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
    if (filters?.priority) {
      query = query.eq("priority", filters.priority);
    }
    if (filters?.leadType) {
      query = query.eq("lead_type", filters.leadType);
    }
    if (filters?.assignedTo) {
      query = query.eq("assigned_to", filters.assignedTo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<LeadWithRelations | null> {
    const { data, error } = await supabase
      .from("leads")
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

  async create(lead: Omit<Tables<"leads">, "id" | "created_at" | "updated_at">): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .insert(lead)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, lead: Partial<Tables<"leads">>): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .update(lead)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async updateStatus(id: string, status: string): Promise<Lead> {
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
