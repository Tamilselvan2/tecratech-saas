'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, Menu, X, Users, ShieldCheck, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { LogoutButton } from '../auth/logout-button';
import { useOrganization } from '@/hooks/use-organization';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
  { name: 'Transactions', href: '/transactions', icon: Receipt, adminOnly: false },
  { name: 'Team', href: '/team', icon: Users, adminOnly: false },
  { name: 'Audit Log', href: '/audit', icon: ShieldCheck, adminOnly: true },
  { name: 'Settings', href: '/settings/profile', icon: Settings, adminOnly: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const { data: org } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-border w-64">
      <div className="p-6 border-b border-border flex justify-between items-center h-20 shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-50 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            Fintriq
          </h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1.5 opacity-70">
            {org?.name || 'Loading...'}
          </p>
        </div>
        <button className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors" onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative group',
                isActive
                  ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(59,130,246,0.15)] border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <item.icon size={18} className={cn(isActive ? 'text-primary' : 'text-muted-foreground/70 group-hover:text-primary transition-colors')} />
              {item.name}
              {isActive && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-sidebar flex items-center justify-center">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Header */}
      <div className="md:hidden fixed top-0 left-0 z-40 w-full h-16 bg-card/80 backdrop-blur-md border-b border-border px-4 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-black text-slate-50 tracking-tight">Fintriq</span>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full transform transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
