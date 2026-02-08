"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Cpu,
  Shield,
  Users,
  Target,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Honest Reviews",
    description:
      "We provide unbiased, thorough reviews based on real-world testing. No paid endorsements, ever.",
  },
  {
    icon: Target,
    title: "Curated Selection",
    description:
      "We hand-pick only the best products and software, saving you time and money on research.",
  },
  {
    icon: Zap,
    title: "Best Deals",
    description:
      "We track prices and hunt for exclusive coupon codes so you always get the best value.",
  },
  {
    icon: Globe,
    title: "Community First",
    description:
      "Built for tech enthusiasts by tech enthusiasts. Your feedback shapes what we cover.",
  },
];

const team = [
  {
    name: "SATEK Team",
    role: "Founders & Reviewers",
    description:
      "A passionate group of tech enthusiasts dedicated to helping you make informed decisions about gadgets and software.",
  },
];

export function AboutClient() {
  return (
    <div className="container py-12 space-y-20">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-satek/10 mb-6"
          >
            <Cpu className="h-10 w-10 text-satek" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-satek">SAT</span>EK
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            SATEK stands for{" "}
            <span className="text-foreground font-semibold">
              Smart Affordable Tech for EveryKind
            </span>
            . We believe everyone deserves access to quality technology
            recommendations without the noise and bias of traditional tech media.
          </p>
        </div>
      </ScrollReveal>

      {/* Mission */}
      <ScrollReveal>
        <Card className="border-satek/20 bg-gradient-to-br from-satek/5 to-transparent">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              To simplify tech choices by providing honest reviews, expert
              comparisons, and the best deals on gadgets and software — helping
              you find the perfect tech without overspending.
            </p>
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Values */}
      <div>
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center mb-10">What We Stand For</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, i) => (
            <ScrollReveal key={value.title} delay={i * 0.1}>
              <Card className="h-full border-border/50 hover:border-satek/30 transition-all">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-satek/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-satek" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Stats */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <AnimatedCounter end={500} suffix="+" label="Products Reviewed" />
          <AnimatedCounter end={50000} suffix="+" label="Users" />
          <AnimatedCounter end={100} suffix="+" label="Expert Reviews" />
          <AnimatedCounter end={200} suffix="+" label="Active Deals" />
        </div>
      </ScrollReveal>

      {/* Team */}
      <div>
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center mb-10">The Team</h2>
        </ScrollReveal>
        <div className="max-w-lg mx-auto">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.1}>
              <Card className="border-border/50 hover:border-satek/30 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-satek/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-satek" />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-satek mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-muted-foreground mb-6">
            Check out our latest reviews and deals.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/gadgets">
              <Button className="bg-satek hover:bg-satek/90 text-black font-semibold">
                Browse Gadgets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline">View Deals</Button>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
