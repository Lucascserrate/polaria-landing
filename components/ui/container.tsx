import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Ancho máximo y padding lateral consistentes en toda la página. */
export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "narrow" && "max-w-3xl",
        width === "default" && "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
