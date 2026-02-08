import type { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about SATEK - your trusted source for tech reviews, gadgets, and software recommendations",
};

export default function AboutPage() {
  return <AboutClient />;
}
