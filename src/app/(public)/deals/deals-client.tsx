"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Tag, Clock, Copy, Check, ExternalLink } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import type { Deal, Product } from "@/types/database";

type DealWithProduct = Deal & {
  products: Pick<Product, "title" | "slug" | "image_url" | "price"> | null;
};

interface DealsClientProps {
  deals: DealWithProduct[];
}

export function DealsClient({ deals }: DealsClientProps) {
  return (
    <div className="container py-12">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-satek">Hot</span> Deals
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exclusive discounts and coupon codes on the best tech products
          </p>
        </div>
      </ScrollReveal>

      {deals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No active deals right now.</p>
          <p className="text-sm mt-2">Check back soon for new offers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, i) => (
            <ScrollReveal key={deal.id} delay={i * 0.1}>
              <DealCard deal={deal} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

function DealCard({ deal }: { deal: DealWithProduct }) {
  const [copied, setCopied] = useState(false);

  const daysLeft = Math.ceil(
    (new Date(deal.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  function handleCopy() {
    if (deal.coupon_code) {
      navigator.clipboard.writeText(deal.coupon_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="overflow-hidden border-border/50 hover:border-satek/30 transition-all h-full">
        <div className="relative h-40 bg-gradient-to-br from-satek/20 to-satek/5 flex items-center justify-center">
          {deal.products?.image_url ? (
            <img
              src={deal.products.image_url}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Tag className="h-12 w-12 text-satek/40" />
          )}
          <Badge className="absolute top-3 right-3 bg-satek text-black font-bold text-lg px-3 py-1">
            {deal.discount_percentage}% OFF
          </Badge>
        </div>
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-lg">{deal.title}</h3>
          {deal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {deal.description}
            </p>
          )}

          {deal.products && (
            <div className="text-sm">
              <span className="text-muted-foreground">Product: </span>
              <Link
                href={`/products/${deal.products.slug}`}
                className="text-satek hover:underline"
              >
                {deal.products.title}
              </Link>
              {deal.products.price > 0 && (
                <div className="mt-1">
                  <span className="line-through text-muted-foreground text-xs mr-2">
                    {formatPrice(deal.products.price)}
                  </span>
                  <span className="font-semibold text-satek">
                    {formatPrice(
                      deal.products.price * (1 - deal.discount_percentage / 100)
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {deal.coupon_code && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 w-full px-3 py-2 bg-satek/10 border border-satek/20 rounded-lg hover:bg-satek/20 transition-colors"
            >
              <code className="font-mono font-bold text-satek flex-1 text-left">
                {deal.coupon_code}
              </code>
              {copied ? (
                <Check className="h-4 w-4 text-satek" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {daysLeft > 0 ? `${daysLeft} days left` : "Ending soon"}
            </div>
            <span>Ends {formatDate(deal.end_date)}</span>
          </div>

          {deal.products?.slug && (
            <Link href={`/products/${deal.products.slug}`}>
              <Button className="w-full bg-satek hover:bg-satek/90 text-black font-semibold mt-2">
                View Product
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
