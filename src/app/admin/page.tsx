"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  FileText,
  Tag,
  Mail,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface Stats {
  products: number;
  blogPosts: number;
  deals: number;
  messages: number;
  unreadMessages: number;
  users: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    blogPosts: 0,
    deals: 0,
    messages: 0,
    unreadMessages: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [products, posts, deals, messages, unread, users] =
        await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("deals").select("id", { count: "exact", head: true }),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
          supabase.from("profiles").select("id", { count: "exact", head: true }),
        ]);

      setStats({
        products: products.count || 0,
        blogPosts: posts.count || 0,
        deals: deals.count || 0,
        messages: messages.count || 0,
        unreadMessages: unread.count || 0,
        users: users.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, [supabase]);

  const statCards = [
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      href: "/admin/blog",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Deals",
      value: stats.deals,
      icon: Tag,
      href: "/admin/deals",
      color: "text-satek",
      bg: "bg-satek/10",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: Mail,
      href: "/admin/messages",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined,
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the SATEK admin panel
          </p>
        </div>
        <TrendingUp className="h-8 w-8 text-satek" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Link href={card.href}>
              <Card className="hover:border-satek/30 transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {loading ? "..." : card.value}
                  </div>
                  {card.badge && (
                    <p className="text-xs text-amber-500 mt-1">{card.badge}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-muted-foreground group-hover:text-satek transition-colors">
                    View all
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/admin/products/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Package className="h-4 w-4" />
                New Product
              </Button>
            </Link>
            <Link href="/admin/blog/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                New Blog Post
              </Button>
            </Link>
            <Link href="/admin/deals/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Tag className="h-4 w-4" />
                New Deal
              </Button>
            </Link>
            <Link href="/admin/messages">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                View Messages
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
