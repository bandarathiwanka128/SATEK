"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";
import type { Deal } from "@/types/database";

export function DealsBanner() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentDeal, setCurrentDeal] = useState(0);

  useEffect(() => {
    const fetchDeals = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("deals")
        .select("*")
        .eq("is_active", true)
        .gte("end_date", new Date().toISOString())
        .order("discount_percentage", { ascending: false })
        .limit(5);
      setDeals(data || []);
    };
    fetchDeals();
  }, []);

  useEffect(() => {
    if (deals.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % deals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [deals.length]);

  if (deals.length === 0) return null;

  return (
    <section className="py-4 bg-satek/10 border-y border-satek/20">
      <div className="container">
        <div className="flex items-center justify-center gap-4">
          <Zap className="h-5 w-5 text-satek flex-shrink-0" />
          <div className="overflow-hidden h-6 flex-1 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDeal}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2 text-sm"
              >
                <span className="font-semibold text-satek">
                  {deals[currentDeal].discount_percentage}% OFF
                </span>
                <span className="text-muted-foreground">
                  {deals[currentDeal].title}
                </span>
                {deals[currentDeal].coupon_code && (
                  <code className="px-2 py-0.5 bg-satek/20 rounded text-xs font-mono">
                    {deals[currentDeal].coupon_code}
                  </code>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <Link href="/deals">
            <Button variant="ghost" size="sm" className="text-satek flex-shrink-0">
              View All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
