"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface ComparisonContextType {
  comparisonIds: string[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const COMPARISON_STORAGE_KEY = "satek_comparison";
const MAX_COMPARISON_ITEMS = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const { toast } = useToast();

  // Load comparison from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        setComparisonIds(Array.isArray(ids) ? ids : []);
      }
    } catch (error) {
      console.error("Error loading comparison from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever comparison changes
  const saveToLocalStorage = (ids: string[]) => {
    try {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const addToComparison = (productId: string) => {
    if (comparisonIds.includes(productId)) {
      toast({
        title: "Already in comparison",
        description: "This product is already in your comparison list",
      });
      return;
    }

    if (comparisonIds.length >= MAX_COMPARISON_ITEMS) {
      toast({
        title: "Comparison limit reached",
        description: `You can only compare up to ${MAX_COMPARISON_ITEMS} products at once`,
        variant: "destructive",
      });
      return;
    }

    const newComparisonIds = [...comparisonIds, productId];
    setComparisonIds(newComparisonIds);
    saveToLocalStorage(newComparisonIds);

    toast({
      title: "Added to comparison",
      description: `Product added to comparison (${newComparisonIds.length}/${MAX_COMPARISON_ITEMS})`,
    });
  };

  const removeFromComparison = (productId: string) => {
    const newComparisonIds = comparisonIds.filter((id) => id !== productId);
    setComparisonIds(newComparisonIds);
    saveToLocalStorage(newComparisonIds);

    toast({
      title: "Removed from comparison",
      description: "Product removed from comparison list",
    });
  };

  const isInComparison = (productId: string) => {
    return comparisonIds.includes(productId);
  };

  const clearComparison = () => {
    setComparisonIds([]);
    saveToLocalStorage([]);
    toast({
      title: "Comparison cleared",
      description: "All products removed from comparison",
    });
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonIds,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
        maxItems: MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
