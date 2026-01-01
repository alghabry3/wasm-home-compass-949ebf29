import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100, 'الاسم طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('بيانات الدخول غير صحيحة');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/admin');
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsSubmitting(false);
    
    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('هذا البريد مسجل مسبقاً');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('تم إنشاء الحساب بنجاح');
      navigate('/admin');
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'} | وسم هوم العقارية</title>
      </Helmet>

      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo & Back */}
          <div className="text-center mb-8">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة للرئيسية
            </button>
            <img src={logo} alt="وسم هوم" className="h-16 mx-auto brightness-0 invert mb-4" />
            <h1 className="text-2xl font-bold text-primary-foreground">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h1>
            <p className="text-primary-foreground/70 mt-2">
              {isLogin ? 'مرحباً بعودتك' : 'انضم إلى وسم هوم العقارية'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl p-8 shadow-strong">
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      {...loginForm.register('email')}
                      className="w-full pr-12 pl-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password')}
                      className="w-full pr-12 pl-12 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-destructive text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري التسجيل...' : 'تسجيل الدخول'}
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      {...signupForm.register('fullName')}
                      className="w-full pr-12 pl-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  {signupForm.formState.errors.fullName && (
                    <p className="text-destructive text-sm mt-1">{signupForm.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      {...signupForm.register('email')}
                      className="w-full pr-12 pl-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...signupForm.register('password')}
                      className="w-full pr-12 pl-12 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-destructive text-sm mt-1">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...signupForm.register('confirmPassword')}
                      className="w-full pr-12 pl-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
                </Button>
              </form>
            )}

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-accent font-medium hover:underline mr-2"
                >
                  {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
