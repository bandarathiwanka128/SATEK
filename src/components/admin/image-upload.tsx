"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value?: string | string[]; // Single URL or array of URLs for gallery
  onChange: (url: string | string[]) => void;
  label?: string;
  multiple?: boolean; // For gallery support
  maxFiles?: number; // Max number of files for gallery
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  multiple = false,
  maxFiles = 5,
  className,
}: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize value to array for consistent handling
  const images = multiple
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : value
    ? [value as string]
    : [];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File too large. Maximum size is 5MB.";
    }
    return null;
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Upload failed",
        description: error,
        variant: "destructive",
      });
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      return data.data.url;
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    // Check if we've reached max files for gallery
    if (multiple && images.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(uploadFile);
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url): url is string => url !== null);

      if (validUrls.length === 0) {
        toast({
          title: "Upload failed",
          description: "No files were uploaded successfully",
          variant: "destructive",
        });
        return;
      }

      if (multiple) {
        onChange([...images, ...validUrls]);
      } else {
        onChange(validUrls[0]);
      }

      toast({
        title: "Upload successful",
        description: `${validUrls.length} image${validUrls.length > 1 ? "s" : ""} uploaded successfully`,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [images, multiple, maxFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages.length > 0 ? newImages : []);
    } else {
      onChange("");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label>{label}</Label>}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          dragActive
            ? "border-[#65E923] bg-[#65E923]/5"
            : "border-gray-300 hover:border-gray-400",
          uploading && "opacity-50 pointer-events-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div
          onClick={openFileDialog}
          className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-[#65E923] animate-spin mb-3" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold text-[#65E923]">Click to upload</span> or
                drag and drop
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP, or GIF (max 5MB)
              </p>
              {multiple && (
                <p className="text-xs text-gray-500 mt-1">
                  Up to {maxFiles} images
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Recommended: 800x800px
              </p>
            </>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-4",
            multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"
          )}
        >
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              <Image
                src={imageUrl}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              {multiple && (
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State for Gallery */}
      {multiple && images.length === 0 && (
        <div className="flex items-center justify-center py-8 text-gray-400">
          <ImageIcon className="h-8 w-8 mr-2" />
          <span className="text-sm">No images uploaded yet</span>
        </div>
      )}
    </div>
  );
}
