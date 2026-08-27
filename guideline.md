# Walton Plaza Product Detail App — Interview and Evaluation Guide

This document is a code-level guide to the project. It is written so that, during an interview or evaluation walkthrough, you can explain the architecture, follow a user action through the code, map the API contract to the UI, and clearly distinguish implemented requirements from API limitations.

## 1. One-minute project explanation

This is a Walton Plaza product catalogue built with Next.js App Router, React 19, TypeScript strict mode, Tailwind CSS, and Apollo Client. The listing page is server-rendered and requests one offset-paginated slice of active products from the Walton GraphQL API. The product detail route is a dynamic server route keyed by the product UID. Interactive behavior—filters, image selection, tabs, variant selection, cart drawer, and local persistence—is isolated in client components.

The main design decision is to keep remote catalogue data in the server/data layer and keep only UI interaction and shopping-cart state on the client. The API provides `skip` and `limit`, so the app uses numbered pagination instead of loading the complete catalogue into the browser. Cart state is held in a React Context/reducer, given optimistic feedback with React 19 `useOptimistic`, and persisted in versioned `localStorage`.

The honest API trade-off is important: the documented API has no explicit category or rating fields. The category control therefore uses the available `Brand` product attribute, while rating sorting is not fabricated or displayed. The app also has a PDP add-to-cart action; the current `ProductCard` itself is a navigational card and does not include a separate card-level add button. Mention this clearly if asked about strict interpretation of that criterion.

## 2. Start here in the repository

The most useful files to open in an interview are:

| Area | File | What to show |
|---|---|---|
| Listing route | `src/app/page.tsx` | Server rendering, URL page-size parsing, API call, error state, composition |
| Detail route | `src/app/products/[uid]/page.tsx` | Dynamic routing and UID-based data fetch |
| GraphQL operations | `src/lib/queries.ts` | Typed query documents and reusable product fragment |
| API adapter | `src/lib/data.ts` | Apollo query execution, API `statusCode` validation, error normalization |
| Apollo setup | `src/lib/apollo.ts` | Endpoint configuration, `HttpLink`, `InMemoryCache`, request headers |
| Domain types/pricing | `src/lib/types.ts` | TypeScript models, price calculation, discount normalization |
| Product grid | `src/components/ProductGrid.tsx` | Client filters, derived categories, availability, sorting, `useMemo` |
| Product card | `src/components/ProductCard.tsx` | `next/image`, price display, discount, stock display, hover behavior |
| PDP interaction | `src/components/ProductDetails.tsx` | Gallery, variants, stock-aware CTA, tabs, sanitized information rendering |
| Cart state | `src/lib/cart.tsx` | Context, reducer, optimistic update, hydration, persistence, stock limits |
| Cart UI | `src/components/CartDrawer.tsx` | Quantity changes, remove, subtotal, clear, keyboard/backdrop close |
| Loading UI | `src/components/LoadingSkeleton.tsx` | Route-level listing and detail skeletons |
| Image security | `src/components/RichText.tsx` | DOMPurify allowlist before `dangerouslySetInnerHTML` |
| Image configuration | `next.config.ts` | Approved Walton CDN remote pattern |
| API test collection | `postman.json` | Documented POST requests, variables, and response tests |

## 3. Request and render flow

### Product listing flow

1. The browser opens `/` or a URL such as `/?page=2&limit=20`.
2. `src/app/page.tsx` receives `searchParams` as a Promise, normalizes the page and page size, and calculates the offset: `(page - 1) * limit`.
3. `getProducts(skip, limit)` in `src/lib/data.ts` executes `PRODUCTS_QUERY` using Apollo.
4. The query sends `isActive: true`, so the PLP requests active products only.
5. The adapter checks both the GraphQL result shape and Walton’s application-level `statusCode === 200`.
6. The server passes the returned page to `ProductGrid` and the total count to `Pagination`.
7. `ProductGrid` runs browser-side search, brand/category filtering, stock filtering, and price sorting over the current API page.
8. Pagination links change the URL. Next.js renders the new server page and the route-level loading skeleton is shown during navigation.

