"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ExternalLink,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types/database";

interface ProductDetailProps {
  product: Product;
  category?: Category | null;
}

export function ProductDetail({ product, category }: ProductDetailProps) {
  const gallery = (product.gallery as string[] | null) || [];
  const allImages = product.image_url
    ? [product.image_url, ...gallery]
    : gallery;
  const [activeImage, setActiveImage] = useState(0);

  const features = product.features as Record<string, string> | null;

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-4">
            {allImages.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={allImages[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg">
                No Image Available
              </div>
            )}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? allImages.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === allImages.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i
                      ? "border-satek"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {category && (
              <Badge variant="outline" className="border-satek/50 text-satek">
                {category.name}
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="bg-satek text-black">Featured</Badge>
            )}
            {product.affiliate_source && (
              <Badge variant="secondary">{product.affiliate_source}</Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} / 5
            </span>
          </div>

          <p className="text-2xl font-bold text-satek mb-6">
            {formatPrice(product.price)}
          </p>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8"
          >
            <Button size="lg" className="w-full sm:w-auto animate-pulse-glow">
              Buy Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>

          <Separator className="mb-6" />

          {/* Pros & Cons */}
          {((product.pros && product.pros.length > 0) ||
            (product.cons && product.cons.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {product.pros && product.pros.length > 0 && (
                <Card className="border-satek/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-satek mb-3 flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Pros
                    </h3>
                    <ul className="space-y-2">
                      {product.pros.map((pro, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-satek mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {product.cons && product.cons.length > 0 && (
                <Card className="border-destructive/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
                      <X className="h-5 w-5" />
                      Cons
                    </h3>
                    <ul className="space-y-2">
                      {product.cons.map((con, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Features Table */}
          {features && Object.keys(features).length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Specifications</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {Object.entries(features).map(([key, value], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.03 }}
                        className="flex justify-between px-4 py-3 text-sm"
                      >
                        <span className="text-muted-foreground font-medium">
                          {key}
                        </span>
                        <span>{value}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
