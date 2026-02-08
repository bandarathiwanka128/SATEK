"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/products/rating-stars";
import { formatPrice, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      <Card className="overflow-hidden group cursor-pointer h-full flex flex-col border-border/50 hover:border-satek/30 hover:shadow-lg hover:shadow-satek/5 transition-all duration-300">
        {/* Image */}
        <div className="relative h-52 bg-muted overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-satek text-black font-semibold">
              Featured
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-5 flex flex-col flex-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg mb-1.5 group-hover:text-satek transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {truncate(product.description, 120)}
          </p>

          {/* Rating */}
          <div className="mb-4">
            <RatingStars rating={product.rating} size="sm" />
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-bold text-satek">
              {formatPrice(product.price)}
            </span>
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={(e) => e.stopPropagation()}
            >
              <Button size="sm" className="bg-satek text-black hover:bg-satek-500 font-semibold">
                Check Price
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