The important distinction is that pagination is server-side, while the current page’s filters and sorting are client-side. A future version could move filters/sorting into GraphQL variables if the API adds those fields.

### Product detail flow

1. A card links to `/products/{uid}`.
2. `src/app/products/[uid]/page.tsx` receives the dynamic `uid` parameter.
3. `getProduct(uid)` executes `PRODUCT_QUERY` with `skip: 0`, `limit: 1`, and `filter: { uid }`.
4. The server validates `statusCode`, `result`, and the first product.
5. `ProductDetails` becomes the client boundary for gallery, selected variant, active tab, and cart action.
6. The selected variant controls price, discount, quantity text, and whether the CTA is disabled.
7. The five API information arrays are mapped into a shared `InfoList` renderer.

### Add-to-cart flow

1. The PDP CTA calls `add(product, variant)` from `useCart()`.
2. `CartProvider` creates a compact `CartItem` snapshot containing UID, name, first image, selected variant, and quantity 1.
3. `keyOf()` identifies a line by product UID plus POS code, EBS code, or a default key.
4. `useOptimistic` immediately exposes the new cart state while `startTransition()` schedules the reducer update.
5. The reducer merges an existing identical line or adds a new line, capped at available stock.
6. The cart drawer reads the same context and calculates subtotal from the normalized selling price.
7. After hydration, cart items are serialized to `localStorage` under `walton-cart:v1`.

## 4. Architecture and framework decisions

### App Router and server/client boundaries

`src/app/page.tsx`, `src/app/layout.tsx`, and `src/app/products/[uid]/page.tsx` are server components by default. This is appropriate because their first responsibility is data fetching and HTML generation.

The interactive files explicitly use `"use client"`:

- `ProductGrid` needs input/select state and `useMemo`.
- `ProductDetails` needs selected image, selected variant, tab state, and cart access.
- `Header` needs cart count and drawer state.
- `CartDrawer` needs effects, event handlers, and cart operations.
- `CartProvider` needs browser storage, reducer state, and React 19 optimistic state.
- `PageSizeSelect` needs navigation hooks.
- `RichText` runs DOMPurify in a browser-compatible client boundary.

This keeps the client JavaScript focused on behavior instead of making the whole route interactive.

### Folder structure

`src/app` contains routes and route loading states. `src/components` contains reusable visual/interactive pieces. `src/lib` contains domain types, API operations, Apollo setup, pagination rules, and cart state. The `@/*` alias in `tsconfig.json` maps to `src/*`, so imports remain stable when files move.

### Environment configuration

`src/lib/apollo.ts` reads `NEXT_PUBLIC_GRAPHQL_URL` and falls back to the documented Walton endpoint:

```ts
const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL
  ?? "https://devapi.waltonplaza.com.bd/graphql";
```

For local setup, create `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://devapi.waltonplaza.com.bd/graphql
```

The variable is public because this is a browser-safe catalogue endpoint. If the API later requires secrets, those must stay server-only and the browser should call an internal Next.js route instead.

## 5. GraphQL API requirements mapped to code

### Contract from `waltonplaza-api-reference.docx`

| API requirement | Implementation |
|---|---|
| POST `https://devapi.waltonplaza.com.bd/graphql` | Apollo `HttpLink` in `src/lib/apollo.ts`; Postman uses `{{baseUrl}}/graphql` |
| `Content-Type: application/json` | Apollo/GraphQL transport and Postman request headers |
| Main operation `getProducts` | `PRODUCTS_QUERY` and `PRODUCT_QUERY` in `src/lib/queries.ts` |
| Offset pagination | `skip` and `limit` variables; page offset in `src/app/page.tsx` |
| Active products | `isActive: true` in `getProducts()` |
| UID detail lookup | `filter: { uid: $uid }` in `PRODUCT_QUERY` |
| `message`, `statusCode`, `result` | `ProductsResponse` and checks in `src/lib/data.ts` |
| Product title | `enName` displayed in card and PDP |
| Gallery | `images { url }`, `next/image`, thumbnail selection |
| Basic information | `productAttributes` → Basic information tab |
| Detailed information | `detailedDescriptions` → Detailed information tab |
| Terms and conditions | `deliveries` → Terms & conditions tab |
| Warranty | `serviceAndDeliveries` → Warranty tab |
| Special features | `priceAndStocks` → Special features tab |
| Variant identifiers and stock | `posItemCode`, `ebsItemCode`, `quantity` |
| Pricing | `mrpPrice` and `discount` → `sellingPrice()`/`discountPercent()` |

