# SATEK Platform - Testing Guide

This guide helps you test all the newly implemented features systematically.

## Prerequisites

### 1. Database Setup

Execute these SQL scripts in your Supabase SQL Editor:

```sql
-- 1. Admin User Setup
-- File: docs/admin-setup.sql
-- This ensures your admin user has the correct role

-- 2. Wishlist Table
-- File: supabase/migrations/20260210000001_create_wishlists.sql
-- This creates the wishlists table for logged-in users
```

### 2. Start Development Server

```bash
npm run dev
```

Your app should be running at `http://localhost:3001`

## Test Plan

### Phase 1: Admin Authentication

**Goal:** Verify admin can access admin panel

1. Navigate to `http://localhost:3001/login`
2. Log in with:
   - Email: `bandarathiwanka8@gmail.com`
   - Password: `1aA#22##`
3. ✅ Should redirect to homepage
4. ✅ Should see "Admin Panel" link in navbar
5. Click "Admin Panel"
6. ✅ Should access admin dashboard without errors

**Troubleshooting:**
- If admin panel link doesn't appear, execute `docs/admin-setup.sql`
- Check Supabase dashboard → Authentication → Users
- Verify profile exists with `role = 'admin'`

---

### Phase 2: Image Upload & Product Creation

**Goal:** Create a product with images using file upload

1. Navigate to Admin Panel → Products
2. Click "Add Product" button
3. ✅ Should see enhanced product form

**Test Main Image Upload:**

4. Find "Main Product Image" section
5. ✅ Should see upload dropzone with instructions
6. **Test Drag & Drop:**
   - Drag an image file over dropzone
   - ✅ Dropzone should highlight green
   - Drop the file
   - ✅ Should see upload progress spinner
   - ✅ Should see image preview after upload
7. **Test Click to Upload:**
   - Click the dropzone
   - ✅ File browser should open
   - Select an image (JPEG, PNG, WebP, or GIF)
   - ✅ Should upload and show preview
8. **Test Remove Image:**
   - Hover over uploaded image
   - ✅ Should see "Remove" button
   - Click "Remove"
   - ✅ Image should be deleted

**Test Gallery Upload:**

9. Scroll to "Product Gallery" section
10. ✅ Should see multi-image upload area
11. Upload 3 different images using drag-and-drop or click
12. ✅ Should see all 3 images in grid with numbers (1, 2, 3)
13. ✅ Each image should have a remove button on hover
14. Try uploading 3 more images (total would be 6)
15. ✅ Should show error: "Maximum 5 images allowed"

**Test File Validation:**

16. Try uploading a file larger than 5MB
17. ✅ Should show error: "File too large"
18. Try uploading a non-image file (e.g., .pdf)
19. ✅ Should show error: "Invalid file type"

**Complete Product Creation:**

20. Fill out all required fields:
    - Title: "Test Product 1"
    - Price: "99.99"
    - Affiliate URL: "https://example.com/product"
    - Description: "This is a test product"
    - Category: Select any
    - Rating: "4.5"
21. Set "Published" to ON
22. Click "Create Product"
23. ✅ Should redirect to products list
24. ✅ Should see success toast notification
25. ✅ Should see new product in list with thumbnail

---

### Phase 3: Enhanced Admin Product List

**Goal:** Test search, filters, and improved UI

1. Navigate to Admin Panel → Products
2. ✅ Should see product list with image thumbnails

**Test Search:**

3. Type "Test" in search box
4. ✅ Should filter to show only matching products
5. Clear search
6. ✅ Should show all products again
7. Type a category name
8. ✅ Should filter by category

**Test View Button:**

9. Find the "Eye" icon button on any product
10. Click it
11. ✅ Should open product page in new tab
12. ✅ Product page should display correctly

**Test Edit:**

13. Click "Pencil" icon on a product
14. ✅ Should navigate to edit page
15. ✅ Should see existing images loaded
16. Change the title
17. Upload a new gallery image
18. Click "Update Product"
19. ✅ Should see updated product in list

**Test Delete Confirmation:**

20. Click "Trash" icon on any product
21. ✅ Should open confirmation dialog
22. ✅ Dialog should show product name
23. Click "Cancel"
24. ✅ Dialog should close, product not deleted
25. Click "Trash" icon again
26. Click "Delete" in dialog
27. ✅ Product should be removed from list
28. ✅ Should see success toast

---

### Phase 4: Wishlist Feature (Guest User)

**Goal:** Test wishlist for non-logged-in users

