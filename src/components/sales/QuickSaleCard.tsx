"use client";

import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface QuickSaleCardProps {
  product: Product;
  onSale: (product: Product) => void;
}

export function QuickSaleCard({ product, onSale }: QuickSaleCardProps) {
  return (
    <Card 
      onClick={() => onSale(product)}
      className="overflow-hidden cursor-pointer active:scale-95 transition-transform border-none shadow-sm hover:shadow-md bg-white group"
    >
      <div className="relative aspect-square w-full">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className="object-cover transition-transform group-hover:scale-110"
          data-ai-hint="grilled food"
        />
        <div className="absolute inset-0 bg-black/5 group-active:bg-black/10 transition-colors" />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm">
          <p className="text-sm font-bold truncate text-foreground">{product.name}</p>
          <p className="text-xs font-semibold text-secondary">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