The shared `PRODUCT_FIELDS` fragment is a deliberate query-maintenance decision: listing and detail operations request the same known product shape without duplicating every field in two places.

### Response validation

The API has an application-level status in addition to the HTTP status. `data.ts` treats a response as successful only when:

- `getProducts` exists;
- `statusCode === 200`;
- `result` exists; and, for a detail request, a first product exists.

Otherwise the API’s `message` is returned for the UI error state. Network or Apollo exceptions are converted into the user-facing fallback `The product service is temporarily unavailable.`

### Pagination choice

The evaluation allows pagination or infinite scroll. Pagination is the better fit here because the API explicitly supports offset pagination. `src/lib/pagination.ts` defines 12 as the default and permits 12, 20, or 30. The maximum is capped at 30 because that matches the tested API behavior. `Pagination.tsx` keeps page navigation accessible and uses ellipses for large page ranges.

The URL is shareable and back/forward friendly:

- `/?page=3&limit=20` means page 3 with 20 records per API request.
- Changing page size resets to page 1.
- Pagination links preserve the selected `limit`.

### Pricing: document mismatch and live behavior

The DOCX describes `discount.value` as a final selling price, but the verified live response for `P-4TCF9V` returned:

- MRP: `51990`
- discount type: `PERCENTAGE`
- discount amount: `5199`
- discount value: `10`

The correct selling price is `46791`, and the badge is `10% OFF`. `src/lib/types.ts` therefore normalizes `discount.type` to lowercase and uses:

```ts
percentage: mrp - (mrp * discount.value) / 100
flat: mrp - discount.amount
no discount: mrp
```

This is a strong interview example: explain that implementation was based on observed live contract behavior rather than blindly trusting an inconsistent prose description. For a production system, the next step would be to formalize this with an API contract test and confirm the meaning with the backend owner.

### Null and empty data behavior

The API reference warns that these can be null or empty:

- `discount`: selling price falls back to MRP;
- `images`: the UI shows “No image available”/“No image”;
- `quantity === 0`: the buy button is disabled and out-of-stock text is shown;
- information arrays: empty tabs are hidden and empty content shows “No information available.”

The code uses optional chaining throughout the typed model and checks values before rendering. The live catalogue scan did not find every possible edge case, so these defensive branches are intentionally retained.

## 6. Evaluation criteria checklist

### Section 1 — Architecture and setup

1. **Next.js App Router and TypeScript strict mode — implemented.** Show `src/app`, `tsconfig.json` with `strict: true`, and `package.json`.
2. **Scalable folders — implemented.** Explain the route/component/lib split.
3. **GraphQL client with caching — implemented.** Show `InMemoryCache` and `fetchPolicy: "cache-first"`.
4. **Typed GraphQL queries — implemented at the application-model level.** Show `queries.ts` plus `ProductsResponse`/`Product` in `types.ts`. The repository does not currently use GraphQL Code Generator; types are maintained manually.
5. **Environment-based API configuration — implemented.** Show `NEXT_PUBLIC_GRAPHQL_URL` fallback in `apollo.ts`.

### Section 2 — Product listing page

6. **Fetch products via GraphQL — implemented.** `page.tsx` → `getProducts()` → `PRODUCTS_QUERY`.
7. **Pagination/infinite scroll — implemented with pagination.** Explain offset API support and URL-driven pages.
8. **Loading/error handling — implemented.** Route `loading.tsx` files provide skeletons; `data.ts` and page markup provide error states.
9. **Price/category/availability filters — partially constrained by API.** Price sorting is available. Availability derives from variant quantity. The category UI is an honest “brand” attribute filter because no category field is documented or observed.
10. **Price/rating sorting — price implemented; rating unavailable.** Low/high price sorting is in `ProductGrid`. No rating field exists in the documented/tested API, so rating is not invented. State this as an API limitation and a follow-up requirement for backend/schema confirmation.