**Prerequisites:**
- Make sure wishlist buttons are integrated into product cards (see `docs/INTEGRATION_GUIDE.md`)
- If not integrated yet, you can still test by visiting `/wishlist` directly after running the test script below

**Manual Testing (if buttons not integrated):**

1. Open browser console
2. Run this script to add products to wishlist:
```javascript
// Add to localStorage
const productIds = ['product-id-1', 'product-id-2']; // Use actual product IDs
localStorage.setItem('satek_wishlist', JSON.stringify(productIds));
location.reload();
```

**Test Wishlist Page:**

3. Navigate to `http://localhost:3001/wishlist`
4. ✅ Should see products you added
5. ✅ Should see "Buy Now" buttons
6. ✅ Should see heart icon filled
7. Click "Buy Now" on a product
8. ✅ Should open affiliate link in new tab

**Test Persistence:**

9. Close browser completely
10. Reopen browser
11. Navigate to `/wishlist`
12. ✅ Products should still be there (localStorage)

**Test Remove from Wishlist:**

13. If buttons integrated: Click filled heart icon on any product
14. ✅ Product should be removed from wishlist
15. ✅ Should see toast notification

---

### Phase 5: Wishlist Feature (Logged-in User)

**Goal:** Test database sync for authenticated users

**Prerequisites:**
- Execute `supabase/migrations/20260210000001_create_wishlists.sql`

1. **Log out** if currently logged in
2. Add 2 products to wishlist as guest (using localStorage)
3. Navigate to `/wishlist`
4. ✅ Should see 2 products

**Test Login Sync:**

5. Log in with any user account
6. Wait 2 seconds
7. Navigate to `/wishlist`
8. ✅ Should still see the 2 products (synced to database)

**Test Database Persistence:**

9. Add 1 more product to wishlist
10. Log out
11. Close browser completely
12. Reopen browser
13. Log in again
14. Navigate to `/wishlist`
15. ✅ Should see all 3 products (loaded from database)

**Verify in Supabase:**

16. Open Supabase Dashboard
17. Go to Table Editor → wishlists
18. ✅ Should see entries with your user_id
19. ✅ Should see 3 product_id entries

---

### Phase 6: Product Comparison (Client-side)

**Goal:** Test product comparison feature

**Prerequisites:**
- Compare buttons integrated into product cards (see `docs/INTEGRATION_GUIDE.md`)
- If not integrated, use manual test below

**Manual Testing (if buttons not integrated):**

1. Open browser console
2. Run this script:
```javascript
// Add to localStorage
const productIds = ['product-id-1', 'product-id-2', 'product-id-3']; // Use actual IDs
localStorage.setItem('satek_comparison', JSON.stringify(productIds));
location.reload();
```

**Test Floating Comparison Bar:**

3. After adding products to comparison
4. ✅ Should see floating bar at bottom of screen
5. ✅ Should show "3 of 4 products"
6. ✅ Should show product thumbnails
7. ✅ Should show "Compare Now" button

**Test Comparison Bar Actions:**

8. Hover over a product thumbnail in the bar
9. ✅ Should see "X" button appear
10. Click "X" on one product
11. ✅ Product removed, bar shows "2 of 4 products"
12. ✅ Should see toast notification
13. Click "Clear All"
14. ✅ All products removed, bar disappears

**Test Maximum Limit:**

15. Add 4 products to comparison
16. ✅ Bar shows "4 of 4 products"
17. Try to add a 5th product
18. ✅ Should see error toast: "Comparison limit reached"

**Test Comparison Page:**

19. Add 3 products to comparison
20. Click "Compare Now" in floating bar
21. ✅ Should navigate to `/compare`
22. ✅ Should see comparison table with:
    - Product images at top
    - Price row (highlighted)
    - Rating with stars
    - Source
    - Description
    - Pros with checkmarks
    - Cons with minus signs
    - "Buy Now" buttons at bottom

**Test Comparison Actions:**

23. Click "X" on a product in the table
24. ✅ Product should be removed
25. ✅ Table should reflow with remaining products
26. Navigate back to products
27. Add a different product
28. ✅ Floating bar should update
29. Return to `/compare`
30. ✅ Should see updated comparison

**Test Persistence:**

31. Close browser
32. Reopen browser
33. Navigate to `/compare`
34. ✅ Should see same products (localStorage)

**Test Empty State:**

35. Click "Clear All" on comparison page
36. ✅ Should see empty state with message
37. ✅ Should see "Browse Products" button
38. Click "Browse Products"
39. ✅ Should navigate to products page

