
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Transaction, Product, DailySummary, AuditLog, DaySession } from './types';
import { PlaceHolderImages } from './placeholder-images';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'esp-1', name: 'Carne', price: 10.0, cost: 4.5, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxncmlsbGVkJTIwbWVhdCUyMHNrZXdlcnxlbnwwfHx8fDE3NzE3MzgyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-2', name: 'Frango', price: 9.0, cost: 3.5, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-3', name: 'Coração', price: 10.0, cost: 4.0, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-4', name: 'Linguiça Toscana', price: 9.0, cost: 3.0, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-5', name: 'Linguiça Apimentada', price: 9.0, cost: 3.2, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-6', name: 'Kafta', price: 10.0, cost: 4.2, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-7', name: 'Pão de Alho', price: 9.0, cost: 2.5, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-8', name: 'Queijo Coalho', price: 11.0, cost: 4.0, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-9', name: 'Medalhão de Frango', price: 12.0, cost: 5.0, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'esp-10', name: 'Medalhão de Carne', price: 13.0, cost: 6.0, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlc3BldGluaG98ZW58MHx8fHwxNzcxNzQ0Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'prat-1', name: 'Jantinha Individual', price: 28.0, cost: 12.0, image: PlaceHolderImages[4].imageUrl },
  { id: 'prat-2', name: 'Combo Casal', price: 65.0, cost: 28.0, image: PlaceHolderImages[4].imageUrl },
  { id: 'prat-3', name: 'Feijão Tropeiro (500g)', price: 20.0, cost: 8.0, image: PlaceHolderImages[4].imageUrl },
  { id: 'prat-4', name: 'Porção de Mandioca Cozida', price: 12.0, cost: 4.0, image: PlaceHolderImages[4].imageUrl },
  { id: 'beb-1', name: 'Refrigerante Lata', price: 6.0, cost: 2.5, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzb2RhfGVufDB8fHx8MTc3MTc0NDY2MXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-2', name: 'Refrigerante 2L', price: 14.0, cost: 7.0, image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzb2RhfGVufDB8fHx8MTc3MTc0NDY2MXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-3', name: 'Água Mineral', price: 4.0, cost: 1.0, image: 'https://images.unsplash.com/photo-1550505095-81378a674395?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8d2F0ZXIlMjBib3R0bGV8ZW58MHx8fHwxNzcxNzQ0NzUyfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-4', name: 'Cerveja Lata', price: 7.0, cost: 3.5, image: 'https://images.unsplash.com/photo-1591025106211-409d7cd59974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxiZWVyJTIwY2FufGVufDB8fHx8MTc3MTc0NDgwM3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-5', name: 'Caipirinha', price: 15.0, cost: 6.0, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjb2NrdGFpbHxlbnwwfHx8fDE3NzE3NDUyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-6', name: 'Suco de Polpa 1L', price: 12.0, cost: 5.0, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqdWljZXxlbnwwfHx8fDE3NzE3NDU1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-7', name: 'Suco de Polpa 2L', price: 18.0, cost: 8.0, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxqdWljZXxlbnwwfHx8fDE3NzE3NDU1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'beb-8', name: 'Copo de Suco', price: 7.0, cost: 3.0, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxqdWljZXxlbnwwfHx8fDE3NzE3NDU1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export function useStore() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentSession, setCurrentSession] = useState<DaySession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('ev_transactions');
    const savedLogs = localStorage.getItem('ev_audit');
    const savedSession = localStorage.getItem('ev_session');
    
    if (savedTransactions) {
      try { setTransactions(JSON.parse(savedTransactions)); } catch(e) {}
    }
    if (savedLogs) {
      try { setAuditLogs(JSON.parse(savedLogs)); } catch(e) {}
    }
    if (savedSession && savedSession !== 'undefined' && savedSession !== 'null' && savedSession !== '') {
      try { setCurrentSession(JSON.parse(savedSession)); } catch(e) {}
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ev_transactions', JSON.stringify(transactions));
      localStorage.setItem('ev_audit', JSON.stringify(auditLogs));
      localStorage.setItem('ev_session', JSON.stringify(currentSession));
    }
  }, [transactions, auditLogs, currentSession, isLoaded]);

  const openDay = useCallback(() => {
    if (currentSession) return;
    
    const session: DaySession = {
      id: crypto.randomUUID(),
      openedAt: Date.now(),
      status: 'open'
    };
    setCurrentSession(session);
    
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      action: 'SESSÃO',
      targetId: session.id,
      details: 'Caixa aberto para novo dia de trabalho',
      timestamp: Date.now()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentSession]);

  const closeDay = useCallback(() => {
    if (!currentSession) return;
    
    const sessionId = currentSession.id;
    setCurrentSession(null);
    
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      action: 'SESSÃO',
      targetId: sessionId,
      details: 'Caixa fechado e dia encerrado',
      timestamp: Date.now()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentSession]);

  const addTransaction = useCallback((type: Transaction['type'], amount: number, description: string, options?: { metadata?: any, timestamp?: number }) => {
    const transactionId = crypto.randomUUID();
    const timestamp = options?.timestamp || Date.now();
    const newTransaction: Transaction = {
      id: transactionId,
      type,
      amount,
      description,
      timestamp,
      metadata: options?.metadata
    };
    
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      action: 'CRIAR',
      targetId: transactionId,
      details: `Nova ${type}: ${description} R$${amount.toFixed(2)}`,
      timestamp: Date.now()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const target = prev.find(t => t.id === id);
      const next = prev.filter(t => t.id !== id);
      
      const newLog: AuditLog = {
        id: crypto.randomUUID(),
        action: 'DELETAR',
        targetId: id,
        details: `Exclusão de ${target?.type || 'transação'}: ${target?.description || ''}`,
        timestamp: Date.now()
      };
      
      setAuditLogs(logs => [newLog, ...logs]);
      return next;
    });
  }, []);

  const getSummary = (period: 'day' | 'week' | 'month' = 'day'): DailySummary => {
    let startTime = 0;
    const now = new Date();
    
    if (period === 'day') {
      startTime = new Date().setHours(0,0,0,0);
    } else if (period === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      weekAgo.setHours(0,0,0,0);
      startTime = weekAgo.getTime();
    } else if (period === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      monthAgo.setHours(0,0,0,0);
      startTime = monthAgo.getTime();
    }

    const filtered = transactions.filter(t => t.timestamp >= startTime);
    
    const revenue = filtered.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const withdrawals = filtered.filter(t => t.type === 'withdrawal').reduce((acc, t) => acc + t.amount, 0);
    const losses = filtered.filter(t => t.type === 'loss').reduce((acc, t) => acc + t.amount, 0);
    
    const netProfit = revenue - expenses - withdrawals - losses;

    return { revenue, expenses, withdrawals, losses, netProfit };
  };

  const getMonthlyRevenue = () => {
    const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return transactions
      .filter(t => t.timestamp >= monthAgo && t.type === 'sale')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const monthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return transactions
      .filter(t => t.timestamp >= monthAgo && (t.type === 'expense' || t.type === 'loss'))
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return { 
    transactions, 
    products, 
    auditLogs, 
    currentSession,
    openDay,
    closeDay,
    addTransaction, 
    deleteTransaction,
    getSummary,
    getMonthlyRevenue,
    getMonthlyExpenses,
    isLoaded 
  };
}
