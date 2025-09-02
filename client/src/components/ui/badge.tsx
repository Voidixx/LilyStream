
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        verified:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        music:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        government:
          "border-transparent bg-green-600 text-white hover:bg-green-700",
        business:
          "border-transparent bg-orange-500 text-white hover:bg-orange-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

// Verification Badge Component
export interface VerificationBadgeProps {
  verificationType: "none" | "verified" | "music" | "government" | "business";
  className?: string;
}

export function VerificationBadge({ verificationType, className }: VerificationBadgeProps) {
  if (verificationType === "none") return null;

  const getBadgeConfig = () => {
    switch (verificationType) {
      case "verified":
        return { variant: "verified" as const, text: "✓ Verified" };
      case "music":
        return { variant: "music" as const, text: "♪ Music" };
      case "government":
        return { variant: "government" as const, text: "🏛️ Official" };
      case "business":
        return { variant: "business" as const, text: "🏢 Business" };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  return (
    <Badge variant={config.variant} className={cn("text-xs", className)}>
      {config.text}
    </Badge>
  );
}
