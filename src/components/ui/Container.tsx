import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "full";
}

export function Container({ className, size = "default", children, ...props }: ContainerProps) {
  const sizes = {
    default: "max-w-[1360px]",
    narrow: "max-w-[960px]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-5 md:px-8 lg:px-12",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  bg?: "default" | "ivory-100" | "sage-100" | "forest-900" | "white";
  spacing?: "default" | "compact" | "spacious" | "none";
}

export function Section({
  className,
  bg = "default",
  spacing = "default",
  children,
  ...props
}: SectionProps) {
  const backgrounds = {
    default: "bg-ivory-50 text-charcoal-900",
    "ivory-100": "bg-ivory-100 text-charcoal-900",
    "sage-100": "bg-sage-100 text-forest-900",
    "forest-900": "bg-forest-900 text-white",
    white: "bg-white text-charcoal-900",
  };

  const spacings = {
    default: "py-16 md:py-24",
    compact: "py-10 md:py-16",
    spacious: "py-20 md:py-32",
    none: "py-0",
  };

  return (
    <section className={cn(backgrounds[bg], spacings[spacing], className)} {...props}>
      {children}
    </section>
  );
}
