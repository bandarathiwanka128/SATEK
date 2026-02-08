import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogContent } from "@/components/blog/blog-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on SATEK Blog`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const supabase = createServerSupabaseClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  const readTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {post.image_url && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.created_at)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readTime} min read
          </div>
        </div>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground italic mb-8 border-l-4 border-satek pl-4">
            {post.excerpt}
          </p>
        )}

        <BlogContent content={post.content} />

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
            Enjoyed this article? Check out more from our blog.
          </p>
          <Link href="/blog">
            <Button className="bg-satek hover:bg-satek/90 text-black font-semibold">
              More Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
