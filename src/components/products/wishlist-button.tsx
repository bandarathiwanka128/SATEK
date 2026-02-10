"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  variant?: "default" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function WishlistButton({
  productId,
  variant = "icon",
  size = "icon",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={handleClick}
        className={cn(
          "transition-colors hover:bg-white/10",
          inWishlist && "text-red-500 hover:text-red-600",
          className
        )}
        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn("h-5 w-5", inWishlist && "fill-current")}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2",
        inWishlist && "border-red-500 text-red-500 hover:bg-red-50",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
      {inWishlist ? "Saved" : "Save"}
    </Button>
  );
}
