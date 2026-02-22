
"use client";

import { DailySummary } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfitDisplayProps {
  summary: DailySummary;
  period: 'day' | 'week' | 'month';
}

export function ProfitDisplay({ summary, period }: ProfitDisplayProps) {
  const isPositive = summary.netProfit >= 0;

  const periodLabel = {
    day: 'do Dia',
    week: 'da Semana',
    month: 'do Mês'
  }[period];

  return (
    <Card className={cn(
      "border-none shadow-lg transition-all duration-300",
      isPositive ? "bg-chart-1 text-white" : "bg-destructive text-white"
    )}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <span className="text-sm font-semibold opacity-90 mb-1 uppercase tracking-wider">
          Lucro Líquido {periodLabel}
        </span>
        <div className="flex items-center gap-2 mb-2">
          {isPositive ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
          <h2 className="text-4xl font-bold font-headline">
            R$ {summary.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="flex gap-4 mt-2 text-xs opacity-80 font-medium">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/40" />
            Vendas: R${summary.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/40" />
            Sangrias: R${summary.withdrawals.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
