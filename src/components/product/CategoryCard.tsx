import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    itemCount: number;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-[3px] border border-border bg-white shadow-xs transition-all duration-300 hover:border-sand-300 hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-ivory-100">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white flex items-end justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-sage-100 font-semibold block mb-1">
            {category.itemCount} Offerings
          </span>
          <h3 className="font-display text-2xl font-medium tracking-wide">
            {category.name}
          </h3>
          <p className="text-xs text-ivory-100/80 line-clamp-1 mt-1 font-light">
            {category.description}
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-ivory-50/20 backdrop-blur-xs flex items-center justify-center text-white transition-all duration-200 group-hover:bg-white group-hover:text-forest-900 group-hover:scale-110 flex-shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
