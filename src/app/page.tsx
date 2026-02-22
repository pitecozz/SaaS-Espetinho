
"use client";

import { MobileContainer } from '@/components/layout/MobileContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { ProfitDisplay } from '@/components/dashboard/ProfitDisplay';
import { QuickSaleCard } from '@/components/sales/QuickSaleCard';
import { useStore } from '@/lib/store';
import { TransactionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, Utensils, Beer, Package, Calendar as CalendarIcon, Power, PlayCircle, History, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Componente de Logo com fallback para quando a imagem não existir
const CompanyLogo = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-primary-foreground/10 flex items-center justify-center shrink-0 shadow-sm">
      {!imgError ? (
        <Image 
          src="/logo.png" 
          alt="Logo Espetinho do Mineiro" 
          fill 
          className="object-cover" 
          priority 
          onError={() => setImgError(true)} 
        />
      ) : (
        <Utensils className="w-6 h-6 text-primary" />
      )}
    </div>
  );
};

const ManualEntryForm = ({ 
  isLoss = false, 
  amount, setAmount, 
  desc, setDesc, 
  selectedDateStr, setSelectedDateStr, 
  selectedType, setSelectedType, 
  onConfirm 
}: { 
  isLoss?: boolean;
  amount: string;
  setAmount: (v: string) => void;
  desc: string;
  setDesc: (v: string) => void;
  selectedDateStr: string;
  setSelectedDateStr: (v: string) => void;
  selectedType: TransactionType;
  setSelectedType: (v: TransactionType) => void;
  onConfirm: (type: TransactionType) => void;
}) => (
  <div className="space-y-4 py-4">
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold">Data do Lançamento</Label>
        <Input 
          type="date" 
          value={selectedDateStr} 
          onChange={e => setSelectedDateStr(e.target.value)} 
          className="h-10 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold">Tipo de Registro</Label>
        {isLoss ? (
          <div className="h-10 flex items-center px-3 border rounded-md bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-tighter">
            PREJUÍZO / PERDA
          </div>
        ) : (
          <Select value={selectedType} onValueChange={(v: any) => setSelectedType(v)}>
            <SelectTrigger className="h-10 text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">Venda</SelectItem>
              <SelectItem value="expense">Gasto/Compra</SelectItem>
              <SelectItem value="withdrawal">Retirada/Sangria</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
    
    <div className="space-y-1.5">
      <Label className="text-xs font-bold">Valor em R$</Label>
      <Input 
        type="number" 
        inputMode="decimal"
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        placeholder="0,00" 
        className="h-12 text-lg font-black"
      />
    </div>

    <div className="space-y-1.5">
      <Label className="text-xs font-bold">Descrição (Opcional)</Label>
      <Input 
        value={desc} 
        onChange={e => setDesc(e.target.value)} 
        placeholder="Ex: Venda Mesa 5, Compra Carvão..." 
        className="h-10 text-sm"
      />
    </div>

    <Button 
      onClick={() => onConfirm(isLoss ? 'loss' : selectedType)} 
      className={`w-full h-14 text-md font-black uppercase tracking-tight shadow-md ${isLoss ? 'bg-destructive' : 'bg-secondary text-white'}`}
    >
      Confirmar Lançamento
    </Button>
  </div>
);

export default function Home() {
  const { products, getSummary, addTransaction, currentSession, openDay, closeDay, isLoaded } = useStore();
  const { toast } = useToast();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const summary = getSummary(period);
  
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedDateStr, setSelectedDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedType, setSelectedType] = useState<TransactionType>('sale');

  if (!isLoaded) return null;

  const isDayOpen = !!currentSession;

  const handleQuickSale = (product: any) => {
    if (!isDayOpen) {
      toast({
        variant: "destructive",
        title: "Caixa Fechado",
        description: "Abra o caixa ou use o botão 'Lançar Manual' para registros de outros dias.",
      });
      return;
    }
    addTransaction('sale', product.price, `Venda: ${product.name}`, { metadata: { productId: product.id } });
    toast({
      title: "Venda Registrada!",
      description: `${product.name} - R$ ${product.price.toFixed(2)}`,
    });
  };

  const handleAddManual = (type: TransactionType) => {
    const val = parseFloat(amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      toast({
        variant: "destructive",
        title: "Valor Inválido",
        description: "Insira um valor maior que zero.",
      });
      return;
    }
    
    const timestamp = new Date(selectedDateStr + 'T12:00:00').getTime();
    
    const labelMap: Record<TransactionType, string> = {
      sale: 'Venda Manual',
      expense: 'Despesa',
      withdrawal: 'Retirada/Sangria',
      loss: 'Perda/Quebra'
    };

    addTransaction(type, val, desc || labelMap[type], { timestamp });
    
    setAmount('');
    setDesc('');
    
    toast({
      title: "Sucesso!",
      description: "Registro adicionado ao histórico.",
    });
  };

  const espetos = products.filter(p => p.id.startsWith('esp-'));
  const combos = products.filter(p => p.id.startsWith('prat-'));
  const bebidas = products.filter(p => p.id.startsWith('beb-'));

  // Header padrão unificado
  const MainHeader = () => (
    <header className="bg-primary p-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-3">
        <CompanyLogo />
        <div>
          <h1 className="font-headline font-bold text-lg text-primary-foreground leading-tight">Espetinho</h1>
          <p className="text-[10px] font-black text-primary-foreground/80 uppercase tracking-tighter">do Mineiro II</p>
        </div>
      </div>
      {isDayOpen && (
        <Button onClick={closeDay} variant="ghost" size="sm" className="text-primary-foreground bg-black/10 hover:bg-black/20 gap-2 h-9 px-4 rounded-full">
          <Power className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase">Fechar Dia</span>
        </Button>
      )}
    </header>
  );

  if (!isDayOpen) {
    return (
      <MobileContainer header={<MainHeader />}>
        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center shadow-inner">
            <Power className="w-12 h-12 text-muted-foreground opacity-30" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">CAIXA FECHADO</h2>
            <p className="text-muted-foreground text-sm px-8">Inicie o seu dia de trabalho clicando no botão abaixo.</p>
          </div>
          <Button onClick={openDay} size="lg" className="w-full h-20 text-lg font-black uppercase gap-3 bg-secondary hover:bg-secondary/90 shadow-xl border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all">
            <PlayCircle className="w-8 h-8" />
            Abrir Caixa Agora
          </Button>
          
          <div className="pt-10 border-t w-full">
            <p className="text-[10px] text-muted-foreground uppercase font-black mb-4 tracking-[0.2em]">Registros de Outros Dias</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-16 gap-3 text-muted-foreground border-2 border-dashed border-muted hover:bg-muted/30">
                  <PlusCircle className="w-5 h-5" />
                  Lançamento de Dias Passados
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] rounded-2xl border-none p-0 overflow-hidden">
                <div className="bg-primary p-6 text-primary-foreground">
                  <DialogHeader>
                    <DialogTitle className="font-black text-xl uppercase tracking-tight">Lançamento Manual</DialogTitle>
                  </DialogHeader>
                </div>
                <div className="p-6">
                  <ManualEntryForm 
                    amount={amount} setAmount={setAmount}
                    desc={desc} setDesc={setDesc}
                    selectedDateStr={selectedDateStr} setSelectedDateStr={setSelectedDateStr}
                    selectedType={selectedType} setSelectedType={setSelectedType}
                    onConfirm={handleAddManual}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <BottomNav />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer header={<MainHeader />}>
      <div className="space-y-6">
        <div className="flex justify-end -mb-4">
          <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
            <SelectTrigger className="w-[150px] h-9 text-[10px] bg-white border-none shadow-sm font-black uppercase tracking-wider rounded-full px-4">
              <CalendarIcon className="w-3 h-3 mr-2 text-secondary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="font-bold">Hoje</SelectItem>
              <SelectItem value="week" className="font-bold">Esta Semana</SelectItem>
              <SelectItem value="month" className="font-bold">Este Mês</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ProfitDisplay summary={summary} period={period} />

        <section>
          <Tabs defaultValue="espetos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-5 bg-muted/40 p-1.5 h-auto rounded-xl">
              <TabsTrigger value="espetos" className="flex flex-col py-3 gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                <Utensils className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase">Espetos</span>
              </TabsTrigger>
              <TabsTrigger value="combos" className="flex flex-col py-3 gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                <Package className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase">Combos</span>
              </TabsTrigger>
              <TabsTrigger value="bebidas" className="flex flex-col py-3 gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                <Beer className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase">Bebidas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="espetos" className="grid grid-cols-2 gap-4 outline-none">
              {espetos.map(product => (
                <QuickSaleCard key={product.id} product={product} onSale={handleQuickSale} />
              ))}
            </TabsContent>

            <TabsContent value="combos" className="grid grid-cols-2 gap-4 outline-none">
              {combos.map(product => (
                <QuickSaleCard key={product.id} product={product} onSale={handleQuickSale} />
              ))}
            </TabsContent>

            <TabsContent value="bebidas" className="grid grid-cols-2 gap-4 outline-none">
              {bebidas.map(product => (
                <QuickSaleCard key={product.id} product={product} onSale={handleQuickSale} />
              ))}
            </TabsContent>
          </Tabs>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex flex-col gap-1.5 border-2 border-secondary/20 hover:bg-secondary/5 rounded-2xl shadow-sm transition-all group">
                <PlusCircle className="w-6 h-6 text-secondary group-active:scale-90 transition-transform" />
                <span className="text-[10px] font-black uppercase">Lançar Manual</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] rounded-2xl border-none p-0 overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground">
                <DialogHeader>
                  <DialogTitle className="font-black text-xl uppercase tracking-tight">Novo Registro</DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6">
                <ManualEntryForm 
                  amount={amount} setAmount={setAmount}
                  desc={desc} setDesc={setDesc}
                  selectedDateStr={selectedDateStr} setSelectedDateStr={setSelectedDateStr}
                  selectedType={selectedType} setSelectedType={setSelectedType}
                  onConfirm={handleAddManual}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex flex-col gap-1.5 border-2 border-destructive/20 hover:bg-destructive/5 rounded-2xl shadow-sm transition-all group">
                <AlertCircle className="w-6 h-6 text-destructive group-active:scale-90 transition-transform" />
                <span className="text-[10px] font-black uppercase">Registrar Perda</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] rounded-2xl border-none p-0 overflow-hidden">
              <div className="bg-destructive p-6 text-white">
                <DialogHeader>
                  <DialogTitle className="font-black text-xl uppercase tracking-tight text-white">Registrar Perda</DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6">
                <ManualEntryForm 
                  isLoss={true}
                  amount={amount} setAmount={setAmount}
                  desc={desc} setDesc={setDesc}
                  selectedDateStr={selectedDateStr} setSelectedDateStr={setSelectedDateStr}
                  selectedType={selectedType} setSelectedType={setSelectedType}
                  onConfirm={handleAddManual}
                />
              </div>
            </DialogContent>
          </Dialog>
        </section>
      </div>
      <BottomNav />
    </MobileContainer>
  );
}
