"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const letters = [
  { letter: "S", meaning: "Smart", description: "Intelligent recommendations powered by expert analysis" },
  { letter: "A", meaning: "Accessories", description: "Top-rated accessories for every device and need" },
  { letter: "T", meaning: "Tools", description: "Essential tools and software for productivity" },
  { letter: "E", meaning: "Electronics", description: "Cutting-edge electronics reviewed and compared" },
  { letter: "K", meaning: "Knowledge", description: "In-depth knowledge to make informed decisions" },
];

export function BrandMeaning() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What is <span className="text-satek">SATEK</span>?
            </h2>
            <p className="text-muted-foreground">
              Every letter stands for our commitment to excellence
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {letters.map((item, i) => (
            <ScrollReveal key={item.letter} delay={i * 0.15}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
                  className="inline-block text-5xl font-bold text-satek mb-2"
                >
                  {item.letter}
                </motion.span>
                <h3 className="font-semibold text-lg mb-2">{item.meaning}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
