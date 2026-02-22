
"use client";

import { useState } from 'react';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/lib/store';
import { ShieldCheck, History, Info, Utensils } from 'lucide-react';
import Image from 'next/image';

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

export default function AuditPage() {
  const { auditLogs, isLoaded } = useStore();

  if (!isLoaded) return null;

  return (
    <MobileContainer header={
      <header className="bg-primary p-4 shadow-sm flex items-center gap-3">
        <CompanyLogo />
        <h1 className="font-headline font-bold text-lg text-primary-foreground">Trilha de Auditoria</h1>
      </header>
    }>
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-700">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <p className="text-xs leading-relaxed">
            Todas as alterações financeiras são registradas aqui para sua segurança. 
            Isso garante rastreabilidade total do seu patrimônio.
          </p>
        </div>

        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <History className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Nenhum log registrado ainda.</p>
            </div>
          ) : (
            auditLogs.map((log, index) => (
              <div key={`${log.id}-${index}`} className="p-3 bg-white border border-border/50 rounded-md shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-700' : 
                    log.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-foreground font-medium">{log.details}</p>
                <p className="text-[9px] text-muted-foreground mt-1 truncate">ID: {log.targetId}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </MobileContainer>
  );
}
