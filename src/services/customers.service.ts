import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Customer = Tables<"customers">;
export type CustomerWithRelations = Customer & {
  preferred_city?: Tables<"cities"> | null;
  preferred_district?: Tables<"districts"> | null;
};

export interface CustomerFilters {
  customerType?: string;
  source?: string;
  isActive?: boolean;
  search?: string;
}

export const customersService = {
  async getAll(filters?: CustomerFilters): Promise<CustomerWithRelations[]> {
    let query = supabase
      .from("customers")
      .select(`
        *,
        preferred_city:cities(*),
        preferred_district:districts(*)
      `)
      .order("created_at", { ascending: false });

    if (filters?.customerType) {
      query = query.eq("customer_type", filters.customerType);
    }
    if (filters?.source) {
      query = query.eq("source", filters.source);
    }
    if (filters?.isActive !== undefined) {
      query = query.eq("is_active", filters.isActive);
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<CustomerWithRelations | null> {
    const { data, error } = await supabase
      .from("customers")
      .select(`
        *,
        preferred_city:cities(*),
        preferred_district:districts(*)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(customer: Omit<Tables<"customers">, "id" | "created_at" | "updated_at">): Promise<Customer> {
    const { data, error } = await supabase
      .from("customers")
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, customer: Partial<Tables<"customers">>): Promise<Customer> {
    const { data, error } = await supabase
      .from("customers")
      .update(customer)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("customers")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;
  },
};
