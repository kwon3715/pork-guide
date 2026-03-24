import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900"
      : "bg-slate-900 text-white";

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles} ${className}`.trim()}
      {...props}
    />
  );
}
