# Walton Plaza Frontend Evaluation

Assessment of the implementation against `walton_frontend_evaluation.pdf`, cross-checked with `waltonplaza-api-reference.docx`, the current source code, `README.md`, and `guideline.md`.

**Assessment date:** 27 August 2026  
**Project:** `product-detail-app`  
**Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Apollo Client, Walton Plaza GraphQL API

## Executive summary

The project fulfills the core architecture, API integration, product listing, product detail, cart, responsive UI, loading-state, and React 19 requirements. The implementation is intentionally honest about limitations caused by the documented/live API:

- The API does not expose a dedicated category field, so the listing uses the available `Brand` product attribute as the category-like filter.
- The API does not expose rating data, so rating sorting is not fabricated.
- The listing has availability and brand/category-like filtering, but it does not currently have a numeric price-range filter.
- The product card is navigational; the add-to-cart CTA is implemented on the product detail page rather than directly inside each card.
- GraphQL response/domain models are manually typed; GraphQL Code Generator is not configured.

These limitations are documented trade-offs rather than hidden behavior.

## Status legend

- **Implemented:** The criterion is demonstrably present in the code.
- **Partially implemented:** The main behavior exists, but a literal requirement or API limitation prevents full compliance.
- **Not available from API:** The requested feature cannot be implemented correctly with the documented/tested API data without fabricating information or changing the backend contract.

## Section 1 — Architecture and setup

### 1. Next.js App Router and TypeScript strict mode — Implemented

Evidence:

- Routes are organized under `src/app`.
- The listing route is `src/app/page.tsx`.
- The detail route is `src/app/products/[uid]/page.tsx`.
- `tsconfig.json` contains `"strict": true` and `"noEmit": true`.
- `package.json` uses Next.js 16, React 19, and TypeScript.

How it fulfills the criterion:

- The App Router provides file-based routing, server components, dynamic product routes, and route-level loading UI.
- Strict TypeScript checks API models, component props, reducer actions, and utility functions at compile time.

### 2. Scalable folder structure — Implemented

Evidence:

- `src/app` contains routes and route loading states.
- `src/components` contains reusable visual and interactive components.
- `src/lib` contains API access, GraphQL queries, types, pagination rules, and cart state.

How it fulfills the criterion:

- Route concerns, UI concerns, domain/data concerns, and client state are separated.
- The `@/*` TypeScript path alias maps to `src/*`, keeping imports stable as the project grows.

### 3. GraphQL client with caching — Implemented

Evidence:

- `src/lib/apollo.ts` creates an Apollo Client with `HttpLink` and `InMemoryCache`.
- `src/lib/data.ts` uses `fetchPolicy: "cache-first"` for listing and detail reads.

How it fulfills the criterion:

- Apollo sends the required POST request to the Walton GraphQL endpoint.
- The in-memory cache avoids unnecessary duplicate reads during the active runtime.
- The API endpoint is configurable while retaining a documented default.

### 4. Typed GraphQL queries — Implemented with a documented limitation

Evidence:

- `src/lib/queries.ts` defines typed query documents for product listing and product details.
- `src/lib/types.ts` defines `Product`, `Variant`, `Discount`, `ProductAttribute`, and `ProductsResponse` models.
- `PRODUCT_FIELDS` is shared by list and detail queries to prevent field duplication.

How it fulfills the criterion:

- The application query results and domain objects are checked against explicit TypeScript models.
- The query requests only fields used by the UI.

Limitation:

- GraphQL Code Generator is not installed, so the types are maintained manually rather than generated directly from the schema.
- Generated schema types would be a future improvement to reduce contract drift.

### 5. Environment-based API configuration — Implemented

Evidence:

```ts
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL
  ?? "https://devapi.waltonplaza.com.bd/graphql";
```

How it fulfills the criterion:

- Local, staging, or deployment environments can provide `NEXT_PUBLIC_GRAPHQL_URL`.
- The fallback keeps the assignment runnable without an environment file.
- The variable is public because the current catalogue endpoint does not use a private secret.

## Section 2 — Product listing page

