'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Building, Loader2, AlertTriangle, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useOrganization, useUpdateOrganization } from '@/hooks/use-organization';

const orgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
});

type OrgFormValues = z.infer<typeof orgSchema>;

export default function OrganizationSettingsPage() {
  const { user, isAdmin } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: org, isLoading: orgLoading } = useOrganization();
  const updateOrgMutation = useUpdateOrganization();

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgSchema),
    values: {
      name: org?.name || '',
    },
  });

  const onSubmit = async (data: OrgFormValues) => {
    try {
      await updateOrgMutation.mutateAsync({ name: data.name });
      toast.success('Organization updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update organization');
    }
  };

  const handleDelete = () => {
    // Placeholder action
    toast.error('Deletion requires support contact for this plan.');
    setShowDeleteConfirm(false);
  };

  if (!user || orgLoading) {
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
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Organization</h3>
        <p className="text-sm text-slate-500">
          Manage your organization details and workspace settings.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Organization Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="text-slate-400" size={18} />
                </div>
                <input
                  {...form.register('name')}
                  disabled={!isAdmin}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:bg-white dark:focus:bg-slate-950 transition-all disabled:opacity-60"
                />
              </div>
              {form.formState.errors.name && (
                <p className="text-xs text-brand-rose font-medium mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            {isAdmin && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={updateOrgMutation.isPending || !form.formState.isDirty}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-brand-blue dark:hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateOrgMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                  {updateOrgMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>

          <div className="h-px bg-border w-full"></div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Organization Info</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border">
                <p className="text-xs text-slate-500 font-medium mb-1">Organization ID</p>
                <p className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate">{user.orgId}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border">
                <p className="text-xs text-slate-500 font-medium mb-1">Created</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {org?.createdAt ? format(new Date(org.createdAt), 'MMM dd, yyyy') : '...'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border">
                <p className="text-xs text-slate-500 font-medium mb-1">Total Members</p>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{org?._count?.users || 0}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Danger Zone */}
      {isAdmin && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-4">
            <div>
              <h4 className="text-base font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
                <AlertTriangle size={20} />
                Danger Zone
              </h4>
              <p className="text-sm text-red-600/80 dark:text-red-400 mt-1">
                Permanently delete this organization and all of its data. This action cannot be undone.
              </p>
            </div>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              Delete Organization
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Placeholder */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border p-6 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Are you absolutely sure?</h3>
            <p className="text-sm text-slate-500 mt-2">
              This will permanently delete your organization, all transactions, team members, and audit logs.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Yes, delete organization
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
