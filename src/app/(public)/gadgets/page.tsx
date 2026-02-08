import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";

export const metadata: Metadata = {
  title: "Gadgets",
  description:
    "Explore the best tech gadgets hand-picked by our experts. Smartphones, laptops, wearables, audio gear, cameras, and more.",
  openGraph: {
    title: "Gadgets | SATEK",
    description:
      "Explore the best tech gadgets hand-picked by our experts. Smartphones, laptops, wearables, audio gear, cameras, and more.",
  },
};

export default async function GadgetsPage() {
  const supabase = createServerSupabaseClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories!inner(type)")
      .eq("is_published", true)
      .eq("categories.type", "gadgets")
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("type", "gadgets")
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-satek">Gadgets</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover top-rated tech gadgets with expert reviews, detailed specs,
            and the best deals across smartphones, laptops, wearables, and more.
          </p>
        </div>

        <CategoryFilter
          categories={categories || []}
          baseHref="/gadgets"
        />

        <ProductGrid products={products || []} />
      </div>
    </section>
  );
}
