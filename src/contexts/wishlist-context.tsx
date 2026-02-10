"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "satek_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUserId = session?.user?.id || null;

        if (event === "SIGNED_IN" && newUserId) {
          // User just signed in - sync localStorage to database
          await syncLocalStorageToDatabase(newUserId);
          setUserId(newUserId);
          await loadWishlistFromDatabase(newUserId);
        } else if (event === "SIGNED_OUT") {
          // User signed out - load from localStorage
          setUserId(null);
          loadWishlistFromLocalStorage();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadWishlist = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        await loadWishlistFromDatabase(user.id);
      } else {
        loadWishlistFromLocalStorage();
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
      loadWishlistFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        setWishlistIds(Array.isArray(ids) ? ids : []);
      } else {
        setWishlistIds([]);
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      setWishlistIds([]);
    }
  };

  const loadWishlistFromDatabase = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", uid);

      if (error) throw error;

      const ids = data.map((item) => item.product_id);
      setWishlistIds(ids);

      // Also sync to localStorage as backup
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Error loading wishlist from database:", error);
      loadWishlistFromLocalStorage();
    }
  };

  const syncLocalStorageToDatabase = async (uid: string) => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!stored) return;

      const localIds = JSON.parse(stored);
      if (!Array.isArray(localIds) || localIds.length === 0) return;

      // Insert local wishlist items to database
      const items = localIds.map((productId) => ({
        user_id: uid,
        product_id: productId,
      }));

      const { error } = await supabase
        .from("wishlists")
        .upsert(items, { onConflict: "user_id,product_id" });

      if (error) {
        console.error("Error syncing wishlist to database:", error);
      }
    } catch (error) {
      console.error("Error syncing localStorage to database:", error);
    }
  };

  const saveToLocalStorage = (ids: string[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (wishlistIds.includes(productId)) return;

    const newWishlistIds = [...wishlistIds, productId];
    setWishlistIds(newWishlistIds);
    saveToLocalStorage(newWishlistIds);

    if (userId) {
      try {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: userId, product_id: productId });

        if (error) throw error;
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        // Revert on error
        setWishlistIds(wishlistIds);
        saveToLocalStorage(wishlistIds);
        toast({
          title: "Error",
          description: "Failed to add to wishlist",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Added to wishlist",
      description: "Product added to your wishlist",
    });
  };

  const removeFromWishlist = async (productId: string) => {
    const newWishlistIds = wishlistIds.filter((id) => id !== productId);
    setWishlistIds(newWishlistIds);
    saveToLocalStorage(newWishlistIds);

    if (userId) {
      try {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);

        if (error) throw error;
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        // Revert on error
        setWishlistIds(wishlistIds);
        saveToLocalStorage(wishlistIds);
        toast({
          title: "Error",
          description: "Failed to remove from wishlist",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Removed from wishlist",
      description: "Product removed from your wishlist",
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
