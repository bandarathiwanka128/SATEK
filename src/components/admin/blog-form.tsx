"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/types/database";

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export default function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setSlug(slugify(title));
    }
  }, [title, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      image_url: imageUrl || null,
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      is_published: isPublished,
    };

    try {
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog post title"
            required
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="blog-post-slug"
            required
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary of the post..."
          rows={2}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog post content here..."
          rows={12}
          required
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tech, gadgets, review, ..."
        />
      </div>

      {/* Published Switch */}
      <div className="flex items-center gap-3">
        <Switch
          id="is_published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
          className="data-[state=checked]:bg-[#65E923]"
        />
        <Label htmlFor="is_published">Published</Label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#65E923] hover:bg-[#65E923]/90 text-black font-semibold"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Post"
          : "Create Post"}
      </Button>
    </motion.form>
  );
}
