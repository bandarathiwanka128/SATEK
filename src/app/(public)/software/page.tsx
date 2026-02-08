import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";

export const metadata: Metadata = {
  title: "Software",
  description:
    "Find the best software tools and apps. AI tools, developer utilities, design software, security, productivity, and cloud services.",
  openGraph: {
    title: "Software | SATEK",
    description:
      "Find the best software tools and apps. AI tools, developer utilities, design software, security, productivity, and cloud services.",
  },
};

export default async function SoftwarePage() {
  const supabase = createServerSupabaseClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories!inner(type)")
      .eq("is_published", true)
      .eq("categories.type", "software")
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("type", "software")
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-satek">Software</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore curated software tools and apps with in-depth reviews. From
            AI-powered solutions to developer tools, security, and productivity
            suites.
          </p>
        </div>

        <CategoryFilter
          categories={categories || []}
          baseHref="/software"
        />

        <ProductGrid products={products || []} />
      </div>
    </section>
  );
}
