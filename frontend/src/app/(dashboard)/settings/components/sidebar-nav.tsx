'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: LucideIcon;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
            )}
          >
            <item.icon size={18} className={cn(isActive ? 'text-brand-blue dark:text-blue-400' : 'text-slate-400')} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
