export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          images: Json | null
          is_featured: boolean | null
          published_at: string | null
          slug: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          images?: Json | null
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          name_en: string | null
          region: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          name_en?: string | null
          region?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string | null
          region?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          assigned_to: string | null
          budget_from: number | null
          budget_to: number | null
          created_at: string
          customer_type: string | null
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          notes: string | null
          phone: string
          preferred_city_id: string | null
          preferred_contact: string | null
          preferred_district_id: string | null
          preferred_property_type: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          budget_from?: number | null
          budget_to?: number | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone: string
          preferred_city_id?: string | null
          preferred_contact?: string | null
          preferred_district_id?: string | null
          preferred_property_type?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          budget_from?: number | null
          budget_to?: number | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          phone?: string
          preferred_city_id?: string | null
          preferred_contact?: string | null
          preferred_district_id?: string | null
          preferred_property_type?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_preferred_city_id_fkey"
            columns: ["preferred_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_preferred_district_id_fkey"
            columns: ["preferred_district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          license_number: string | null
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      districts: {
        Row: {
          city_id: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          name_en: string | null
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          name_en?: string | null
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          name_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      financing_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          down_payment_available: number | null
          employer_name: string | null
          employment_type: string | null
          existing_obligations: number | null
          has_housing_support: boolean | null
          id: string
          monthly_income: number | null
          notes: string | null
          preferred_bank: string | null
          project_id: string | null
          property_id: string | null
          request_type: string
          status: string | null
          unit_id: string | null
          updated_at: string
          years_of_service: number | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          down_payment_available?: number | null
          employer_name?: string | null
          employment_type?: string | null
          existing_obligations?: number | null
          has_housing_support?: boolean | null
          id?: string
          monthly_income?: number | null
          notes?: string | null
          preferred_bank?: string | null
          project_id?: string | null
          property_id?: string | null
          request_type: string
          status?: string | null
          unit_id?: string | null
          updated_at?: string
          years_of_service?: number | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          down_payment_available?: number | null
          employer_name?: string | null
          employment_type?: string | null
          existing_obligations?: number | null
          has_housing_support?: boolean | null
          id?: string
          monthly_income?: number | null
          notes?: string | null
          preferred_bank?: string | null
          project_id?: string | null
          property_id?: string | null
          request_type?: string
          status?: string | null
          unit_id?: string | null
          updated_at?: string
          years_of_service?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financing_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financing_requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          estimated_value: number | null
          expected_close_date: string | null
          id: string
          lead_type: string | null
          lost_reason: string | null
          message: string | null
          notes: string | null
          priority: string | null
          project_id: string | null
          property_id: string | null
          status: string | null
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_type?: string | null
          lost_reason?: string | null
          message?: string | null
          notes?: string | null
          priority?: string | null
          project_id?: string | null
          property_id?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_type?: string | null
          lost_reason?: string | null
          message?: string | null
          notes?: string | null
          priority?: string | null
          project_id?: string | null
          property_id?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      odoo_settings: {
        Row: {
          api_key: string | null
          auto_sync_enabled: boolean | null
          base_url: string | null
          created_at: string
          database_name: string | null
          field_mappings: Json | null
          hosting_type: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          sync_direction: string | null
          sync_interval_minutes: number | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          auto_sync_enabled?: boolean | null
          base_url?: string | null
          created_at?: string
          database_name?: string | null
          field_mappings?: Json | null
          hosting_type?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          sync_direction?: string | null
          sync_interval_minutes?: number | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          auto_sync_enabled?: boolean | null
          base_url?: string | null
          created_at?: string
          database_name?: string | null
          field_mappings?: Json | null
          hosting_type?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          sync_direction?: string | null
          sync_interval_minutes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_delivery_date: string | null
          address: string | null
          amenities: Json | null
          area_from: number | null
          area_to: number | null
          available_units: number | null
          brochure_url: string | null
          city_id: string | null
          completion_percentage: number | null
          created_at: string
          description: string | null
          developer_id: string | null
          district_id: string | null
          expected_delivery_date: string | null
          features: Json | null
          floor_plans: Json | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          is_investment: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          payment_plans: Json | null
          price_from: number | null
          price_to: number | null
          project_type: string | null
          roi_percentage: number | null
          sale_terms: string | null
          slug: string | null
          status: string | null
          total_units: number | null
          updated_at: string
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          actual_delivery_date?: string | null
          address?: string | null
          amenities?: Json | null
          area_from?: number | null
          area_to?: number | null
          available_units?: number | null
          brochure_url?: string | null
          city_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          description?: string | null
          developer_id?: string | null
          district_id?: string | null
          expected_delivery_date?: string | null
          features?: Json | null
          floor_plans?: Json | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_investment?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          payment_plans?: Json | null
          price_from?: number | null
          price_to?: number | null
          project_type?: string | null
          roi_percentage?: number | null
          sale_terms?: string | null
          slug?: string | null
          status?: string | null
          total_units?: number | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          actual_delivery_date?: string | null
          address?: string | null
          amenities?: Json | null
          area_from?: number | null
          area_to?: number | null
          available_units?: number | null
          brochure_url?: string | null
          city_id?: string | null
          completion_percentage?: number | null
          created_at?: string
          description?: string | null
          developer_id?: string | null
          district_id?: string | null
          expected_delivery_date?: string | null
          features?: Json | null
          floor_plans?: Json | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_investment?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          payment_plans?: Json | null
          price_from?: number | null
          price_to?: number | null
          project_type?: string | null
          roi_percentage?: number | null
          sale_terms?: string | null
          slug?: string | null
          status?: string | null
          total_units?: number | null
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          age: number | null
          area: number
          bathrooms: number | null
          bedrooms: number | null
          city_id: string | null
          created_at: string
          description: string | null
          district_id: string | null
          features: Json | null
          financing_available: boolean | null
          furnished: string | null
          housing_support_eligible: boolean | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          living_rooms: number | null
          longitude: number | null
          owner_name: string | null
          owner_phone: string | null
          price: number
          property_type: string | null
          slug: string | null
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
          view_count: number | null
          virtual_tour_url: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          area: number
          bathrooms?: number | null
          bedrooms?: number | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          district_id?: string | null
          features?: Json | null
          financing_available?: boolean | null
          furnished?: string | null
          housing_support_eligible?: boolean | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          living_rooms?: number | null
          longitude?: number | null
          owner_name?: string | null
          owner_phone?: string | null
          price: number
          property_type?: string | null
          slug?: string | null
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
          virtual_tour_url?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          area?: number
          bathrooms?: number | null
          bedrooms?: number | null
          city_id?: string | null
          created_at?: string
          description?: string | null
          district_id?: string | null
          features?: Json | null
          financing_available?: boolean | null
          furnished?: string | null
          housing_support_eligible?: boolean | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          living_rooms?: number | null
          longitude?: number | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number
          property_type?: string | null
          slug?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          view_count?: number | null
          virtual_tour_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          error_message: string | null
          id: string
          odoo_id: string | null
          request_data: Json | null
          response_data: Json | null
          status: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          id?: string
          odoo_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          id?: string
          odoo_id?: string | null
          request_data?: Json | null
          response_data?: Json | null
          status?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          area: number
          bathrooms: number | null
          bedrooms: number | null
          booking_amount: number | null
          booking_terms: string | null
          created_at: string
          expected_delivery_date: string | null
          features: Json | null
          floor_number: number | null
          floor_plan_url: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          living_rooms: number | null
          payment_plan: Json | null
          price: number
          price_per_sqm: number | null
          project_id: string
          sale_type: string | null
          status: string | null
          unit_number: string
          unit_type: string | null
          updated_at: string
        }
        Insert: {
          area: number
          bathrooms?: number | null
          bedrooms?: number | null
          booking_amount?: number | null
          booking_terms?: string | null
          created_at?: string
          expected_delivery_date?: string | null
          features?: Json | null
          floor_number?: number | null
          floor_plan_url?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          living_rooms?: number | null
          payment_plan?: Json | null
          price: number
          price_per_sqm?: number | null
          project_id: string
          sale_type?: string | null
          status?: string | null
          unit_number: string
          unit_type?: string | null
          updated_at?: string
        }
        Update: {
          area?: number
          bathrooms?: number | null
          bedrooms?: number | null
          booking_amount?: number | null
          booking_terms?: string | null
          created_at?: string
          expected_delivery_date?: string | null
          features?: Json | null
          floor_number?: number | null
          floor_plan_url?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          living_rooms?: number | null
          payment_plan?: Json | null
          price?: number
          price_per_sqm?: number | null
          project_id?: string
          sale_type?: string | null
          status?: string | null
          unit_number?: string
          unit_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "content_manager"
        | "finance_manager"
        | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "content_manager",
        "finance_manager",
        "viewer",
      ],
    },
  },
} as const
