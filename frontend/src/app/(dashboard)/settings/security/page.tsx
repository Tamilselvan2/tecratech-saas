'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, KeyRound, MonitorSmartphone, Shield, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SecuritySettingsPage() {
  const { user, changePassword, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully. Please sign in again.');
      await logout();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update password';
      toast.error(message);
      if (message.toLowerCase().includes('current password')) {
        form.setError('currentPassword', { message: 'Current password is incorrect' });
      }
    } finally {
      setIsUpdating(false);
    }
  };



  if (!user) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border"></div>
      </div>
    );
  }

  // Password strength visual indicator
  const newPwd = form.watch('newPassword') || '';
  let strength = 0;
  if (newPwd.length >= 8) strength += 1;
  if (/[A-Z]/.test(newPwd)) strength += 1;
  if (/[0-9]/.test(newPwd)) strength += 1;
  if (/[^A-Za-z0-9]/.test(newPwd)) strength += 1;

  const strengthColor = 
    strength === 0 ? 'bg-slate-200 dark:bg-slate-800' :
    strength <= 2 ? 'bg-danger' :
    'bg-success';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Security</h3>
        <p className="text-sm text-slate-500">
          Manage your password and security settings.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-950 border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-2 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg">
              <KeyRound className="text-brand-blue dark:text-blue-400" size={20} />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h4>
              <p className="text-xs text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
              <div className="relative">
                <input
                  {...form.register('currentPassword')}
                  type={showCurrent ? 'text' : 'password'}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.currentPassword && (
                <p className="text-xs text-brand-rose font-medium mt-1">{form.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <input
                  {...form.register('newPassword')}
                  type={showNew ? 'text' : 'password'}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:bg-white dark:focus:bg-slate-950 transition-all"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <p className="text-xs text-brand-rose font-medium mt-1">{form.formState.errors.newPassword.message}</p>
              )}
              {/* Password Strength Indicator */}
              {newPwd.length > 0 && (
                <div className="pt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 w-full rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <input
                {...form.register('confirmPassword')}
                type="password"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:bg-white dark:focus:bg-slate-950 transition-all"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-brand-rose font-medium mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating || !form.formState.isDirty}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-brand-blue dark:hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : null}
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>

        </div>
      </div>



    </div>
  );
}
