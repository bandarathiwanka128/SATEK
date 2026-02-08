"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateButtonProps {
  url: string;
  source?: string | null;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-13 px-8 text-lg",
};

export function AffiliateButton({
  url,
  source,
  label = "Buy Now",
  size = "md",
  className,
}: AffiliateButtonProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
        "bg-satek text-black",
        "animate-pulse-glow",
        "transition-colors hover:bg-satek-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-satek focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        sizeClasses[size],
        className
      )}
    >
      {label}
      <ExternalLink className="h-4 w-4" />
      {source && (
        <span className="ml-1 text-xs opacity-70">
          on {source}
        </span>
      )}
    </motion.a>
  );
}
