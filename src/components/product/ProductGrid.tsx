import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white border border-border rounded-[3px]">
        <p className="font-display text-2xl text-forest-900 mb-2">No botanical rituals found</p>
        <p className="text-sm text-charcoal-600">Try adjusting your filters or browsing all collections.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-6 md:gap-8`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
