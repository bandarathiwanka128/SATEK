import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";

interface SubcategoryPageProps {
  params: { subcategory: string };
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.subcategory)
    .eq("type", "software")
    .single();

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Software`,
    description:
      category.description ||
      `Discover the best ${category.name.toLowerCase()} software tools. Reviews, comparisons, and deals.`,
    openGraph: {
      title: `${category.name} Software | SATEK`,
      description:
        category.description ||
        `Discover the best ${category.name.toLowerCase()} software tools. Reviews, comparisons, and deals.`,
    },
  };
}

export default async function SoftwareSubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const supabase = createServerSupabaseClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.subcategory)
    .eq("type", "software")
    .single();

  if (!category) {
    notFound();
  }

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .eq("category_id", category.id)
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
            <span className="text-satek">{category.name}</span>
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          )}
          {!category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore the best {category.name.toLowerCase()} tools with expert
              reviews and top deals.
            </p>
          )}
        </div>

        <CategoryFilter
          categories={categories || []}
          baseHref="/software"
          activeSlug={params.subcategory}
        />

        <ProductGrid products={products || []} />
      </div>
    </section>
  );
}
