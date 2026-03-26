import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  Mail, 
  User as UserIcon, 
  Shield, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { UserStatus } from '../types/index';
import { apiFetch } from '../lib/api-client';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'operator']),
  status: z.enum(['active', 'inactive']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UserCreate() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'operator',
      status: 'active',
    }
  });

  const selectedRole = watch('role');
  const selectedStatus = watch('status');

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
          language: 'en'
        }),
      });

      toast.success('User created successfully', {
        description: `${data.name} has been added as an ${data.role}.`,
        icon: <CheckCircle2 className="text-green" size={20} />
      });
      navigate('/parking/user-list');
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user', {
        description: error.message || 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/parking/user-list')}
            className="p-3 bg-bg-card border border-border rounded-xl text-text-3 hover:text-primary transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-display font-black text-text-1 tracking-tight">Add New User</h2>
            <p className="text-text-3">Create a new system administrator or operator account</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 space-y-8">
              {/* Role Selection */}
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3">Account Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'admin')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
                      selectedRole === 'admin' 
                        ? "bg-purple/10 border-purple text-purple shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                        : "bg-bg-base border-border text-text-3 hover:border-text-3 hover:text-text-2"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      selectedRole === 'admin' ? "bg-purple text-white" : "bg-bg-card text-text-3"
                    )}>
                      <Shield size={24} />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">Administrator</div>
                      <div className="text-xs opacity-60">Full system access</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('role', 'operator')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
                      selectedRole === 'operator' 
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.2)]" 
                        : "bg-bg-base border-border text-text-3 hover:border-text-3 hover:text-text-2"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      selectedRole === 'operator' ? "bg-primary text-white" : "bg-bg-card text-text-3"
                    )}>
                      <UserIcon size={24} />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">Operator</div>
                      <div className="text-xs opacity-60">Limited operational access</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('name')}
                      type="text"
                      placeholder="John Doe"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.name ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('email')}
                      type="email"
                      placeholder="john@parknova.com"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.email ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('password')}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-12 pr-12 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.password ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red font-medium">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-3">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
                    <input 
                      {...register('confirmPassword')}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 bg-bg-base border rounded-xl text-text-1 focus:outline-none transition-all",
                        errors.confirmPassword ? "border-red focus:border-red" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red font-medium">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-text-3">Account Status</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setValue('status', 'active')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                      selectedStatus === 'active' 
                        ? "bg-green/10 border-green text-green shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                        : "bg-bg-base border-border text-text-3 hover:text-text-2"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", selectedStatus === 'active' ? "bg-green" : "bg-text-3")} />
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('status', 'inactive')}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all",
                      selectedStatus === 'inactive' 
                        ? "bg-red/10 border-red text-red shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                        : "bg-bg-base border-border text-text-3 hover:text-text-2"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", selectedStatus === 'inactive' ? "bg-red" : "bg-text-3")} />
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-bg-surface border-t border-border flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate('/parking/user-list')}
                className="px-6 py-3 text-text-2 font-bold hover:text-text-1 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-4">
            <h4 className="font-display font-bold text-text-1 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Security Guidelines
            </h4>
            <ul className="space-y-3 text-sm text-text-2">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Passwords must be at least 8 characters long.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Administrators have full access to system settings and reports.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Operators can only manage parking entries, exits, and basic slot views.
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Ensure the email address is valid for password recovery.
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-violet/20 border border-primary/30 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white mb-4">
                <UserPlus size={20} />
              </div>
              <h4 className="font-display font-bold text-text-1">Quick Tip</h4>
              <p className="text-sm text-text-2 leading-relaxed">
                You can always change a user's role later from the User List management screen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
