import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "sage" | "sand" | "forest" | "warning";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-sage-100 text-forest-900 border border-[#d6e0d0]",
    sage: "bg-sage-500 text-white",
    sand: "bg-sand-200 text-charcoal-900 border border-sand-300",
    forest: "bg-forest-900 text-white",
    warning: "bg-[#fef3c7] text-warning border border-[#fde68a]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-[2px]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
