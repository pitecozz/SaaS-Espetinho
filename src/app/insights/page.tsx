
"use client";

import { useState } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { aiSpendingAdjustmentRecommendations, AiSpendingAdjustmentOutput } from '@/ai/flows/ai-spending-adjustment-recommendations';
import { Sparkles, Loader2, BrainCircuit, Target, TrendingUp, AlertTriangle, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

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

export default function InsightsPage() {
  const { getMonthlyRevenue, getMonthlyExpenses, isLoaded } = useStore();
  const [aiResult, setAiResult] = useState<AiSpendingAdjustmentOutput | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const monthlyRevenue = getMonthlyRevenue();
  const monthlyExpenses = getMonthlyExpenses();
  const breakEvenProgress = Math.min((monthlyRevenue / (monthlyExpenses || 1)) * 100, 100);

  const chartData = [
    { name: 'Receita', value: monthlyRevenue, color: 'hsl(var(--chart-1))' },
    { name: 'Despesas', value: monthlyExpenses, color: 'hsl(var(--chart-2))' },
  ];

  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const result = await aiSpendingAdjustmentRecommendations({
        businessType: "Espetinho do Mineiro II",
        currentRevenue: monthlyRevenue,
        currentExpenses: monthlyExpenses,
        currentNetProfit: monthlyRevenue - monthlyExpenses,
        financialGoal: "Otimizar estoque e melhorar a margem de cada espetinho."
      });
      setAiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <MobileContainer header={
      <header className="bg-primary p-4 shadow-sm flex items-center gap-3">
        <CompanyLogo />
        <h1 className="font-headline font-bold text-lg text-primary-foreground">Insights de Performance</h1>
      </header>
    }>
      <div className="space-y-6">
        
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              Ponto de Equilíbrio
            </CardTitle>
            <CardDescription>Quanto falta para cobrir os gastos do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>{breakEvenProgress.toFixed(0)}% Coberto</span>
                <span className="text-secondary">R$ {monthlyRevenue.toFixed(0)} / R$ {monthlyExpenses.toFixed(0)}</span>
              </div>
              <Progress value={breakEvenProgress} className="h-3 bg-muted" />
              {breakEvenProgress < 100 ? (
                <p className="text-[10px] text-destructive flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  Você ainda está operando no vermelho este mês.
                </p>
              ) : (
                <p className="text-[10px] text-chart-1 flex items-center gap-1 mt-1 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  Operação lucrativa! Tudo a partir de agora é lucro real.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Fluxo Mensal (30 dias)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  content={({active, payload}) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 shadow-lg rounded-md border text-xs">
                          <p className="font-bold">{payload[0].payload.name}</p>
                          <p>R$ {Number(payload[0].value).toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <section>
          {!aiResult ? (
            <Button 
              onClick={fetchAiInsights} 
              disabled={loadingAi}
              className="w-full h-16 bg-secondary hover:bg-secondary/90 flex gap-2 items-center"
            >
              {loadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Gerar Consultoria com IA
            </Button>
          ) : (
            <Card className="border-2 border-secondary/20 bg-white/50 shadow-lg">
              <CardHeader className="bg-secondary/5">
                <CardTitle className="text-lg flex items-center gap-2 text-secondary">
                  <BrainCircuit className="w-5 h-5" />
                  Estratégia Recomendada
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground italic">"{aiResult.summary}"</p>
                <div className="space-y-3">
                  {aiResult.recommendations.map((rec, i) => (
                    <div key={i} className="p-3 bg-white rounded-md border border-secondary/10 shadow-sm space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase text-secondary">{rec.category}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-secondary/10 rounded-full font-bold">{rec.adjustmentType}</span>
                      </div>
                      <p className="text-sm font-semibold">{rec.amountOrPercentage}</p>
                      <p className="text-xs text-foreground/80">{rec.rationale}</p>
                      <div className="pt-1 mt-1 border-t border-dashed text-[10px] text-chart-1 font-bold">
                        Impacto: {rec.expectedImpact}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => setAiResult(null)}>Recalcular</Button>
              </CardContent>
            </Card>
          )}
        </section>

      </div>
      <BottomNav />
    </MobileContainer>
  );
}
