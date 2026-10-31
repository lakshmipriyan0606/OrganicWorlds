import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-160 ease-out active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-900 focus-visible:ring-offset-2 select-none";
    
    const variants = {
      primary: "bg-forest-900 hover:bg-forest-800 text-white border border-forest-900 hover:border-forest-800 shadow-xs",
      secondary: "bg-sage-100 hover:bg-[#dfe6db] text-forest-900 border border-transparent",
      outline: "bg-transparent hover:bg-ivory-100 text-charcoal-900 border border-border hover:border-forest-700",
      ghost: "bg-transparent hover:bg-ivory-100 text-charcoal-900",
      destructive: "bg-error text-white hover:bg-[#8e3832]",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 rounded-[4px] h-8",
      md: "text-[13px] px-6 py-3 rounded-[4px] h-11",
      lg: "text-sm px-8 py-3.5 rounded-[4px] h-13",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
