import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DealsClient } from "./deals-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deals",
  description: "Exclusive tech deals, discounts, and coupon codes curated by SATEK",
};

export default async function DealsPage() {
  const supabase = createServerSupabaseClient();

  const { data: deals } = await supabase
    .from("deals")
    .select("*, products(title, slug, image_url, price)")
    .eq("is_active", true)
    .gte("end_date", new Date().toISOString())
    .order("discount_percentage", { ascending: false });

  return <DealsClient deals={deals || []} />;
}
