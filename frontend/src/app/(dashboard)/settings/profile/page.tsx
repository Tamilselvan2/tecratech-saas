'use client';

import { useAuth } from '@/hooks/use-auth';
import { User, Mail, Shield, Building2 } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-xl border border-border"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Profile</h3>
        <p className="text-sm text-slate-500">
          Your personal information and account details.
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-950 border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-blue to-emerald-400 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white dark:ring-slate-900 transition-all">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{user.name || 'User'}</h4>
              <p className="text-sm text-slate-500 font-medium">{user.role}</p>
            </div>
          </div>

          <div className="h-px bg-border w-full"></div>

          {/* Read-only Details Section */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl">
                <User size={18} className="text-brand-blue" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name || 'Not set'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl">
                <Mail size={18} className="text-brand-blue" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Role</label>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl">
                <Shield size={18} className="text-emerald-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.role}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Organization ID</label>
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl">
                <Building2 size={18} className="text-slate-400" />
                <span className="text-sm font-mono text-slate-500">{user.orgId}</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
