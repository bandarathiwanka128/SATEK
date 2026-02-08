"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  showNumeric?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function RatingStars({
  rating,
  showNumeric = true,
  size = "md",
  className,
}: RatingStarsProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.25 && clampedRating - fullStars < 0.75;
  const adjustedFull = clampedRating - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = 5 - adjustedFull - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: adjustedFull }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeMap[size], "fill-yellow-500 text-yellow-500")}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star
              className={cn(sizeMap[size], "text-yellow-500")}
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={cn(sizeMap[size], "fill-yellow-500 text-yellow-500")}
              />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizeMap[size], "text-muted-foreground/30")}
          />
        ))}
      </div>

      {showNumeric && (
        <span className="text-sm font-medium text-muted-foreground ml-0.5">
          {clampedRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