### 6. Fetch products through GraphQL — Implemented

Request flow:

```text
src/app/page.tsx
  -> getProducts(skip, limit)
    -> PRODUCTS_QUERY
      -> Apollo HttpLink
        -> POST /graphql
          -> getProducts(...)
```

Evidence:

- `src/lib/data.ts` calls Apollo with `PRODUCTS_QUERY`.
- `src/lib/queries.ts` requests `getProducts` and reads `message`, `statusCode`, `result.count`, and `result.products`.
- The listing requests active products with `isActive: true`.

The adapter validates both transport/query data and Walton's application-level `statusCode === 200`. Failed responses use the API `message` where available and show a safe fallback for network failures.

### 7. Pagination or infinite scroll — Implemented with numbered pagination

Evidence:

- The API supports offset pagination through `skip` and `limit`.
- `src/lib/pagination.ts` defines a default page size of 12 and allowed sizes of 12, 20, and 30.
- `src/app/page.tsx` calculates `(page - 1) * limit`.
- `src/components/Pagination.tsx` provides previous, next, numbered links, active-page state, and ellipses.
- Page state is represented in the URL, for example `/?page=3&limit=20`.

Why pagination was selected:

- It directly matches the API contract.
- It keeps the initial response small.
- It provides shareable, bookmarkable, and back/forward-friendly URLs.
- It is more predictable and accessible than an unbounded scroll request.

The API was tested to return a maximum of 30 products per request, so the UI caps the page size at 30.

### 8. Loading skeleton and error handling — Implemented

Evidence:

- `src/app/loading.tsx` renders `ProductListingSkeleton` during listing route transitions.
- `src/app/products/[uid]/loading.tsx` renders the product detail skeleton.
- `src/components/LoadingSkeleton.tsx` contains listing and detail skeleton layouts.
- `src/lib/data.ts` catches request failures and validates response status.
- `src/app/page.tsx` renders an error panel when the data adapter returns an error.
- The detail route renders its error state when a product is missing or the API fails.

How to verify:

- Navigate between pagination pages or change the records-per-page selector.
- Open a product from the listing and return to the listing.
- Use browser network throttling to make route transitions visible.
- Temporarily point `NEXT_PUBLIC_GRAPHQL_URL` at an unavailable endpoint to see the error state.

The skeleton is route-transition UI, not an artificial delay. On a fast local response it may be visible only briefly.

### 9. Price, category, and availability filters — Partially implemented because of API constraints

Implemented behavior:

- Availability filter: `ProductGrid` checks whether any product variant has `quantity > 0`.
- Category-like filter: the UI derives options from product attributes whose label is `Brand`.
- Product name and exact UID search are also available.

Missing or constrained behavior:

- There is no numeric price-range filter currently; price is displayed and sortable but not filterable by minimum/maximum values.
- The documented and tested API does not expose a dedicated category field. The brand attribute is the closest available defensible filter and is labeled as such in the UI.
- These client-side filters operate on the currently fetched API page, not the entire catalogue.

Correct evaluation wording: availability and a brand/category-like filter are implemented; a true price filter and backend-wide category filtering require additional UI/API support.

### 10. Sorting by price and rating — Partially implemented / rating unavailable from API

Implemented behavior:

- `ProductGrid` supports price low-to-high and high-to-low sorting using the first variant's MRP.
- The default `Featured` option preserves the API page order.

Rating limitation:

- No rating field is present in `waltonplaza-api-reference.docx` or the tested live responses.
- Rating sorting is therefore not implemented; fabricating a rating would be incorrect.
- Backend/schema confirmation or a rating field is required before adding rating sorting.

Additional limitation:

- Current sorting is client-side over the fetched page. Catalogue-wide sorting would require server-side sort variables or a complete indexed data source.

## Section 3 — Product card

### 11. Reusable product card, optimized images, hover interaction, and optimistic cart behavior — Partially implemented

Implemented in `src/components/ProductCard.tsx`:

