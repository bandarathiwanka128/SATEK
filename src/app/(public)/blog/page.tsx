import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogListClient } from "./blog-list-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tech insights, reviews, and guides from the SATEK team",
};

export default async function BlogPage() {
  const supabase = createServerSupabaseClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const allTags = Array.from(
    new Set((posts || []).flatMap((p) => p.tags || []))
  );

  return <BlogListClient posts={posts || []} allTags={allTags} />;
}
