export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          role: "admin" | "user";
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: "admin" | "user";
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "admin" | "user";
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: "gadgets" | "software";
          icon: string | null;
          description: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type: "gadgets" | "software";
          icon?: string | null;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          type?: "gadgets" | "software";
          icon?: string | null;
          description?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          features: Json | null;
          pros: string[] | null;
          cons: string[] | null;
          price: number;
          affiliate_url: string;
          affiliate_source: string | null;
          image_url: string | null;
          gallery: Json | null;
          rating: number;
          category_id: string | null;
          is_published: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          features?: Json | null;
          pros?: string[] | null;
          cons?: string[] | null;
          price: number;
          affiliate_url: string;
          affiliate_source?: string | null;
          image_url?: string | null;
          gallery?: Json | null;
          rating?: number;
          category_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          features?: Json | null;
          pros?: string[] | null;
          cons?: string[] | null;
          price?: number;
          affiliate_url?: string;
          affiliate_source?: string | null;
          image_url?: string | null;
          gallery?: Json | null;
          rating?: number;
          category_id?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          image_url: string | null;
          author_id: string | null;
          tags: string[] | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          image_url?: string | null;
          author_id?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          image_url?: string | null;
          author_id?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          product_id: string | null;
          discount_percentage: number;
          coupon_code: string | null;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          product_id?: string | null;
          discount_percentage: number;
          coupon_code?: string | null;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          product_id?: string | null;
          discount_percentage?: number;
          coupon_code?: string | null;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Deal = Database["public"]["Tables"]["deals"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