- Reusable typed `ProductCard` component.
- `next/image` with responsive `sizes`.
- Walton CDN is allowlisted in `next.config.ts`.
- Missing-image fallback is rendered when `images` is empty.
- Image scale, card lift, border, and shadow hover effects provide micro-interaction.
- Selling price, original MRP, discount badge, and stock state are displayed.
- The card links to `/products/[uid]`.

Optimistic cart behavior:

- The shared cart uses React 19 `useOptimistic` in `src/lib/cart.tsx`.
- The PDP's add-to-cart CTA invokes the optimistic cart action.

Literal gap:

- The current product card itself has no separate add-to-cart button; it is a navigational card.
- If the evaluator requires card-level optimistic add-to-cart literally, a future refinement should add a stock-aware card CTA that prevents link navigation and calls the shared cart action.

## Section 4 — Product details page

### 12. Dynamic routing — Implemented

Evidence:

- `src/app/products/[uid]/page.tsx` is a dynamic App Router route.
- Product links use `/products/${product.uid}`.
- The route passes the UID to `getProduct(uid)` and renders a not-found/error state when no product is returned.

### 13. Image gallery, variant selection, stock-aware CTA, and dynamic pricing — Implemented

Image gallery:

- Product image URLs are filtered for valid values.
- The first image is shown as the main image.
- Products with multiple images receive selectable thumbnails.
- Empty image arrays show a placeholder.

Variant selection:

- `ProductDetails` tracks the selected variant and updates the displayed price, discount, quantity, and CTA state.
- The API does not provide customer-facing variant labels, so the UI shows `Variant N` and the available POS code/SKU.

Stock-aware CTA:

- Quantity zero displays `Out of stock` and disables `Add to cart`.
- Cart updates are capped at the selected variant's available quantity.

Dynamic pricing:

- Percentage discounts use the live API's observed percentage value.
- Flat discounts subtract the flat amount.
- Null discounts fall back to MRP with no strikethrough or discount badge.
- The selected variant's price and discount badge update before adding to the cart.

Information sections:

- Product attributes, detailed descriptions, deliveries, service/deliveries, and price/stocks are mapped into the corresponding tabs.
- Empty sections are hidden from the tab bar.
- Empty content renders `No information available.`
- API HTML is sanitized and rendered through `RichText` rather than exposing raw tags or unsafe markup.

## Section 5 — State management

### 14. Cart add, remove, and update operations — Implemented

Evidence in `src/lib/cart.tsx` and `src/components/CartDrawer.tsx`:

- `add` adds a product/variant line or increments an existing identical line.
- `remove` removes a line.
- `update` changes quantity and removes the line if quantity reaches zero.
- `clear` resets the cart.
- Variant-aware keys use product UID plus POS code, EBS code, or a fallback key, preventing different variants from being merged accidentally.
- Quantity is capped by the variant's API stock.

The cart drawer also provides quantity controls, subtotal calculation, empty state, Escape/backdrop close behavior, and a clear-cart action.

### 15. Cart persistence — Implemented

Persistence approach:

- Cart state is managed by a reducer behind React Context.
- Valid cart items are restored from versioned localStorage key `walton-cart:v1`.
- The legacy `walton-cart` key is read for migration compatibility.
- Invalid stored records are discarded defensively.
- Persistence starts only after hydration completes, preventing the initial empty server/client state from overwriting a saved cart.
- Clear-cart removes both current and legacy storage keys.

Production caveat: localStorage is appropriate for this assignment's client cart, but prices and stock must be revalidated server-side before checkout in a real commerce flow.

## Section 6 — Performance optimization

### 16. Memoization strategy — Partially implemented

Evidence:

- `ProductGrid` uses `useMemo` to derive the available brand options.
- `ProductGrid` uses `useMemo` to derive filtered and sorted products.
- The dependency arrays limit recomputation to changes in products or control values.

Other performance decisions:

- Server components handle initial catalogue/detail data fetching.
- Client components are limited to interactive controls and state.
- `next/image` and responsive `sizes` reduce image payload cost.
- GraphQL queries request only the fields used by the UI and use a shared fragment.

Limitation:

- `ProductCard` is not currently wrapped in `React.memo`, and handlers are not systematically stabilized with `useCallback`.
- The current memoization targets the expensive derived collection work. Additional memoization should be added only after profiling demonstrates a meaningful rerender cost.

### 17. Appropriate server/client component decisions — Implemented

Server-side responsibilities:

- `src/app/page.tsx` fetches the listing and renders the initial page.
- `src/app/products/[uid]/page.tsx` fetches the product detail.
- Route loading files provide transition skeletons.

Client-side responsibilities:

- `ProductGrid` owns interactive search, filters, and sorting.
- `ProductDetails` owns gallery, tabs, variant selection, and add-to-cart interaction.
- `Header`, `CartDrawer`, and `CartProvider` own cart UI/state and browser storage.
- `PageSizeSelect` owns client navigation for page-size changes.
- `RichText` owns safe browser-compatible rich-text sanitization.

This keeps browser JavaScript focused on interaction instead of making the complete application client-rendered.

### 18. GraphQL usage optimization — Implemented with documented trade-offs

- Listing and detail operations are separate, so the PDP does not request the whole catalogue.
- `PRODUCT_FIELDS` is shared to keep list/detail field selection consistent.
- Offset pagination limits each request to 12, 20, or 30 records.
- Apollo `cache-first` avoids duplicate reads when data is already cached.
- The data adapter checks the API-level status code and normalizes errors before passing data to UI components.

Trade-off:

- The current product page requests a rich product shape because the detail page needs gallery, attributes, descriptions, delivery, warranty, feature, and variant data. A production version could use a smaller listing fragment and a richer detail-only fragment if payload size becomes material.

## Section 7 — React 19

### 19. Modern React 19 feature — Implemented

Evidence:

- `src/lib/cart.tsx` uses React 19 `useOptimistic`.
- The add-to-cart update is wrapped in `startTransition` to avoid optimistic state updates outside an action/transition.

User-visible result:

- The cart count and cart contents respond immediately when a product is added.
- The reducer then commits the same action as the durable state update.

## API and edge-case compliance

The implementation also handles the API warnings from the reference document:

| API condition | Current behavior |
|---|---|
| `statusCode !== 200` | Error state using the API `message` when available |
| `discount === null` | MRP is used as selling price; no badge or strikethrough |
| Flat discount | Displays `Save ৳X`; subtracts `discount.amount` |
| Percentage discount | Displays percentage; calculates from the live response semantics |
| `images` empty | Placeholder image state |
| `quantity === 0` | Out-of-stock state and disabled CTA |
| Information array null/empty | Tab hidden or `No information available.` |
| HTML inside API values | Sanitized allowlisted rich-text rendering |
| Multiple variants | Variant selector with SKU, price, discount, and stock information |

## Verification checklist

Run from the project root:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
```

Manual review scenarios:

1. Open `/` and verify active products, filters, sorting, and product counts.
2. Change records per page between 12, 20, and 30.
3. Navigate with Previous, Next, numbered pages, and ellipses.
4. Search an exact UID such as `P-4TCF9V`; clear the field to restore the listing.
5. Open a product with multiple images, such as `P-AD86M9`, and test the gallery.
6. Open a product with multiple variants, such as `P-67YNHW`, and test variant-specific stock/price display.
7. Test a flat-discount product such as `P-6YSJTA` and verify `Save ৳X` presentation.
8. Add a product to the cart, change quantity, remove it, clear the cart, reload, and verify persistence.
9. Test empty information sections and API HTML content on the detail page.
10. Use network throttling to observe listing/detail skeletons during navigation.

## Final evaluation position

The project is strong on the core requested frontend architecture and commerce experience. Before submission, the highest-value optional improvements would be:

1. Add a true price-range filter.
2. Add a card-level add-to-cart CTA if the evaluator interprets that wording literally.
3. Confirm whether Walton can expose category and rating fields, then implement server-side filtering/sorting when available.
4. Add generated GraphQL types and automated unit/component tests.

The current implementation should be presented with these API limitations explicitly, because the code does not invent unsupported category, rating, or variant-label data.
