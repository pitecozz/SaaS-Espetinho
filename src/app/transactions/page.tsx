
"use client";

import { useState } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Trash2, ArrowUpRight, ArrowDownRight, UserMinus, Flame, Calendar as CalendarIcon, Filter, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isToday, isYesterday, startOfWeek, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month';
type TypeFilter = 'all' | 'sale' | 'expense' | 'withdrawal' | 'loss';

const CompanyLogo = () => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-primary-foreground/10 flex items-center justify-center shrink-0 shadow-sm">
      {!imgError ? (
        <Image 
          src="/logo.png" 
          alt="Logo" 
          fill 
          className="object-cover" 
          onError={() => setImgError(true)} 
        />
      ) : (
        <Utensils className="w-5 h-5 text-primary" />
      )}
    </div>
  );
};

export default function TransactionsPage() {
  const { transactions, deleteTransaction, isLoaded } = useStore();
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  if (!isLoaded) return null;

  const filteredTransactions = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    const date = new Date(t.timestamp);
    if (dateFilter === 'today') return isToday(date);
    if (dateFilter === 'yesterday') return isYesterday(date);
    if (dateFilter === 'week') return t.timestamp >= startOfWeek(new Date(), { weekStartsOn: 0 }).getTime();
    if (dateFilter === 'month') return t.timestamp >= startOfMonth(new Date()).getTime();
    return true;
  });

  const groupedTransactions = filteredTransactions.reduce((groups: Record<string, any[]>, t) => {
    const date = format(t.timestamp, 'yyyy-MM-dd');
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  return (
    <MobileContainer header={
      <header className="bg-primary p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <CompanyLogo />
          <h1 className="font-headline font-bold text-lg text-primary-foreground">Extrato Financeiro</h1>
        </div>
        <div className="flex gap-2">
          <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
            <SelectTrigger className="bg-white/10 border-none text-[10px] h-7 text-primary-foreground font-bold uppercase">
              <CalendarIcon className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tudo</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="bg-white/10 border-none text-[10px] h-7 text-primary-foreground font-bold uppercase">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="sale">Vendas</SelectItem>
              <SelectItem value="expense">Gastos</SelectItem>
              <SelectItem value="withdrawal">Sangrias</SelectItem>
              <SelectItem value="loss">Perdas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
    }>
      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <p>Nenhum registro encontrado para este filtro.</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <CalendarIcon className="w-3 h-3 text-muted-foreground" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {format(new Date(date + 'T12:00:00'), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </h2>
              </div>
              <div className="space-y-2">
                {groupedTransactions[date].map((t) => {
                  const isPositive = t.type === 'sale';
                  const Icon = t.type === 'sale' ? ArrowUpRight : t.type === 'withdrawal' ? UserMinus : t.type === 'loss' ? Flame : ArrowDownRight;
                  
                  return (
                    <Card key={t.id} className="border-none shadow-sm overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-full",
                            t.type === 'sale' ? "bg-chart-1/10 text-chart-1" : 
                            t.type === 'withdrawal' ? "bg-secondary/10 text-secondary" :
                            "bg-destructive/10 text-destructive"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="max-w-[150px]">
                            <p className="text-sm font-semibold text-foreground truncate">{t.description}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {format(t.timestamp, 'HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-sm font-bold",
                            isPositive ? "text-chart-1" : "text-destructive"
                          )}>
                            {isPositive ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteTransaction(t.id)}
                            className="text-muted-foreground hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </MobileContainer>
  );
}
