"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, BarChart3, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Início', icon: Home, href: '/' },
    { label: 'Extrato', icon: List, href: '/transactions' },
    { label: 'Insights', icon: BarChart3, href: '/insights' },
    { label: 'Auditoria', icon: ShieldCheck, href: '/audit' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-border/50 safe-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-secondary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-secondary/10")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}