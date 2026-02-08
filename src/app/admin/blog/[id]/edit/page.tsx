"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogForm from "@/components/admin/blog-form";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@/types/database";

export default function EditBlogPostPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const postId = params.id as string;

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error || !data) {
        toast({
          title: "Error",
          description: "Blog post not found.",
          variant: "destructive",
        });
        router.push("/admin/blog");
        return;
      }
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [postId, supabase, router, toast]);

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch(`/api/blog/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast({ title: "Success", description: "Blog post updated successfully." });
      router.push("/admin/blog");
    } else {
      const body = await res.json();
      toast({
        title: "Error",
        description: body.error?.toString() || "Failed to update post.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Loading post...
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
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          {post && <BlogForm initialData={post} onSubmit={handleSubmit} />}
        </CardContent>
      </Card>
    </motion.div>
  );
}
