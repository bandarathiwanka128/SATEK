# Integration Guide: Wishlist & Compare Buttons

This guide shows you how to integrate the wishlist and comparison buttons into your product displays.

## Quick Start

The wishlist and comparison features are fully functional, but the buttons need to be added to your product cards and detail pages for users to interact with them.

## 1. Add to Product Cards

Edit `src/components/products/product-card.tsx`:

### Option A: Overlay on Image (Recommended)

```tsx
import WishlistButton from "@/components/products/wishlist-button";
import CompareButton from "@/components/products/compare-button";

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <motion.div ...>
      <Card ...>
        {/* Image */}
        <div className="relative h-52 bg-muted overflow-hidden">
          {product.image_url ? (
            <Image ... />
          ) : (
            <div>No Image</div>
          )}

          {/* NEW: Action Buttons Overlay */}
          <div className="absolute top-3 right-3 flex gap-2">
            <WishlistButton productId={product.id} />
            <CompareButton
              productId={product.id}
              showText={false}
              size="icon"
            />
          </div>

          {product.is_featured && (
            <Badge ...>Featured</Badge>
          )}
        </div>

        {/* Rest of card content */}
        <CardContent ...>
          ...
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

### Option B: Below Product Info

```tsx
{/* In CardContent, after rating and before price */}
<div className="flex gap-2 mb-4">
  <WishlistButton
    productId={product.id}
    variant="outline"
    size="sm"
  />
  <CompareButton
    productId={product.id}
    variant="outline"
    size="sm"
  />
</div>

{/* Price + CTA */}
<div className="flex items-center justify-between gap-3">
  ...
</div>
```

## 2. Add to Product Detail Page

Find your product detail page (likely `src/app/(public)/products/[slug]/page.tsx`):

```tsx
import WishlistButton from "@/components/products/wishlist-button";
import CompareButton from "@/components/products/compare-button";

export default function ProductDetailPage({ params }) {
  // ... existing code

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          {/* ... image display */}
        </div>

        {/* Product Info */}
        <div>
          <h1>{product.title}</h1>
          <RatingStars rating={product.rating} />
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

          {/* NEW: Action Buttons */}
          <div className="flex gap-3 my-6">
            <WishlistButton
              productId={product.id}
              variant="default"
              size="default"
            />
            <CompareButton
              productId={product.id}
              variant="outline"
              size="default"
            />
          </div>

          {/* Buy Now Button */}
          <a href={product.affiliate_url} ...>
            <Button>Buy Now</Button>
          </a>

          {/* Rest of product details */}
        </div>
      </div>
    </div>
  );
}
```

## 3. Add Navigation Links (Optional)

Add links to the wishlist and compare pages in your navigation:

In `src/components/layout/navbar.tsx` (or wherever your nav is):

```tsx
import { Heart, GitCompare } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useComparison } from "@/hooks/use-comparison";

export default function Navbar() {
  const { wishlistIds } = useWishlist();
  const { comparisonIds } = useComparison();

  return (
    <nav>
      {/* ... existing nav items */}

      {/* Wishlist Link */}
      <Link href="/wishlist" className="flex items-center gap-2">
        <Heart className="h-5 w-5" />
        <span>Wishlist</span>
        {wishlistIds.length > 0 && (
          <Badge>{wishlistIds.length}</Badge>
        )}
      </Link>

      {/* Compare Link */}
      <Link href="/compare" className="flex items-center gap-2">
        <GitCompare className="h-5 w-5" />
        <span>Compare</span>
        {comparisonIds.length > 0 && (
          <Badge>{comparisonIds.length}</Badge>
        )}
      </Link>

      {/* ... existing nav items */}
    </nav>
  );
}
```

## Component Props Reference

### WishlistButton

```tsx
interface WishlistButtonProps {
  productId: string;           // Required
  variant?: "default" | "icon"; // Default: "icon"
  size?: "default" | "sm" | "lg" | "icon"; // Default: "icon"
  className?: string;
}
```

**Examples:**
```tsx
{/* Icon only (for overlays) */}
<WishlistButton productId={product.id} />

{/* Button with text */}
<WishlistButton
  productId={product.id}
  variant="default"
  size="default"
/>

{/* Small button with text */}
<WishlistButton
  productId={product.id}
  variant="outline"
  size="sm"
/>
```

### CompareButton

```tsx
interface CompareButtonProps {
  productId: string;           // Required
  variant?: "default" | "outline" | "ghost"; // Default: "outline"
  size?: "default" | "sm" | "lg" | "icon";   // Default: "sm"
  className?: string;
  showText?: boolean;          // Default: true
}
```

**Examples:**
```tsx
{/* Icon only (for overlays) */}
<CompareButton
  productId={product.id}
  showText={false}
  size="icon"
/>

{/* Button with text */}
<CompareButton
  productId={product.id}
  variant="outline"
/>

{/* Compact button */}
<CompareButton
  productId={product.id}
  variant="ghost"
  size="sm"
/>
```

## Styling Tips

### Match Your Brand Colors

Both buttons use the `satek` color for active states. To customize:

```tsx
{/* In your component or global CSS */}
<WishlistButton
  productId={product.id}
  className="hover:bg-your-brand-color/10"
/>

<CompareButton
  productId={product.id}
  className="border-your-brand-color text-your-brand-color"
/>
```

### Responsive Design

```tsx
{/* Hide text on mobile, show on desktop */}
<div className="flex gap-2">
  <WishlistButton
    productId={product.id}
    variant="icon"
    className="md:hidden"
  />
  <WishlistButton
    productId={product.id}
    variant="default"
    className="hidden md:flex"
  />
</div>
```

## Testing Your Integration

After adding the buttons:

1. **Browse Products:**
   - Click heart icon → Product added to wishlist
   - Click compare button → Product added to comparison

2. **Check Floating Bar:**
   - After adding products to compare, floating bar appears at bottom

3. **Visit Pages:**
   - Navigate to `/wishlist` → See saved products
   - Navigate to `/compare` → See comparison table

4. **Test Persistence:**
   - Close browser
   - Reopen
   - Verify wishlist and comparison persist

5. **Test Auth Sync:**
   - Add products to wishlist as guest
   - Log in
   - Verify wishlist syncs to database

## Common Issues

### Buttons Not Appearing
- Make sure you've imported the components correctly
- Check that `productId` is being passed as a string
- Verify providers are wrapped in layout.tsx

### Wishlist Not Syncing
- Execute the wishlist migration SQL
- Check user is authenticated
- Verify RLS policies in Supabase

### Comparison Bar Not Showing
- Add products to comparison first
- Check ComparisonBar is rendered in layout.tsx
- Look for console errors

## Need Help?

Check:
- `IMPLEMENTATION.md` for full feature documentation
- Component source code in `src/components/products/`
- Context implementations in `src/contexts/`

Happy coding! 🚀
