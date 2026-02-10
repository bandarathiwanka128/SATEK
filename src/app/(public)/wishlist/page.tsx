"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/database";

export default function WishlistPage() {
  const { wishlistIds, loading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProducts() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", wishlistIds)
          .eq("is_published", true);

        if (error) throw error;

        // Sort products by wishlist order
        const sortedProducts = wishlistIds
          .map((id) => data?.find((p) => p.id === id))
          .filter((p): p is Product => p !== undefined);

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Error loading wishlist products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!wishlistLoading) {
      loadProducts();
    }
  }, [wishlistIds, wishlistLoading]);

  if (loading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-satek mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading wishlist...</p>
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
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-satek fill-satek" />
            <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            {products.length === 0
              ? "Your wishlist is empty"
              : `${products.length} item${products.length > 1 ? "s" : ""} saved`}
          </p>
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-muted rounded-full p-6 mb-6">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start adding products to your wishlist by clicking the heart icon on
              any product
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-satek text-black hover:bg-satek/90 h-10 px-6 py-2"
            >
              Browse Products
            </a>
          </motion.div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
