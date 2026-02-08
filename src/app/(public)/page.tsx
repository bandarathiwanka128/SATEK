"use client";

import { HeroSection } from "@/components/home/hero-section";
import { DealsBanner } from "@/components/home/deals-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryBoxes } from "@/components/home/category-boxes";
import { LatestBlog } from "@/components/home/latest-blog";
import { BrandMeaning } from "@/components/home/brand-meaning";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DealsBanner />
      <FeaturedProducts />
      <CategoryBoxes />

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <AnimatedCounter end={500} suffix="+" label="Products Reviewed" />
              <AnimatedCounter end={50000} suffix="+" label="Users" />
              <AnimatedCounter end={100} suffix="+" label="Expert Reviews" />
              <AnimatedCounter end={200} suffix="+" label="Active Deals" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <LatestBlog />
      <BrandMeaning />
    </>
  );
}
