import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Products: [
    { href: "/gadgets", label: "Gadgets" },
    { href: "/software", label: "Software" },
    { href: "/deals", label: "Deals" },
  ],
  Company: [
    { href: "/about", label: "About SATEK" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Categories: [
    { href: "/gadgets/smartphones", label: "Smartphones" },
    { href: "/gadgets/laptops", label: "Laptops" },
    { href: "/software/ai-tools", label: "AI Tools" },
    { href: "/software/development", label: "Dev Tools" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-satek">SAT</span>
                <span className="text-foreground">EK</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Smart Accessories Tools Electronics Knowledge. Your trusted source
              for tech reviews and recommendations.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-satek transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SATEK. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Affiliate Disclosure: Some links may earn us a commission at no extra
            cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
