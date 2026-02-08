import type { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SATEK team. We'd love to hear from you!",
};

export default function ContactPage() {
  return <ContactClient />;
}
