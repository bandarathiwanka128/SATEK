"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { Product, Category } from "@/types/database";
import ImageUpload from "@/components/admin/image-upload";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const supabase = createClient();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliate_url || "");
  const [affiliateSource, setAffiliateSource] = useState(initialData?.affiliate_source || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(initialData?.gallery) ? initialData.gallery : []
  );
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [features, setFeatures] = useState(
    initialData?.features ? JSON.stringify(initialData.features, null, 2) : ""
  );
  const [pros, setPros] = useState(initialData?.pros?.join(", ") || "");
  const [cons, setCons] = useState(initialData?.cons?.join(", ") || "");
  const [rating, setRating] = useState(initialData?.rating?.toString() || "0");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    if (!initialData) {
      setSlug(slugify(title));
    }
  }, [title, initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let parsedFeatures = null;
    if (features.trim()) {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = null;
      }
    }

    const payload = {
      title,
      slug,
      description,
      price: parseFloat(price) || 0,
      affiliate_url: affiliateUrl,
      affiliate_source: affiliateSource || null,
      image_url: imageUrl || null,
      gallery: gallery.length > 0 ? gallery : null,
      category_id: categoryId || null,
      features: parsedFeatures,
      pros: pros
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      cons: cons
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rating: parseFloat(rating) || 0,
      is_published: isPublished,
      is_featured: isFeatured,
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
            placeholder="Product title"
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
            placeholder="product-slug"
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="29.99"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Affiliate URL */}
        <div className="space-y-2">
          <Label htmlFor="affiliate_url">Affiliate URL</Label>
          <Input
            id="affiliate_url"
            type="url"
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            placeholder="https://..."
            required
          />
        </div>

        {/* Affiliate Source */}
        <div className="space-y-2">
          <Label htmlFor="affiliate_source">Affiliate Source</Label>
          <Input
            id="affiliate_source"
            value={affiliateSource}
            onChange={(e) => setAffiliateSource(e.target.value)}
            placeholder="Amazon, eBay, etc."
          />
        </div>

        {/* Main Product Image */}
        <div className="space-y-2 md:col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setImageUrl(url as string)}
            label="Main Product Image"
          />
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description..."
          rows={4}
          required
        />
      </div>

      {/* Product Gallery */}
      <div className="space-y-2">
        <ImageUpload
          value={gallery}
          onChange={(urls) => setGallery(urls as string[])}
          label="Product Gallery (Additional Images)"
          multiple
          maxFiles={5}
        />
      </div>

      {/* Features JSON */}
      <div className="space-y-2">
        <Label htmlFor="features">Features (JSON)</Label>
        <Textarea
          id="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder='{"key": "value", ...}'
          rows={4}
          className="font-mono text-sm"
        />
      </div>

      {/* Pros */}
      <div className="space-y-2">
        <Label htmlFor="pros">Pros (comma separated)</Label>
        <Textarea
          id="pros"
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          placeholder="Great battery life, Fast processor, ..."
          rows={2}
        />
      </div>

      {/* Cons */}
      <div className="space-y-2">
        <Label htmlFor="cons">Cons (comma separated)</Label>
        <Textarea
          id="cons"
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          placeholder="Expensive, Heavy, ..."
          rows={2}
        />
      </div>

      {/* Switches */}
      <div className="flex flex-wrap gap-8">
        <div className="flex items-center gap-3">
          <Switch
            id="is_published"
            checked={isPublished}
            onCheckedChange={setIsPublished}
            className="data-[state=checked]:bg-[#65E923]"
          />
          <Label htmlFor="is_published">Published</Label>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="is_featured"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
            className="data-[state=checked]:bg-[#65E923]"
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#65E923] hover:bg-[#65E923]/90 text-black font-semibold"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Product"
          : "Create Product"}
      </Button>
    </motion.form>
  );
}
