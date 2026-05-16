'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface RevenueChartProps {
  data: { month: string; income: number; expense: number }[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center animate-pulse">
        <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
           <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500">
        <div className="w-16 h-16 bg-gradient-to-tr from-brand-blue/20 to-emerald-400/20 rounded-full flex items-center justify-center mb-4 relative shadow-sm">
           <svg className="w-8 h-8 text-brand-blue relative z-10" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <p className="font-extrabold text-slate-900 dark:text-white">No revenue data</p>
        <p className="text-sm mt-1 font-medium">Add transactions to see your cash flow</p>
      </div>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    formattedMonth: format(parseISO(item.month + '-01'), 'MMM yy'),
  }));

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cash Flow</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-success"></div><span className="text-xs font-semibold text-slate-500">Income</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-danger"></div><span className="text-xs font-semibold text-slate-500">Expense</span></div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="formattedMonth" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 700, letterSpacing: '0.05em' }} 
              dy={15} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 700 }} 
              tickFormatter={(value) => {
                const formatted = formatCurrency(value);
                const symbol = formatted.replace(/[0-9.,\s]/g, '');
                return `${symbol}${value >= 1000 ? value/1000 + 'k' : value}`;
              }} 
              dx={-10} 
            />
            <Tooltip 
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid hsl(var(--border))', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)', 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(12px)', 
                padding: '16px',
                borderWidth: '1.5px'
              }}
              itemStyle={{ fontWeight: 800, padding: '4px 0', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
              labelStyle={{ color: 'white', fontWeight: 900, marginBottom: '12px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Income" 
              stroke="#10b981" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              name="Expense" 
              stroke="#f43f5e" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorExpense)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
