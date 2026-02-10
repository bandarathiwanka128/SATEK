"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, X, ExternalLink, Check, Minus } from "lucide-react";
import Image from "next/image";
import { useComparison } from "@/hooks/use-comparison";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/products/rating-stars";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";

export default function ComparePage() {
  const { comparisonIds, removeFromComparison, clearComparison } = useComparison();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProducts() {
      if (comparisonIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
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
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [comparisonIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-satek mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading comparison...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GitCompare className="h-8 w-8 text-satek" />
              <h1 className="text-3xl md:text-4xl font-bold">Product Comparison</h1>
            </div>
            <p className="text-muted-foreground">
              {products.length === 0
                ? "No products to compare"
                : `Comparing ${products.length} product${products.length > 1 ? "s" : ""}`}
            </p>
          </div>
          {products.length > 0 && (
            <Button variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
          )}
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-muted rounded-full p-6 mb-6">
              <GitCompare className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No products to compare</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Add products to comparison by clicking the compare button on any product
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-satek text-black hover:bg-satek/90 h-10 px-6 py-2"
            >
              Browse Products
            </a>
          </motion.div>
        )}

        {/* Comparison Table */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <div className="min-w-[800px]">
              {/* Product Images and Names */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                <div></div>
                {products.map((product) => (
                  <div key={product.id} className="relative bg-card border border-border rounded-lg p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeFromComparison(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="aspect-square relative mb-3 rounded-md overflow-hidden bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    <a
                      href={`/products/${product.slug}`}
                      className="text-xs text-satek hover:underline"
                    >
                      View Details
                    </a>
                  </div>
                ))}
              </div>

              {/* Price */}
              <ComparisonRow
                label="Price"
                values={products.map((p) => formatPrice(p.price))}
                highlight
              />

              {/* Rating */}
              <ComparisonRow
                label="Rating"
                values={products.map((p) => (
                  <RatingStars key={p.id} rating={p.rating} size="sm" />
                ))}
              />

              {/* Affiliate Source */}
              <ComparisonRow
                label="Source"
                values={products.map((p) => p.affiliate_source || "—")}
              />

              {/* Description */}
              <ComparisonRow
                label="Description"
                values={products.map((p) => p.description)}
                multiline
              />

              {/* Pros */}
              <ComparisonRow
                label="Pros"
                values={products.map((p) =>
                  p.pros && p.pros.length > 0 ? (
                    <ul key={p.id} className="space-y-1">
                      {p.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )
                )}
                multiline
              />

              {/* Cons */}
              <ComparisonRow
                label="Cons"
                values={products.map((p) =>
                  p.cons && p.cons.length > 0 ? (
                    <ul key={p.id} className="space-y-1">
                      {p.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Minus className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "—"
                  )
                )}
                multiline
              />

              {/* Buy Now Buttons */}
              <div className="grid gap-4 mt-6" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                <div className="flex items-center font-semibold text-sm">Action</div>
                {products.map((product) => (
                  <div key={product.id}>
                    <a
                      href={product.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <Button className="w-full bg-satek text-black hover:bg-satek/90 font-semibold">
                        Buy Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface ComparisonRowProps {
  label: string;
  values: (string | React.ReactNode)[];
  highlight?: boolean;
  multiline?: boolean;
}

function ComparisonRow({ label, values, highlight, multiline }: ComparisonRowProps) {
  return (
    <div
      className={`grid gap-4 py-4 border-b border-border ${
        highlight ? "bg-satek/5" : ""
      }`}
      style={{ gridTemplateColumns: `200px repeat(${values.length}, 1fr)` }}
    >
      <div className="flex items-center font-semibold text-sm">{label}</div>
      {values.map((value, index) => (
        <div
          key={index}
          className={`flex items-center ${multiline ? "items-start py-2" : ""} text-sm`}
        >
          {typeof value === "string" ? (
            <span className={multiline ? "line-clamp-4" : ""}>{value}</span>
          ) : (
            value
          )}
        </div>
      ))}
    </div>
  );
}
