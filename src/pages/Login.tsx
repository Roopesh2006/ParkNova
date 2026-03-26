import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Shield, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['admin', 'operator']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'admin',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }

      setUser(result);
      setIsLoading(false);
      
      // Navigate to home for all roles, the sidebar/topbar will handle role-based UI
      navigate('/home');
    } catch (error: any) {
      setIsLoading(false);
      alert(error.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-base">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-white border-r border-border">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 p-16 flex flex-col justify-center h-full">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl">
              P
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-text-1">
              Park<span className="text-primary">Nova</span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-display font-bold leading-[1.1] mb-6 text-text-1">
              Smart Parking <br />
              <span className="text-primary">Management</span>
            </h1>
            <p className="text-lg text-text-2 max-w-md mb-12 leading-relaxed">
              Streamline your parking operations with our professional management suite. Real-time monitoring, automated billing, and detailed analytics.
            </p>

            <div className="flex flex-wrap gap-3">
              {['Real-time Slots', 'Dynamic Billing', 'Multi-role Access', 'Revenue Reports'].map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm font-medium text-text-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[520px] bg-bg-surface flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold text-text-1 mb-2">Welcome Back</h2>
            <p className="text-text-3">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-3">E-mail Address</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@gmail.com"
                  className="w-full bg-white border border-border rounded-lg px-4 py-3 text-text-1 placeholder:text-text-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                {errors.email && <p className="text-red text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-3">Password</label>
                  <button type="button" className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-white border border-border rounded-lg px-4 py-3 text-text-1 placeholder:text-text-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
              <label htmlFor="remember" className="text-sm text-text-2">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
