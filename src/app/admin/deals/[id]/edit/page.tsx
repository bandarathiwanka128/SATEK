"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DealForm from "@/components/admin/deal-form";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Deal } from "@/types/database";

export default function EditDealPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  const dealId = params.id as string;

  useEffect(() => {
    async function fetchDeal() {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .single();

      if (error || !data) {
        toast({
          title: "Error",
          description: "Deal not found.",
          variant: "destructive",
        });
        router.push("/admin/deals");
        return;
      }
      setDeal(data);
      setLoading(false);
    }
    fetchDeal();
  }, [dealId, supabase, router, toast]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/deals/${dealId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast({ title: "Success", description: "Deal updated successfully." });
      router.push("/admin/deals");
    } else {
      const body = await res.json();
      toast({
        title: "Error",
        description: body.error?.toString() || "Failed to update deal.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading deal...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link href="/admin/deals">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Deal</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          {deal && <DealForm initialData={deal} onSubmit={handleSubmit} />}
        </CardContent>
      </Card>
    </motion.div>
  );
}
