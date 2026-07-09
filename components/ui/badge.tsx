import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "sale" | "new" | "stock" | "category";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "category", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        {
          "bg-accent text-white": variant === "sale",
          "bg-success text-white": variant === "new",
          "bg-surface-light text-success": variant === "stock",
          "bg-secondary/15 text-secondary": variant === "category",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
