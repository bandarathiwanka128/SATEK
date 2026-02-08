"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  BarChart3,
  Code2,
  Shield,
  Brain,
  Palette,
  Cloud,
} from "lucide-react";

const categories = [
  { name: "Smartphones", slug: "smartphones", type: "gadgets", icon: Smartphone, color: "from-blue-500/20 to-blue-600/5" },
  { name: "Laptops", slug: "laptops", type: "gadgets", icon: Laptop, color: "from-purple-500/20 to-purple-600/5" },
  { name: "Audio", slug: "audio", type: "gadgets", icon: Headphones, color: "from-red-500/20 to-red-600/5" },
  { name: "Wearables", slug: "wearables", type: "gadgets", icon: Watch, color: "from-green-500/20 to-green-600/5" },
  { name: "Cameras", slug: "cameras", type: "gadgets", icon: Camera, color: "from-amber-500/20 to-amber-600/5" },
  { name: "Gaming", slug: "gaming", type: "gadgets", icon: Gamepad2, color: "from-cyan-500/20 to-cyan-600/5" },
  { name: "AI Tools", slug: "ai-tools", type: "software", icon: Brain, color: "from-pink-500/20 to-pink-600/5" },
  { name: "Dev Tools", slug: "development", type: "software", icon: Code2, color: "from-indigo-500/20 to-indigo-600/5" },
  { name: "Design", slug: "design", type: "software", icon: Palette, color: "from-rose-500/20 to-rose-600/5" },
  { name: "Security", slug: "security", type: "software", icon: Shield, color: "from-emerald-500/20 to-emerald-600/5" },
  { name: "Productivity", slug: "productivity", type: "software", icon: BarChart3, color: "from-orange-500/20 to-orange-600/5" },
  { name: "Cloud", slug: "cloud-storage", type: "software", icon: Cloud, color: "from-sky-500/20 to-sky-600/5" },
];

export function CategoryBoxes() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find exactly what you need across our curated categories
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 0.05}>
              <Link href={`/${cat.type}/${cat.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-6 rounded-xl border border-border/50 bg-gradient-to-br ${cat.color} backdrop-blur-sm cursor-pointer group text-center`}
                  style={{ perspective: "1000px" }}
                >
                  <cat.icon className="h-8 w-8 mx-auto mb-3 text-satek transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
