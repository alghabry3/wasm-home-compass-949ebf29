-- =============================================
-- WASM HOME Real Estate Database Schema
-- =============================================

-- 1. Create Role Enum for User Roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'content_manager', 'finance_manager', 'viewer');

-- 2. Create User Roles Table (Security Best Practice)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Create Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Create Cities Table
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT,
    region TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create Districts Table
CREATE TABLE public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Create Developers Table
CREATE TABLE public.developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    license_number TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Create Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    developer_id UUID REFERENCES public.developers(id),
    city_id UUID REFERENCES public.cities(id),
    district_id UUID REFERENCES public.districts(id),
    description TEXT,
    project_type TEXT CHECK (project_type IN ('سكني', 'تجاري', 'استثماري', 'فندقي', 'متعدد الاستخدامات')),
    status TEXT CHECK (status IN ('مكتمل', 'قيد الإنشاء', 'قريباً', 'متوقف')) DEFAULT 'قيد الإنشاء',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    total_units INTEGER DEFAULT 0,
    available_units INTEGER DEFAULT 0,
    price_from DECIMAL(12,2),
    price_to DECIMAL(12,2),
    area_from DECIMAL(10,2),
    area_to DECIMAL(10,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address TEXT,
    features JSONB DEFAULT '[]',
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    floor_plans JSONB DEFAULT '[]',
    video_url TEXT,
    brochure_url TEXT,
    sale_terms TEXT,
    payment_plans JSONB DEFAULT '[]',
    roi_percentage DECIMAL(5,2),
    is_featured BOOLEAN DEFAULT false,
    is_investment BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Create Units Table
CREATE TABLE public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    unit_number TEXT NOT NULL,
    unit_type TEXT CHECK (unit_type IN ('شقة', 'فيلا', 'تاون هاوس', 'دوبلكس', 'بنتهاوس', 'استوديو', 'محل تجاري', 'مكتب')),
    floor_number INTEGER,
    area DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    living_rooms INTEGER,
    price DECIMAL(12,2) NOT NULL,
    price_per_sqm DECIMAL(10,2),
    status TEXT CHECK (status IN ('متاح', 'محجوز', 'مباع')) DEFAULT 'متاح',
    sale_type TEXT CHECK (sale_type IN ('للبيع', 'للإيجار', 'للاستثمار')) DEFAULT 'للبيع',
    expected_delivery_date DATE,
    payment_plan JSONB,
    booking_amount DECIMAL(12,2),
    booking_terms TEXT,
    features JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    floor_plan_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Create Properties Table (For Individual Properties)
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    city_id UUID REFERENCES public.cities(id),
    district_id UUID REFERENCES public.districts(id),
    property_type TEXT CHECK (property_type IN ('شقة', 'فيلا', 'تاون هاوس', 'أرض', 'عمارة', 'دوبلكس', 'استوديو', 'محل تجاري', 'مكتب')),
    status TEXT CHECK (status IN ('للبيع', 'للإيجار', 'مباع', 'مؤجر')) DEFAULT 'للبيع',
    price DECIMAL(12,2) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    living_rooms INTEGER,
    age INTEGER,
    furnished TEXT CHECK (furnished IN ('مفروش', 'غير مفروش', 'نصف مفروش')),
    description TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    features JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    video_url TEXT,
    virtual_tour_url TEXT,
    financing_available BOOLEAN DEFAULT false,
    housing_support_eligible BOOLEAN DEFAULT false,
    owner_name TEXT,
    owner_phone TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Create Customers Table
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    preferred_contact TEXT CHECK (preferred_contact IN ('phone', 'whatsapp', 'email')) DEFAULT 'whatsapp',
    customer_type TEXT CHECK (customer_type IN ('buyer', 'investor', 'renter', 'seller')) DEFAULT 'buyer',
    budget_from DECIMAL(12,2),
    budget_to DECIMAL(12,2),
    preferred_city_id UUID REFERENCES public.cities(id),
    preferred_district_id UUID REFERENCES public.districts(id),
    preferred_property_type TEXT,
    notes TEXT,
    source TEXT CHECK (source IN ('website', 'whatsapp', 'phone', 'referral', 'social_media', 'other')) DEFAULT 'website',
    assigned_to UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Create Leads/Opportunities Table
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id),
    property_id UUID REFERENCES public.properties(id),
    unit_id UUID REFERENCES public.units(id),
    lead_type TEXT CHECK (lead_type IN ('inquiry', 'booking', 'financing', 'consultation')) DEFAULT 'inquiry',
    status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')) DEFAULT 'new',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    message TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    expected_close_date DATE,
    estimated_value DECIMAL(12,2),
    lost_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Create Financing Requests Table
CREATE TABLE public.financing_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id),
    property_id UUID REFERENCES public.properties(id),
    unit_id UUID REFERENCES public.units(id),
    request_type TEXT CHECK (request_type IN ('mortgage', 'personal_loan', 'refinance', 'default_solution', 'housing_support')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'completed')) DEFAULT 'pending',
    monthly_income DECIMAL(12,2),
    employment_type TEXT CHECK (employment_type IN ('government', 'private', 'military', 'retired', 'self_employed')),
    employer_name TEXT,
    years_of_service INTEGER,
    existing_obligations DECIMAL(12,2),
    has_housing_support BOOLEAN DEFAULT false,
    down_payment_available DECIMAL(12,2),
    preferred_bank TEXT,
    notes TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 13. Create Odoo Integration Settings Table
