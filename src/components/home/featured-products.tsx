"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Star, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked tech products with expert reviews and the best deals
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))
            : products.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="overflow-hidden group cursor-pointer border-border/50 hover:border-satek/30 transition-colors">
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
                          <Badge className="absolute top-3 left-3">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-satek transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
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
                          className="mt-3 block"
                        >
                          <Button className="w-full group/btn animate-pulse-glow" size="sm">
                            Check Price
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No featured products yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
