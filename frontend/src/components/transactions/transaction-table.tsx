'use client';

import { Transaction } from '@/types/models';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { RoleGate } from '../auth/role-gate';
import { Role } from '@/types/models';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

interface MenuPosition {
  top: number;
  right: number;
}

export function TransactionTable({ transactions, isLoading, onEdit, onDelete }: TransactionTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, right: 0 });
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close menu on scroll or resize so it doesn't drift
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, []);

  const handleMenuToggle = (id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const btn = buttonRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setOpenMenuId(id);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-14 bg-slate-50 dark:bg-slate-900 border-b border-border"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 border-b border-border bg-white dark:bg-slate-950"></div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-16 text-center bg-white dark:bg-slate-950">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full mx-auto flex items-center justify-center mb-5 ring-1 ring-border shadow-sm">
          <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No transactions found</h3>
        <p className="mt-2 text-slate-500 font-medium">Try adjusting your filters or create a new transaction to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-white dark:bg-slate-950">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-border text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 whitespace-nowrap">Category</th>
              <th className="px-6 py-4 whitespace-nowrap">Type</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Amount</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => {
              const isIncome = t.type === 'INCOME';
              return (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {format(new Date(t.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white max-w-[250px] truncate">
                    {t.description || <span className="text-slate-400 font-normal italic">No description</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${isIncome ? 'bg-brand-emerald/15 text-brand-emerald' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-base font-extrabold tracking-tight text-right ${isIncome ? 'text-brand-emerald' : 'text-slate-900 dark:text-white'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <RoleGate allowedRoles={[Role.ADMIN, Role.ACCOUNTANT]}>
                      <button
                        ref={(el) => { buttonRefs.current[t.id] = el; }}
                        onClick={() => handleMenuToggle(t.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-all shadow-sm ring-1 ring-transparent hover:ring-border focus:opacity-100"
                        aria-label="Transaction actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </RoleGate>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Fixed-position dropdown — never clipped by table overflow */}
      {openMenuId && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
          <div
            className="fixed z-50 w-40 rounded-xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"
            style={{ top: menuPos.top, right: menuPos.right }}
          >
            <div className="p-1.5 flex flex-col gap-0.5">
              <button
                onClick={() => { const t = transactions.find(tx => tx.id === openMenuId); if (t) onEdit(t); setOpenMenuId(null); }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Pencil className="h-4 w-4 text-brand-blue" />
                Edit
              </button>
              <RoleGate allowedRoles={[Role.ADMIN]}>
                <button
                  onClick={() => { const t = transactions.find(tx => tx.id === openMenuId); if (t) onDelete(t); setOpenMenuId(null); }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-brand-rose hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-brand-rose" />
                  Delete
                </button>
              </RoleGate>
            </div>
          </div>
        </>
      )}
    </>
  );
}

