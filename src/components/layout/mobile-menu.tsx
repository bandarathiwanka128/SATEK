"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, LogOut, LayoutDashboard } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  user: User | null;
  isAdmin: boolean;
  onSignOut: () => void;
}

export function MobileMenu({
  open,
  onClose,
  links,
  user,
  isAdmin,
  onSignOut,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-80 bg-background border-l border-border shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-xl font-bold">
                <span className="text-satek">SAT</span>EK
              </span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="font-medium">{link.label}</span>
                    {link.children && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Link>
                  {link.children && (
                    <div className="ml-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" onClick={onClose}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      onSignOut();
                      onClose();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={onClose}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={onClose}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
