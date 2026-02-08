"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Deal } from "@/types/database";

export default function AdminDealsPage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  async function fetchDeals() {
    setLoading(true);
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setDeals(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Deal deleted successfully." });
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } else {
      const body = await res.json();
      toast({
        title: "Error",
        description: body.error || "Failed to delete deal.",
        variant: "destructive",
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Deals</h1>
        <Link href="/admin/deals/new">
          <Button className="bg-[#65E923] hover:bg-[#65E923]/90 text-black font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Deals ({deals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading deals...
            </div>
          ) : deals.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No deals found. Create your first deal.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-semibold">Title</th>
                    <th className="pb-3 pr-4 font-semibold">Discount</th>
                    <th className="pb-3 pr-4 font-semibold">Coupon</th>
                    <th className="pb-3 pr-4 font-semibold">Dates</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, idx) => {
                    const isExpired = new Date(deal.end_date) < new Date();
                    return (
                      <motion.tr
                        key={deal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-3 pr-4 font-medium">{deal.title}</td>
                        <td className="py-3 pr-4">
                          <Badge className="bg-satek/10 text-satek">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          {deal.coupon_code ? (
                            <code className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
                              {deal.coupon_code}
                            </code>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">
                          {formatDate(deal.start_date)} - {formatDate(deal.end_date)}
                        </td>
                        <td className="py-3 pr-4">
                          {isExpired ? (
                            <Badge variant="outline" className="text-destructive">
                              Expired
                            </Badge>
                          ) : (
                            <Badge
                              variant={deal.is_active ? "default" : "outline"}
                              className={
                                deal.is_active
                                  ? "bg-[#65E923] text-black hover:bg-[#65E923]/80"
                                  : ""
                              }
                            >
                              {deal.is_active ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                router.push(`/admin/deals/${deal.id}/edit`)
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(deal.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
