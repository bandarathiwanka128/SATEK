-- Create wishlists table for logged-in users
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- Enable Row Level Security
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own wishlist items
CREATE POLICY "Users can view their own wishlist items"
  ON wishlists
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can add items to their own wishlist
CREATE POLICY "Users can add items to their own wishlist"
  ON wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove items from their own wishlist
CREATE POLICY "Users can remove items from their own wishlist"
  ON wishlists
  FOR DELETE
  USING (auth.uid() = user_id);
