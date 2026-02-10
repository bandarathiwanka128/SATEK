"use client";

import { GitCompare, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparison } from "@/hooks/use-comparison";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  productId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export default function CompareButton({
  productId,
  variant = "outline",
  size = "sm",
  className,
  showText = true,
}: CompareButtonProps) {
  const { isInComparison, addToComparison, removeFromComparison } = useComparison();
  const inComparison = isInComparison(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inComparison) {
      removeFromComparison(productId);
    } else {
      addToComparison(productId);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 transition-colors",
        inComparison && "border-satek bg-satek/10 text-satek hover:bg-satek/20",
        className
      )}
      title={inComparison ? "Remove from comparison" : "Add to comparison"}
    >
      {inComparison ? (
        <Check className="h-4 w-4" />
      ) : (
        <GitCompare className="h-4 w-4" />
      )}
      {showText && (inComparison ? "Added" : "Compare")}
    </Button>
  );
}
