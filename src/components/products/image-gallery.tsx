"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

interface ImageGalleryProps {
  mainImage: string | null;
  gallery: Json | null;
  alt: string;
  className?: string;
}

function parseGalleryImages(
  mainImage: string | null,
  gallery: Json | null
): string[] {
  const images: string[] = [];

  if (mainImage) {
    images.push(mainImage);
  }

  if (gallery && Array.isArray(gallery)) {
    for (const item of gallery) {
      if (typeof item === "string" && !images.includes(item)) {
        images.push(item);
      }
    }
  }

  return images;
}

export function ImageGallery({
  mainImage,
  gallery,
  alt,
  className,
}: ImageGalleryProps) {
  const images = parseGalleryImages(mainImage, gallery);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = images[selectedIndex] || null;

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-square rounded-xl bg-muted flex items-center justify-center",
          className
        )}
      >
        <span className="text-muted-foreground text-lg">No Image Available</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {currentImage && (
              <Image
                src={currentImage}
                alt={`${alt} - Image ${selectedIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={selectedIndex === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                index === selectedIndex
                  ? "border-satek ring-2 ring-satek/30"
                  : "border-border hover:border-satek/50"
              )}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
