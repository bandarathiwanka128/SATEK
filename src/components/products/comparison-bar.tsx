"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useComparison } from "@/hooks/use-comparison";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/database";

export default function ComparisonBar() {
  const { comparisonIds, removeFromComparison, clearComparison, maxItems } =
    useComparison();
  const [products, setProducts] = useState<Product[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadProducts() {
      if (comparisonIds.length === 0) {
        setProducts([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, image_url, slug")
          .in("id", comparisonIds)
          .eq("is_published", true);

        if (error) throw error;

        // Sort products by comparison order
        const sortedProducts = comparisonIds
          .map((id) => data?.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error loading comparison products:", error);
      }
    }

    loadProducts();
  }, [comparisonIds]);

  return (
    <AnimatePresence>
      {comparisonIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Title and Count */}
              <div className="flex items-center gap-3">
                <GitCompare className="h-5 w-5 text-satek" />
                <div>
                  <h3 className="font-semibold text-sm">Product Comparison</h3>
                  <p className="text-xs text-muted-foreground">
                    {comparisonIds.length} of {maxItems} products
                  </p>
                </div>
              </div>

              {/* Middle: Product Thumbnails */}
              <div className="flex-1 flex items-center gap-2 overflow-x-auto max-w-xl">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex-shrink-0 group"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted border border-border">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {/* Placeholder slots */}
                {Array.from({ length: maxItems - comparisonIds.length }).map(
                  (_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className="w-16 h-16 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center flex-shrink-0"
                    >
                      <span className="text-xs text-muted-foreground">+</span>
                    </div>
                  )
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearComparison}
                >
                  Clear All
                </Button>
                <Link href="/compare">
                  <Button
                    size="sm"
                    className="bg-satek text-black hover:bg-satek/90 font-semibold"
                  >
                    Compare Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
