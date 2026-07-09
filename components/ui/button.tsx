"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-secondary text-primary hover:bg-secondary-dark shadow-lg shadow-secondary/20":
              variant === "primary",
            "bg-surface-light text-text hover:bg-surface-light/80": variant === "secondary",
            "border-2 border-secondary/30 text-secondary hover:bg-secondary/10":
              variant === "outline",
            "text-text-muted hover:text-text hover:bg-surface-light/50": variant === "ghost",
            "bg-accent text-white hover:bg-accent-dark": variant === "danger",
          },
          {
            "h-10 px-4 text-sm": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-13 px-8 text-base": size === "lg",
          },
          loading && "relative text-transparent",
          className
        )}
        {...props}
      >
        {children}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, type ButtonProps };