---

### Phase 7: Responsive Design

**Goal:** Test mobile and tablet views

**Desktop (1920px):**
1. Resize browser to full width
2. ✅ Admin table should show all columns
3. ✅ Comparison shows 4 products side-by-side
4. ✅ Wishlist shows 4 columns

**Tablet (768px):**
5. Resize browser to 768px
6. ✅ Admin table should be scrollable
7. ✅ Comparison table should be scrollable
8. ✅ Wishlist shows 3 columns
9. ✅ Floating comparison bar should be readable

**Mobile (375px):**
10. Resize browser to 375px
11. ✅ All pages should be usable
12. ✅ Image upload dropzone should work
13. ✅ Wishlist shows 1-2 columns
14. ✅ Floating bar compact but functional

---

## Performance Testing

### Upload Performance

1. Upload a 4.9MB image
2. ✅ Should complete in under 10 seconds
3. Try uploading 5 images simultaneously
4. ✅ Should all upload successfully

### Page Load Performance

1. Navigate to `/wishlist` with 20+ products
2. ✅ Should load in under 2 seconds
3. Navigate to `/compare` with 4 products
4. ✅ Should render immediately

### Search Performance

1. Add 50+ products to database
2. Type in search box
3. ✅ Should filter instantly (no lag)

---

## Browser Compatibility

Test in multiple browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

Each browser should:
- Upload images correctly
- Store localStorage properly
- Display animations smoothly
- Show toast notifications

---

## Security Testing

### Admin Access Control

1. Log out
2. Try to access `/admin/products` directly
3. ✅ Should redirect to login
4. Log in as regular user (not admin)
5. Try to access `/admin/products`
6. ✅ Should show access denied or redirect

### Upload Security

1. Try to upload via `/api/upload` without login
2. ✅ Should return 401 Unauthorized
3. Log in as regular user (not admin)
4. Try to upload via API
5. ✅ Should return 403 Forbidden

### RLS Policies

1. Open Supabase Dashboard
2. Check wishlists table RLS
3. ✅ Users should only see their own wishlist items
4. Try to query another user's wishlist via API
5. ✅ Should return empty or error

---

## Error Handling

Test error scenarios:

### Network Errors

1. Disable network (DevTools → Network → Offline)
2. Try to upload image
3. ✅ Should show error toast
4. Try to load wishlist
5. ✅ Should handle gracefully with error message

### Invalid Data

1. Try to create product with missing required fields
2. ✅ Should show validation error
3. Try to upload 10MB file
4. ✅ Should show size error before upload

### Database Errors

1. Temporarily remove wishlists table (or break connection)
2. Try to add to wishlist
3. ✅ Should fall back to localStorage
4. ✅ Should show error toast

---

## Accessibility Testing

### Keyboard Navigation

1. Use Tab key to navigate forms
2. ✅ All inputs should be reachable
3. ✅ Focus indicators should be visible
4. Press Enter on buttons
5. ✅ Should trigger actions

### Screen Reader

1. Use screen reader (NVDA/JAWS/VoiceOver)
2. ✅ Image upload areas should be announced
3. ✅ Buttons should have descriptive labels
4. ✅ Toast notifications should be announced

### Color Contrast

1. Check color contrast in DevTools
2. ✅ Text should meet WCAG AA standards
3. ✅ Buttons should be distinguishable

---

## Success Criteria

All features pass when:

- ✅ Admin can upload and manage product images
- ✅ Image gallery works with up to 5 images
- ✅ Search and filters work in admin panel
- ✅ Delete confirmation shows product name
- ✅ Wishlist works for both guest and logged-in users
- ✅ Wishlist syncs to database on login
- ✅ Comparison allows up to 4 products
- ✅ Floating comparison bar appears and functions
- ✅ Comparison page shows all product details
- ✅ All features work on mobile, tablet, desktop
- ✅ No console errors
- ✅ All toast notifications display correctly
- ✅ Data persists across sessions

---

## Reporting Issues

If you find bugs:

1. Check browser console for errors
2. Verify database migrations were executed
3. Check Supabase logs for API errors
4. Document steps to reproduce
5. Note browser and screen size
6. Check network tab for failed requests

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Integrate wishlist/compare buttons into product cards (see `INTEGRATION_GUIDE.md`)
2. ✅ Add navigation links to wishlist and compare pages
3. ✅ Customize styling to match your brand
4. ✅ Deploy to production
5. ✅ Monitor Supabase usage and storage

---

Happy Testing! 🎉
