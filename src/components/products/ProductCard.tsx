"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden group cursor-pointer border-border/50 hover:border-satek/30 transition-colors h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-satek text-black">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-satek transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-satek">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm">{product.rating}</span>
            </div>
          </div>
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full animate-pulse-glow" size="sm">
              Check Price
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
}
