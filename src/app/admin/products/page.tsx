"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/database";

type ProductWithCategory = Product & {
  categories: { name: string; slug: string; type: string } | null;
};

export default function AdminProductsPage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductWithCategory | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.categories?.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, slug, type)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProducts((data as ProductWithCategory[]) || []);
    }
    setLoading(false);
  }

  function openDeleteDialog(product: ProductWithCategory) {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!productToDelete) return;

    const res = await fetch(`/api/products/${productToDelete.id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Deleted", description: "Product deleted successfully." });
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } else {
      const body = await res.json();
      toast({
        title: "Error",
        description: body.error || "Failed to delete product.",
        variant: "destructive",
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="bg-[#65E923] hover:bg-[#65E923]/90 text-black font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products ({products.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No products found. Create your first product.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              No products match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-semibold">Image</th>
                    <th className="pb-3 pr-4 font-semibold">Title</th>
                    <th className="pb-3 pr-4 font-semibold">Price</th>
                    <th className="pb-3 pr-4 font-semibold">Category</th>
                    <th className="pb-3 pr-4 font-semibold">Published</th>
                    <th className="pb-3 pr-4 font-semibold">Featured</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3 pr-4">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.title}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-medium">{product.title}</td>
                      <td className="py-3 pr-4">{formatPrice(product.price)}</td>
                      <td className="py-3 pr-4">
                        {product.categories ? (
                          <Badge variant="secondary">
                            {product.categories.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={product.is_published ? "default" : "outline"}
                          className={
                            product.is_published
                              ? "bg-[#65E923] text-black hover:bg-[#65E923]/80"
                              : ""
                          }
                        >
                          {product.is_published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {product.is_featured ? (
                          <Badge className="bg-amber-500 hover:bg-amber-500/80 text-black">
                            Featured
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product.slug}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View product page"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/admin/products/${product.id}/edit`)
                            }
                            title="Edit product"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(product)}
                            className="text-destructive hover:text-destructive"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {productToDelete?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
