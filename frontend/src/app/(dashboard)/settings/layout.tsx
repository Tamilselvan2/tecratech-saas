'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { User, Building, Shield, SlidersHorizontal } from 'lucide-react';
import { SidebarNav } from './components/sidebar-nav';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings/profile',
    icon: User,
  },
  {
    title: 'Organization',
    href: '/settings/organization',
    icon: Building,
  },
  {
    title: 'Security',
    href: '/settings/security',
    icon: Shield,
  },
  {
    title: 'Preferences',
    href: '/settings/preferences',
    icon: SlidersHorizontal,
  },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 pb-16 md:block animate-in fade-in duration-500">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 font-medium">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:mx-0 lg:w-1/5 overflow-x-auto scrollbar-hide pb-2">
          <div className="min-w-max px-4 lg:px-0 lg:min-w-full">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