CREATE TABLE public.odoo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_url TEXT,
    api_key TEXT,
    database_name TEXT,
    hosting_type TEXT CHECK (hosting_type IN ('saas', 'odoo_sh', 'self_hosted')) DEFAULT 'saas',
    sync_direction TEXT CHECK (sync_direction IN ('one_way', 'two_way')) DEFAULT 'one_way',
    auto_sync_enabled BOOLEAN DEFAULT false,
    sync_interval_minutes INTEGER DEFAULT 60,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    field_mappings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Create Sync Logs Table
CREATE TABLE public.sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT CHECK (action IN ('create', 'update', 'delete', 'sync')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'success', 'failed')) NOT NULL,
    odoo_id TEXT,
    error_message TEXT,
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. Create Blog Posts Table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    author_id UUID REFERENCES auth.users(id),
    featured_image TEXT,
    images JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 16. Create FAQ Table
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odoo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECK
-- =============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin')
  )
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.is_admin(auth.uid()));

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()));

-- Public Data Policies (Cities, Districts, Developers)
CREATE POLICY "Anyone can view active cities" ON public.cities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage cities" ON public.cities
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view active districts" ON public.districts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage districts" ON public.districts
    FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can view active developers" ON public.developers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage developers" ON public.developers
    FOR ALL USING (public.is_admin(auth.uid()));

-- Projects Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view active projects" ON public.projects
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage projects" ON public.projects
    FOR ALL USING (public.is_admin(auth.uid()));

-- Units Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view active units" ON public.units
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage units" ON public.units
    FOR ALL USING (public.is_admin(auth.uid()));

-- Properties Policies (Public Read, Admin Write)
CREATE POLICY "Anyone can view active properties" ON public.properties
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage properties" ON public.properties
    FOR ALL USING (public.is_admin(auth.uid()));

-- Customers Policies (Admin Only)
CREATE POLICY "Admins can manage customers" ON public.customers
    FOR ALL USING (public.is_admin(auth.uid()));

-- Leads Policies (Admin Only)
CREATE POLICY "Admins can manage leads" ON public.leads
    FOR ALL USING (public.is_admin(auth.uid()));

-- Financing Requests Policies (Admin Only)
CREATE POLICY "Admins can manage financing requests" ON public.financing_requests
    FOR ALL USING (public.is_admin(auth.uid()));

-- Odoo Settings Policies (Super Admin Only)
CREATE POLICY "Super admins can manage odoo settings" ON public.odoo_settings
    FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Sync Logs Policies (Admin Only)
CREATE POLICY "Admins can view sync logs" ON public.sync_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

-- Blog Posts Policies
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (public.is_admin(auth.uid()));

-- FAQs Policies
CREATE POLICY "Anyone can view active FAQs" ON public.faqs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" ON public.faqs
    FOR ALL USING (public.is_admin(auth.uid()));

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financing_requests_updated_at BEFORE UPDATE ON public.financing_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_odoo_settings_updated_at BEFORE UPDATE ON public.odoo_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INSERT INITIAL DATA
-- =============================================

-- Insert Cities
INSERT INTO public.cities (name, name_en, region) VALUES
('الخبر', 'Khobar', 'المنطقة الشرقية'),
('الدمام', 'Dammam', 'المنطقة الشرقية'),
('الظهران', 'Dhahran', 'المنطقة الشرقية'),
('الرياض', 'Riyadh', 'منطقة الرياض'),
('جدة', 'Jeddah', 'منطقة مكة المكرمة'),
('مكة المكرمة', 'Makkah', 'منطقة مكة المكرمة'),
('المدينة المنورة', 'Madinah', 'منطقة المدينة المنورة');

-- Insert FAQs
INSERT INTO public.faqs (question, answer, category, sort_order, is_active) VALUES
('ما هي خدمات وسم هوم العقارية؟', 'نقدم خدمات متكاملة تشمل: بيع وشراء العقارات، تأجير العقارات، حلول التمويل العقاري، الاستثمار العقاري، وحلول التعثر المالي.', 'عام', 1, true),
('كيف يمكنني التواصل مع مستشار عقاري؟', 'يمكنك التواصل معنا عبر الواتساب على الرقم 920017195 أو من خلال نموذج التواصل في الموقع.', 'عام', 2, true),
('هل تقدمون خدمات التمويل العقاري؟', 'نعم، نساعدك في الحصول على أفضل عروض التمويل من البنوك وشركات التمويل المعتمدة في المملكة.', 'التمويل', 3, true),
('ما هي شروط الحصول على التمويل العقاري؟', 'تختلف الشروط حسب الجهة التمويلية، لكن بشكل عام تشمل: عمر لا يقل عن 21 سنة، دخل شهري مستقر، تحويل راتب، وعدم وجود التزامات تتجاوز 65% من الراتب.', 'التمويل', 4, true),
('هل يمكنني الاستفادة من برنامج الدعم السكني؟', 'نساعدك في التحقق من أهليتك لبرنامج الدعم السكني وتقديم طلبك بالشكل الصحيح.', 'التمويل', 5, true),
('ما هي المناطق التي تغطيها خدماتكم؟', 'نغطي جميع مناطق المملكة العربية السعودية، مع تركيز خاص على المنطقة الشرقية (الخبر، الدمام، الظهران).', 'عام', 6, true),
('كيف يمكنني حجز عقار تحت الإنشاء؟', 'يمكنك حجز وحدتك من خلال دفع مبلغ الحجز المحدد وتوقيع عقد الحجز. نساعدك في جميع الإجراءات.', 'المشاريع', 7, true),
('ما هي خطط الدفع المتاحة للمشاريع تحت الإنشاء؟', 'تتوفر خطط دفع متنوعة تشمل أقساط شهرية أو ربعية حسب المشروع، مع إمكانية التمويل البنكي.', 'المشاريع', 8, true);
