import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function MobileContainer({ children, header }: MobileContainerProps) {
  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-background min-h-screen relative overflow-x-hidden">
      {header && <div className="sticky top-0 z-30">{header}</div>}
      <main className="flex-1 px-4 py-4 pb-24">
        {children}
      </main>
    </div>
  );
}