### Section 3 — Product card

11. **Reusable card, optimized image, hover interaction — implemented.** `ProductCard` uses `next/image`, responsive `sizes`, remote image configuration, missing-image fallback, scale/translate/shadow hover effects, discount, price, and stock display.

**Important nuance:** the current card is a link to the PDP and does not expose its own add-to-cart button. Optimistic add-to-cart is implemented on the PDP CTA in `ProductDetails` through `CartProvider`. If the evaluator interprets “ProductCard optimistic add-to-cart” literally, this is a gap to address by adding a card button that stops link propagation and calls `add(product, product.variants?.[0])` when stock is available.

### Section 4 — Product details page

12. **Dynamic routing — implemented.** `src/app/products/[uid]/page.tsx`.
13. **Gallery, variant selection, stock CTA, dynamic pricing — implemented.** `ProductDetails.tsx` and `types.ts` are the primary evidence.

Variant labels currently use `posItemCode`, with an `Option N` fallback. The API exposes identifiers but no customer-facing per-variant label mapping, so this is a defensible display choice. The API has been observed to return products with multiple variants.

### Section 5 — State management

14. **Cart add/remove/update — implemented.** Reducer actions are `add`, `remove`, `update`, `clear`, and `hydrate`.
15. **Persistence — implemented.** Versioned key `walton-cart:v1`, legacy-key migration from `walton-cart`, validation during hydration, and delayed persistence after hydration prevent an empty initial render from overwriting stored data.

### Section 6 — Performance

16. **Memoization — partially implemented.** `ProductGrid` uses `useMemo` for category derivation and visible/sorted results. The code does not currently use `React.memo` for `ProductCard`, nor `useCallback` for handlers. Explain that the chosen memoization targets the expensive derived array work; if profiling shows card rerenders are costly, `React.memo` and stable callbacks are the next refinement.
17. **Server/client decisions — implemented.** Data routes stay server-side; interaction boundaries are client-side.
18. **GraphQL usage — implemented.** One shared fragment, only requested fields, offset pagination, cache-first reads, and separate list/detail operations avoid requesting the entire catalogue for a PDP.

### Section 7 — React 19

19. **Modern React feature — implemented.** `useOptimistic` is used in `src/lib/cart.tsx`, together with `startTransition`, so add-to-cart feedback appears immediately while the reducer state catches up.

## 7. Detailed file walkthrough

### `src/lib/types.ts`

This file is the domain boundary. It models nullable API fields instead of pretending every response is complete. `ProductAttribute` represents the repeated `{ enLabel, values: [{ enName }] }` structure. `Variant` represents price, identifiers, stock, and discount.

`sellingPrice()` centralizes business logic so cards, PDP, and cart subtotal all calculate the same price. `discountPercent()` centralizes discount badge behavior. `attributeValue()` is a reusable lookup helper for case-insensitive product attributes.

Interview answer: “Why centralize price logic?” Because duplicating discount arithmetic in three components invites inconsistent totals, badges, and checkout behavior. A pure function is easy to test independently.

### `src/lib/queries.ts`

`PRODUCT_FIELDS` is a GraphQL fragment shared by `PRODUCTS_QUERY` and `PRODUCT_QUERY`. The list query takes `skip`, `limit`, and `isActive`; the detail query takes `uid` and deliberately requests only one product. The selected fields correspond directly to the reference DOCX.

Interview answer: “Why GraphQL instead of REST?” The supplied backend exposes GraphQL and the UI needs a known, nested product shape. GraphQL lets the app request the exact fields needed for both catalogue and detail views and avoids multiple REST round trips for related attribute/variant data.

### `src/lib/data.ts`

This is the anti-corruption layer between Apollo and UI components. Components do not know the full Apollo result shape or repeat status checks. They receive `{ products, count, error }` or `{ product, error }`.

Interview answer: “Why catch errors here?” It keeps transport/API failure policy in one place and keeps route components readable. The current user-facing messages intentionally avoid leaking internal exception details.

### `src/lib/apollo.ts`

