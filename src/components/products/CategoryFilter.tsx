"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/database";

interface CategoryFilterProps {
  categories: Category[];
  baseHref: string;
  activeSlug?: string;
}

export function CategoryFilter({
  categories,
  baseHref,
  activeSlug,
}: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-2 mb-8"
    >
      <Link href={baseHref}>
        <Badge
          variant={!activeSlug ? "default" : "outline"}
          className={`cursor-pointer transition-all hover:scale-105 px-4 py-1.5 text-sm ${
            !activeSlug
              ? "bg-satek text-black hover:bg-satek/80"
              : "hover:border-satek/50 hover:text-satek"
          }`}
        >
          All
        </Badge>
      </Link>
      {categories.map((category, i) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
        >
          <Link href={`${baseHref}/${category.slug}`}>
            <Badge
              variant={activeSlug === category.slug ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 px-4 py-1.5 text-sm ${
                activeSlug === category.slug
                  ? "bg-satek text-black hover:bg-satek/80"
                  : "hover:border-satek/50 hover:text-satek"
              }`}
            >
              {category.name}
            </Badge>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
