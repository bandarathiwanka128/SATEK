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
import type { Deal, Product } from "@/types/database";

interface DealFormProps {
  initialData?: Deal;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export default function DealForm({ initialData, onSubmit }: DealFormProps) {
  const supabase = createClient();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [productId, setProductId] = useState(initialData?.product_id || "");
  const [discountPercentage, setDiscountPercentage] = useState(
    initialData?.discount_percentage?.toString() || ""
  );
  const [couponCode, setCouponCode] = useState(initialData?.coupon_code || "");
  const [startDate, setStartDate] = useState(
    initialData?.start_date
      ? initialData.start_date.slice(0, 10)
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialData?.end_date
      ? initialData.end_date.slice(0, 10)
      : ""
  );
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, title")
        .order("title");
      if (data) setProducts(data as Product[]);
    }
    fetchProducts();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title,
      description: description || null,
      product_id: productId || null,
      discount_percentage: parseInt(discountPercentage) || 0,
      coupon_code: couponCode || null,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deal title"
            required
          />
        </div>

        {/* Product */}
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Discount Percentage */}
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="1"
            max="100"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            placeholder="25"
            required
          />
        </div>

        {/* Coupon Code */}
        <div className="space-y-2">
          <Label htmlFor="coupon_code">Coupon Code</Label>
          <Input
            id="coupon_code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="SAVE25"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
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
          placeholder="Deal description..."
          rows={3}
        />
      </div>

      {/* Active Switch */}
      <div className="flex items-center gap-3">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-[#65E923]"
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#65E923] hover:bg-[#65E923]/90 text-black font-semibold"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Deal"
          : "Create Deal"}
      </Button>
    </motion.form>
  );
}