The client is created with an in-memory cache and `HttpLink`. The endpoint is configurable. The custom fetch adds JSON negotiation, compression, and a browser-like user agent because the Walton development server was observed to reset some default Postman connections. The same workaround is reflected in `postman.json`.

Potential improvement: create one long-lived Apollo client per server request/runtime strategy if the application grows, and define explicit cache type policies if normalized entity updates become important. The current simple cache is enough for the read-only catalogue flow.

### `src/app/page.tsx`

This is intentionally a server component. It parses `searchParams`, validates page size through `normalizePageSize`, invokes the data adapter, and composes the hero, controls, grid, pagination, and footer. It does not own filter state because those controls only filter the fetched current page in `ProductGrid`.

Interview answer: “What happens if `page` is invalid?” `Math.max(1, Number(params.page) || 1)` falls back to page 1 for missing, nonnumeric, or less-than-one values. Unsupported `limit` values fall back to 12.

### `src/components/ProductGrid.tsx`

This is a client component because the controls are interactive. `categories` is derived from `productAttributes` whose label is `Brand`. `visible` combines name search, availability, brand, and sorting. `useMemo` avoids recomputing those arrays unless products or control values change.

Important scope statement: these filters operate on the current API page, not the complete catalogue. That is consistent with the current architecture but should be explained. For catalogue-wide filtering, the filters should be sent to the backend or the app would need a separate indexed/search data source.

### `src/components/ProductCard.tsx`

The card selects the first variant for list price/stock presentation, uses `next/image` with `fill` and responsive `sizes`, and links to the UID route. CSS group-hover creates a subtle image scale and card lift. The card has a no-image fallback and displays both selling and original price when a discount exists.

### `src/components/ProductDetails.tsx`

The component owns four local UI states: selected image, selected variant, active information tab, and the derived active variant. It renders only tabs that have data. `InfoList` is reused for every API section because all five sections share the same shape.

The CTA is disabled when there is no variant or quantity is zero. Variant buttons use POS code because the API has no customer-facing variant label. Images are filtered for valid URLs, and the main image has a fallback.

### `src/lib/cart.tsx`

The reducer is pure and handles all cart transitions. A line key includes the product and variant identifier, preventing two variants of one product from being merged accidentally. Add and update operations cap quantity at API stock. Quantity below one removes the line.

Hydration is guarded by `hydrationStarted` so it runs once. Stored JSON is parsed defensively and invalid entries are discarded. `hydrationComplete` prevents the initial empty state from overwriting localStorage before the read finishes. The legacy key is read and both keys are removed on clear.

Interview answer: “Why store a product snapshot?” The drawer needs enough display data immediately without another request. In a real checkout, price and stock must still be revalidated server-side because localStorage is untrusted and can become stale.

### `src/components/CartDrawer.tsx`

The drawer computes subtotal from `sellingPrice()` rather than trusting a stored subtotal. It supports increase/decrease, remove, clear with confirmation, empty state, Escape-to-close, and backdrop close. `h-dvh`, `min-h-0`, and a dedicated scrolling item region keep the drawer usable on mobile and prevent it from collapsing behind the sticky header.

### `src/components/RichText.tsx`

The API can return literal HTML in values such as descriptions. React text rendering would show tags as text; raw `dangerouslySetInnerHTML` would be unsafe. This component checks for markup, sanitizes through `isomorphic-dompurify`, and allows only a small set of formatting tags and safe link attributes.

Interview answer: “Why not render API HTML directly?” API content is external input. Sanitization prevents scripts, event handlers, styles, and unsupported attributes from becoming executable or unsafe markup.

### `src/components/LoadingSkeleton.tsx`

The shared skeleton module provides listing and detail shapes. `src/app/loading.tsx` and the dynamic route’s `loading.tsx` are automatically used by Next.js during route transitions, including pagination, page-size changes, opening a product, and returning to the listing.

## 8. How to demonstrate the API requirement live

### Postman

Open `postman.json` in Postman. The collection has two POST requests:

1. **Get Product Details** — default UID `P-4TCF9V`, with the full detail field set. To test POS lookup, set `uid` to `null` and use `posItemCode`.
2. **Get All Products** — uses `isActive: null`, `skip`, and `limit` to inspect the catalogue and stores `result.count` as `totalProducts`.

