"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DealForm from "@/components/admin/deal-form";
import { useToast } from "@/hooks/use-toast";

export default function NewDealPage() {
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast({ title: "Success", description: "Deal created successfully." });
      router.push("/admin/deals");
    } else {
      const body = await res.json();
      toast({
        title: "Error",
        description: body.error?.toString() || "Failed to create deal.",
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
      <div className="flex items-center gap-4">
        <Link href="/admin/deals">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Deal</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <DealForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
