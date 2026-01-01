import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Eagerly loaded pages (critical path)
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import PropertyDetails from "./pages/PropertyDetails";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Investment = lazy(() => import("./pages/Investment"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SmartAdvisor = lazy(() => import("./pages/SmartAdvisor"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const FinancingSolutions = lazy(() => import("./pages/FinancingSolutions"));
const MortgageLoans = lazy(() => import("./pages/MortgageLoans"));
const Mortgage = lazy(() => import("./pages/Mortgage"));
const DefaultSolutions = lazy(() => import("./pages/DefaultSolutions"));
const HousingSupport = lazy(() => import("./pages/HousingSupport"));
const UnderConstruction = lazy(() => import("./pages/UnderConstruction"));
const Auth = lazy(() => import("./pages/Auth"));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminUnits = lazy(() => import("./pages/admin/AdminUnits"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminFinancing = lazy(() => import("./pages/admin/AdminFinancing"));
const AdminDevelopers = lazy(() => import("./pages/admin/AdminDevelopers"));
const AdminLocations = lazy(() => import("./pages/admin/AdminLocations"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const OdooIntegration = lazy(() => import("./pages/admin/OdooIntegration"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminFAQs = lazy(() => import("./pages/admin/AdminFAQs"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />
                <Route path="/under-construction" element={<UnderConstruction />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/investment" element={<Investment />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/smart-advisor" element={<SmartAdvisor />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/financing-solutions" element={<FinancingSolutions />} />
                <Route path="/mortgage-loans" element={<MortgageLoans />} />
                <Route path="/mortgage" element={<Mortgage />} />
                <Route path="/default-solutions" element={<DefaultSolutions />} />
                <Route path="/housing-support" element={<HousingSupport />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes - TEMP: requireAdmin removed for debugging */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects" element={
                  <ProtectedRoute requireAdmin>
                    <AdminProjects />
                  </ProtectedRoute>
                } />
                <Route path="/admin/units" element={
                  <ProtectedRoute requireAdmin>
                    <AdminUnits />
                  </ProtectedRoute>
                } />
                <Route path="/admin/properties" element={
                  <ProtectedRoute requireAdmin>
                    <AdminProperties />
                  </ProtectedRoute>
                } />
                <Route path="/admin/customers" element={
                  <ProtectedRoute requireAdmin>
                    <AdminCustomers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/leads" element={
                  <ProtectedRoute requireAdmin>
                    <AdminLeads />
                  </ProtectedRoute>
                } />
                <Route path="/admin/financing" element={
                  <ProtectedRoute requireAdmin>
                    <AdminFinancing />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute requireAdmin>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/developers" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDevelopers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/locations" element={
                  <ProtectedRoute requireAdmin>
                    <AdminLocations />
                  </ProtectedRoute>
                } />
                <Route path="/admin/odoo-integration" element={
                  <ProtectedRoute requireAdmin>
                    <OdooIntegration />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog" element={
                  <ProtectedRoute requireAdmin>
                    <AdminBlog />
                  </ProtectedRoute>
                } />
                <Route path="/admin/faqs" element={
                  <ProtectedRoute requireAdmin>
                    <AdminFAQs />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;