The test scripts verify HTTP success, the presence of `getProducts`, API `statusCode === 200`, and (for the catalogue request) that `products` is an array.

### Code trace to show

Use this explanation while opening files:

```text
page.tsx
  -> getProducts(skip, limit)
    -> PRODUCTS_QUERY
      -> Apollo HttpLink
        -> POST /graphql
          -> getProducts(...)
            -> result.products + result.count
```

For a detail page:

```text
/products/P-4TCF9V
  -> [uid]/page.tsx
    -> getProduct(uid)
      -> PRODUCT_QUERY(filter: { uid })
        -> ProductDetails(product)
          -> selected variant -> sellingPrice -> cart add
```

## 9. Common interview questions and strong answers

### Why are the listing and detail routes server components?

They fetch initial remote data and can produce useful HTML without shipping all fetching logic to the browser. Only controls and stateful interactions are client components.

### Why pagination instead of infinite scroll?

The API explicitly exposes offset pagination. Numbered URLs are shareable, predictable, accessible, and keep the initial response small. Infinite scroll would require additional intersection/loading state and would make deep-linking less direct.

### Is Apollo cache enough for cart state?

No. Apollo cache is for remote GraphQL data; the cart is user-owned client state. The cart uses Context/reducer and localStorage. Apollo’s in-memory cache is still useful for repeated catalogue/detail reads.

### Why use `cache-first`?

It avoids a duplicate network request when the same query is already cached. The product catalogue is read-heavy. A production storefront could add a freshness policy or revalidation because prices and stock change.

### Does the app filter the whole catalogue?

No. The API page is fetched server-side and the current page is filtered client-side. That is efficient for the current request but not equivalent to backend catalogue search. A production implementation should add server-side filter variables or a search service.

### How is stock handled?

A product is considered in stock on the PLP when any variant has quantity greater than zero. The PDP uses the selected variant quantity. The CTA is disabled at zero, and cart quantity cannot exceed the selected variant quantity. The server must still revalidate stock before order placement.

### How are variants identified?

The line key uses `uid` plus `posItemCode`, then `ebsItemCode`, then `default`. The PDP displays POS code as the available API identifier. The backend does not provide a customer-facing variant label mapping, so the UI cannot safely invent labels such as “Red” or “128 GB”.

### What React 19 feature did you use?

`useOptimistic` in the cart. Add-to-cart immediately updates the rendered optimistic collection inside `startTransition`, then the reducer commits the same action.

### What security concern exists in the data?

Descriptions can contain HTML. `RichText` sanitizes an allowlisted subset before setting inner HTML. Images are also restricted through `next.config.ts` to the Walton CDN hostname.

### What would you improve next?

The most evaluation-relevant improvements are: add a card-level add-to-cart button if required literally; confirm or extend the API for real category and rating fields; move filtering/sorting server-side for catalogue-wide behavior; generate GraphQL types; add automated unit/component tests; add server-side cart/checkout revalidation; and add cache freshness/revalidation policy.

## 10. Honest limitations and how to frame them

Do not claim requirements that the current API or code does not support.

| Topic | Current state | Correct interview framing |
|---|---|---|
| Category | Brand attribute used as category control | “The API exposes Brand-like attributes, not a category field, so I used the closest defensible field and documented it.” |
| Rating | No field in reference/live responses | “Rating sorting is not implemented because fabricating ratings would be incorrect; I would add it once the schema exposes rating.” |
| Card add-to-cart | PDP CTA is implemented; card is a link | “Optimistic cart behavior is implemented in the shared cart and PDP. A literal card CTA is the remaining UI refinement.” |
| Filter scope | Current API page only | “Local filters are page-scoped; backend filter variables are needed for full-catalogue filtering.” |
| GraphQL typing | Manual TypeScript models | “The response/domain model is typed, but Code Generator is not installed; generated schema types would reduce drift.” |
| Checkout | No server checkout/order flow | “This assignment implements cart interaction only; localStorage is not a trusted order source.” |

## 11. Validation and submission checklist

Run from the repository root:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Then verify manually:

