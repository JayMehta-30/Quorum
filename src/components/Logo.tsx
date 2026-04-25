"use client";
import { forwardRef } from "react";
import { Film } from "lucide-react";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ size = "md", className = "", ...rest }, ref) => {
    const dims = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
    const text = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
    return (
      <div ref={ref} className={`flex items-center gap-2.5 ${className}`} {...rest}>
        <div
          className={`${dims} rounded-2xl bg-gradient-primary grid place-items-center shadow-glow transition-spring hover:scale-105 hover:rotate-3`}
        >
          <Film className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className={`${text} font-semibold tracking-tight`}>
          Cine<span className="text-gradient-primary">Vote</span>
        </span>
      </div>
    );
  }
);
Logo.displayName = "Logo";