- `/` loads active products and shows a skeleton during navigation;
- page links and `limit=12|20|30` preserve URL state;
- name search, brand/category, availability, and price sorting work on the current page;
- opening a card reaches `/products/{uid}`;
- a product with multiple images changes the gallery image;
- variants change price/stock/CTA state;
- empty/null information is safe;
- API HTML renders as formatted text without scripts;
- an out-of-stock variant cannot be added;
- cart count updates optimistically;
- quantity cannot exceed stock;
- refresh preserves the cart;
- Escape, backdrop, remove, and clear behaviors work;
- remote CDN images render through `next/image`.

Keep `waltonplaza-api-reference.docx`, `walton_frontend_evaluation.pdf`, and `postman.json` available during review. `node_modules` and `.next` are generated local artifacts, not feature deliverables.

## 12. Final presentation script

“The app uses a server-rendered App Router shell and a small set of client boundaries for interactions. `page.tsx` and `[uid]/page.tsx` call a typed Apollo data adapter. The adapter checks Walton’s application-level `statusCode`, while the shared GraphQL fragment keeps list and detail fields consistent. The PLP uses the backend’s offset pagination and keeps URL state shareable. Product cards use `next/image` and hover feedback; the PDP handles gallery, API-backed variants, pricing, stock, and five information sections. Cart state is a reducer behind Context, persisted with a versioned localStorage key, and updated optimistically with React 19 `useOptimistic`. I documented the API limitations: there is no rating field, category is represented by the available Brand attribute, and a strict card-level add button would be the next small refinement.”

# FAQ

## What is typescript strict mode? and how is it being handled in this project
• TypeScript strict mode enables stronger compile-time checks so unsafe or ambiguous code is rejected before runtime.

  In this project, it is enabled in tsconfig.json:

  {
    "compilerOptions": {
      "strict": true,
      "noEmit": true
    }
  }

  strict: true includes checks such as:

  - strictNullChecks: prevents using null or undefined as valid values without checking.
  - noImplicitAny: prevents variables and parameters from silently becoming any.
  - strictFunctionTypes: validates function parameter types.
  - strictPropertyInitialization: ensures class properties are initialized.
  - useUnknownInCatchVariables: treats caught errors safely as unknown.

  The project handles strict mode through typed models and explicit nullable values:

  export type ImageAsset = {
    url: string | null;
  };

  export type Variant = {
    mrpPrice: number | null;
    quantity: number | null;
    posItemCode: string | null;
  };

  Because API fields can be null, the code checks them safely:

  const price = variant?.mrpPrice ?? 0;
  const image = product.images?.[0]?.url;

  Other strict-mode practices in the project include:

  - Typed component props:

  export function ProductCard({ product }: { product: Product })

  - Typed async results:

  Promise<{ products: Product[]; count: number; error?: string }>

  - Typed GraphQL responses:

  createApolloClient().query<ProductsResponse>(...)

  - Typed reducer actions using a union:

  type Action =
    | { type: "add"; item: CartItem }
    | { type: "remove"; key: string }
    | { type: "clear" };

  - Explicit React types such as ReactNode.
  - No unchecked API values are assumed to exist.
  - noEmit: true ensures TypeScript is used for validation only and does not generate JavaScript files.

  You can verify strict mode with:

  npx tsc --noEmit

  This currently passes in the project.
  
# Page Performance Issue Fix 

### 1. Stream the page shell

Render the header, hero, and page structure immediately. Put the API-dependent product section inside Suspense.

This allows users to see the page and skeleton immediately while products load.

### 2. Use a smaller listing query

The listing page currently requests detail-only fields such as:

detailedDescriptions
deliveries
serviceAndDeliveries
priceAndStocks

The listing query should request only:

uid
enName
images
productAttributes
variants

Keep the full fields only for the product detail page.

### 3. Add explicit server caching

The response currently says:

X-Vercel-Cache: MISS
Cache-Control: no-store

Add controlled Next.js server caching, preferably around the product data request, with a short revalidation period such as 60–300 seconds.

That prevents every visitor from calling Walton’s API independently.


Implement  these without  breaking any current functionality. 

