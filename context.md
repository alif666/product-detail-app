# Walton Plaza Frontend Developer Assignment Context

## Project

- Workspace: `product-detail-app`
- Role: Frontend Developer
- Employer/project: Walton Plaza
- Submission deadline: **29/08/2026**
- HR contact: Shoaib Muhummod, HRM Department, Walton Plaza; mobile `01608 983 192`.
- The email's recipient address was not present in the supplied message; confirm it before sending.
- Submission email subject: `Frontend Developer Project Submission – [Your Name]`

## Source documents

- `walton_frontend_evaluation.pdf` — evaluation requirements.
- `waltonplaza-api-reference.docx` — GraphQL API reference.
- `postman.json` — created Postman collection for API testing.

## Evaluation requirements

### Section 1: Architecture & Setup

1. Set up Next.js App Router with TypeScript strict mode.
2. Define a scalable folder structure.
3. Configure a GraphQL client with caching.
4. Create typed GraphQL queries.
5. Add environment-based API configuration.

### Section 2: Product Listing Page (PLP)

6. Fetch products via GraphQL.
7. Add pagination or infinite scroll and justify the choice.
8. Add loading skeleton and error handling.
9. Add filters for price, category, and availability.
10. Add sorting by price and rating.

### Section 3: Product Card

11. Build a reusable `ProductCard` component with optimized images, a hover micro-interaction, and optimistic add-to-cart behavior.

### Section 4: Product Details Page (PDP)

12. Add dynamic routing.
13. Fetch product details, including an image gallery, variant selection, stock-aware CTA, and dynamic pricing.

### Section 5: State Management

14. Implement cart add/remove/update operations.
15. Persist cart state and explain the approach.

### Section 6: Performance Optimization

16. Explain and apply memoization strategy.
17. Make appropriate server/client component decisions.
18. Optimize GraphQL usage.

### Section 7: React 19

19. Use at least one modern React 19 feature.

## Deliverables and evaluation

- GitHub repository.
- README documenting architecture decisions and trade-offs.
- Main evaluation criteria: architecture quality, performance optimization, code quality, TypeScript usage, and decision-making ability.

## Evaluation objective and required stack

- Objective: design and implement a high-performance product listing and product detail system.
- Required stack: Next.js App Router, React 19, TypeScript in strict mode, Tailwind CSS, and GraphQL using Apollo, urql, or a custom client.

## API reference

- GraphQL endpoint: `https://devapi.waltonplaza.com.bd/graphql` (HTTP `POST`)
- In `postman.json`, the `baseUrl` variable is the domain `https://devapi.waltonplaza.com.bd`; the request appends `/graphql`.
- HTTP method: `POST`
- Header: `Content-Type: application/json`
- Main query: `getProducts`
- Pagination: `pagination: { skip: 0, limit: 10 }`
- Product filters can use either `uid` or `posItemCode`.
- The reference also documents `isActive: null | true | false`; `null` includes all products, while `true` returns active products only.
- Example UID: `P-4TCF9V`
- Example POS item code: `25311`
- `getProducts` returns `message`, `statusCode`, and `result`; `result` contains `count` and `products`.
- Pagination uses `skip` as the offset and `limit` as the number of records returned.
- The complete detail query maps `productAttributes`, `detailedDescriptions`, `deliveries`, `serviceAndDeliveries`, and `priceAndStocks` to the corresponding information tabs/sections.
- The JavaScript example sends a JSON body with a `query` string and reads the product from `data.getProducts.result.products[0]`.

Important response fields:

- `message`, `statusCode`
- `result.count`, `result.products`
- Product: `uid`, `enName`, `images { url }`
- Basic information: `productAttributes { enLabel values { enName } }`
- Detailed information: `detailedDescriptions { enLabel values { enName } }`
- Terms and conditions: `deliveries { enLabel values { enName } }`
- Warranty information: `serviceAndDeliveries { enLabel values { enName } }`
- Special features: `priceAndStocks { enLabel values { enName } }`
- Variants: `mrpPrice`, `ebsItemCode`, `posItemCode`, `quantity`, and `discount { amount value type }`

API behavior to handle:

- `statusCode === 200` means success; otherwise show `message` in an error state.
- `discount === null`: use `mrpPrice` as the selling price with no discount display.
- `discount.type === "flat"`: `sellingPrice = mrpPrice - discount.amount`.
- `discount.type === "percentage"`: `sellingPrice = mrpPrice - (mrpPrice * discount.amount / 100)`.
- `discount.value` should already equal the selling price and may be used directly for display.
- `quantity === 0`: disable buying and show an out-of-stock state.
- `images` may be empty; use a placeholder.
- Information arrays may be null or empty; hide the tab or show a no-information message.
- The documented API fields do not include category or rating fields, although the evaluation asks for category/availability filters and rating sorting. Confirm whether the live API exposes additional fields; otherwise document the limitation and implement only defensible client-side behavior.
- Verified live response for `P-4TCF9V`: HTTP 200, API status 200, message `SUCCESS`, count 1, product name `Safe Non-Inverter AC 1 Ton | SSN12AFB1-SLRG`, one CDN image, and one variant with MRP `51990`, quantity `493`, discount amount `5199`, discount value `10`, and type `PERCENTAGE`.
- The live response contradicts the DOCX description of `discount.value`; for `PERCENTAGE`, use `discount.value` as the percentage and normalize type casing. For flat discounts, use `discount.amount` as the BDT deduction.
- The live product response uses `discount.type: "PERCENTAGE"`, `amount: 5199`, and `value: 10` for MRP `51990`; the correct displayed selling price is `46791` and the discount badge is `10% OFF`.
- Verified flat-discount data by scanning all 1,966 active and 678 inactive products in API pages of 30: active product `P-6YSJTA` (`TAKYON E-Bike | FUSION 25FZ`) has three flat-discount variants, POS codes `174333`, `174363`, and `174336`. Each has MRP `169999`, flat discount amount/value `500`, type `FLAT`, and therefore calculated selling price `169499`.
- Verified live image-gallery data: active-products request with `limit: 30` returned product `P-AD86M9` (`Walton Inverter AC 1.5 Ton | WSI-INVERNA (SUPERSAVER)-18H [PLASMA]`) with 2 image URLs; the other 29 products in that response had 1 image each.
- Verified full active-catalog variant data: paginated through all 1,966 active products in 30-product API requests. Found 178 products with multiple variants. Example `P-67YNHW` (`Walton Ceiling Fan 56\" | Lily`) has 4 variants with POS item codes `39912`, `39911`, `39910`, and `39754`; the API response supports the existing PDP variant selector.
- Variant UX/API finding: for `P-67YNHW`, all 4 variants have the same MRP `4250` and 8% percentage discount, so the computed selling price is the same (`3910`) while quantities differ. The API exposes `posItemCode`/`ebsItemCode` identifiers but no per-variant customer-facing label or attribute mapping; product-level attributes aggregate values such as color. Other tested multi-variant products (`P-TFDBNB`, `P-9RWG8D`, `P-MVU6AJ`) also had equal prices across their variants.
- Edge-case catalog scan: scanned all 1,966 active and 678 inactive products. No product had `discount: null`, an empty `images` array, or a zero-quantity variant in those responses. Products with empty information sections include `P-F59HZE` (empty `priceAndStocks`), `P-GKH6T4` (empty `priceAndStocks`), `P-XFPXFJ` (empty `deliveries`, `serviceAndDeliveries`, and `priceAndStocks`), `P-MPKA2C` (empty `priceAndStocks`), and `P-88XFTZ` (empty `detailedDescriptions`, `deliveries`, and `priceAndStocks`).
- Product detail API values may contain literal HTML such as `<p>`, `<ul>`, and `<li>`; these must be rendered as sanitized rich text, not displayed as escaped tag text.

## Current project status

- The workspace initially contained only the source PDF, API DOCX, and a minimal README; the Next.js scaffold has since been generated.
- Current scaffold uses Next.js `16.3.3`, React/React DOM `19.2.8`, TypeScript, Tailwind CSS, and Apollo Client `4.2.12` (exact installed versions are recorded in `package.json` and `package-lock.json`).
- The assignment implementation is now present in `src/app`, `src/components`, and `src/lib`: PLP, PDP, Apollo data layer, typed models, pagination, filters, product cards, variant pricing, and cart persistence.
- PLP implementation: server-rendered live product fetch, `skip`/`limit` pagination, search by name, brand-attribute filtering, stock availability filtering, price sorting, responsive cards, optimized remote images, discount badges, and loading/error/empty-safe rendering.
- Numbered pagination: the PLP keeps the existing 12-item API page size and offset calculation, exposes numbered page links using `/?page=N`, highlights the current page, disables Previous/Next at the boundaries, and uses accessible ellipses for larger page ranges.
- Icon refinement: added reusable inline SVG icons in `src/components/Icons.tsx` and used them for header navigation, cart access, hero/shop labels, featured products, and pagination arrows. Existing links, cart actions, and pagination routing remain unchanged.
- Icon/layout correction: increased the header cart icon from `size-4` to `size-5` and changed the PLP section heading wrapper to a vertical flex layout so `Shop collection` and `Featured products` remain on separate lines.
- Cart alignment correction: increased the header cart icon to `size-6`, added `shrink-0`, `whitespace-nowrap`, and `leading-none` so the icon, Cart label, and item count stay larger and aligned horizontally.
- Mobile cart refinement: hides only the visible `Cart` label below the `sm` breakpoint; the larger cart icon and item count remain visible, while the button keeps its accessible `Shopping cart` label.
- Heading icon refinement: removed icons from the `Shop collection` and `Featured products` PLP labels at the user's request; useful header, cart, hero, and pagination icons remain.
- Configurable page size: added `src/lib/pagination.ts` with a default page size of 12, validated presets of 12, 20, and 30, and a maximum of 30 to match the API behavior. Added `src/components/PageSizeSelect.tsx`; the PLP accepts URL `limit`, resets to page 1 on selection, and preserves the selected limit in numbered/Previous/Next links. Values outside the supported range fall back to 12. The earlier 24/48/100 options were removed because the server returns at most 30 products per request.
- Loading feedback: added shared `src/components/LoadingSkeleton.tsx` plus `src/app/loading.tsx` and `src/app/products/[uid]/loading.tsx`. Next.js route-level Suspense fallbacks now show listing/detail skeletons during slow API-backed navigation, including page-size changes, pagination, product opening, and returning to the listing. Shared layout/cart behavior remains outside the route fallback.
- Variant selector UX: PDP variant buttons now show customer-friendly labels (`Variant 1`, `Variant 2`, etc.) with the internal POS code displayed as secondary `SKU` text. Selection still stores the exact variant object, so different variants remain separate cart lines and repeated variants merge quantities.
- Variant badge details: each PDP variant selector now also previews that variant's calculated price, discount percentage when present, stock quantity, and `In stock`/`Out of stock` status before selection. The main selected-variant summary and cart behavior remain unchanged.
- PDP implementation: dynamic `/products/[uid]` route, image gallery/fallback, variant selection, stock-aware CTA, normalized dynamic pricing, and tabs for basic, detailed, delivery, warranty, and special-feature information.
- Cart implementation: React Context plus reducer, `useOptimistic` with `startTransition`, idempotent `hydrate` action, versioned `walton-cart:v1` localStorage persistence, legacy-key migration, drawer UI, quantity controls, remove, subtotal, clear confirmation, empty state, Escape/backdrop closing, and stock limits.
- Cart drawer layout fix: moved the drawer outside the sticky blurred header and used viewport-based `h-dvh`, `min-h-0`, and independent scrolling so items no longer collapse behind the header.
- Brand refinement: uppercase `WALTON PLAZA` header logo, navy W mark, navy/teal/cyan palette, blue primary actions, cooler hero/banner, refined cards, PDP accents, cart styling, and navy footer; no localization was added.
- CSS compatibility fix: removed the unnecessary Tailwind `@theme inline` block from `src/app/globals.css` because generic CSS validators reported it as an unknown rule; Tailwind remains enabled through `@import "tailwindcss"`.
- HTML rendering fix: added `src/components/RichText.tsx` using `isomorphic-dompurify`; `ProductDetails` now sanitizes and renders approved formatting tags (`p`, `br`, `strong`, `b`, `em`, `i`, `ul`, `ol`, `li`, and safe links) with styled spacing. Block markup uses a valid `div` wrapper to avoid invalid HTML nesting. Unsafe scripts, event handlers, styles, and unsupported attributes are removed.
- `node_modules` and `.next` are present locally; they are generated artifacts and should not be treated as source deliverables.
- A Postman v2.1 collection was created at `postman.json`.
- The collection has variables: `baseUrl`, `uid`, `posItemCode`, `skip`, and `limit`.
- Its default request fetches product details by UID `P-4TCF9V` and includes basic Postman tests for HTTP success, `getProducts`, and API `statusCode`.
- The Postman request sets `posItemCode` to `null` while querying by UID. To query by POS item code, set `uid` to `null` and use the `posItemCode` variable in the request JSON.
- The collection now overrides Postman's default user agent with `Mozilla/5.0`, limits accepted compression to gzip/deflate, and sends `Connection: close`; these work around the Walton server's connection reset behavior.
- `postman.json` now contains a second `Get All Products` POST request. It uses `filter: { isActive: null }`, the shared `skip`/`limit` variables, listing fields (`uid`, `enName`, images, variants), and tests HTTP/API success plus the returned product array. It stores the API total in the Postman environment variable `totalProducts`.
- The user referred to this file as `postman.js`; the actual collection filename is `postman.json`, which is the correct Postman collection format.

## Initial setup command already recommended

Run from the project root in Command Prompt:

```cmd
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*" --yes && npm install @apollo/client graphql
```

This has already been run successfully in this workspace. It established the Next.js App Router, TypeScript, Tailwind, and Apollo Client foundation. Verify the generated package versions and repository state before making further changes.

## Recommended implementation direction

- Use Apollo Client with an `InMemoryCache`.
- Keep data fetching in server components where practical, and isolate interactive filters, variants, cart actions, and tabs in client components.
- Use GraphQL Code Generator or another typed-query approach rather than manually duplicating API types.
- Configure the endpoint through an environment variable such as `NEXT_PUBLIC_GRAPHQL_URL`.
- Add README architecture notes, trade-offs, API limitations, and setup/test instructions before submission.
- Current verification: `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass after the customer-friendly variant selector update.
- Pricing correction: `src/lib/types.ts` now calculates percentage selling prices from `discount.value` and displays that same value in the percentage badge, preventing negative/million-scale prices such as `-2,069,090` and `4599% OFF`.
- HTML rich-text fix validation: `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass after adding `isomorphic-dompurify` and the sanitized renderer.

## Git and change tracking

- Repository branch at last context update: `main`.
- `HEAD`: `c5ad7ce` (`Added numbered page links with active-page styling...`).
- `HEAD` matches local `main`, `origin/main`, and `origin/4-add-numbered-pagination`; numbered pagination is committed and merged into the current main pointers. The icon refinement is currently uncommitted.
- `origin/1-integrate-get-product-detail-api` remains at `a161e58`, which is an ancestor of the current history.
- Assignment implementation commit history, oldest to newest: `232f387` initial app implementation; `7e611dd` cart drawer and idempotent persistence; `a161e58` cart drawer viewport layout fix; `54ee3a7` Walton visual refinement; `dfdae7d` removal of the unknown Tailwind theme rule.
- At this context update, `README.md`, `context.md`, `src/app/page.tsx`, and `src/components/Pagination.tsx` are modified but uncommitted for configurable page sizes. New uncommitted in-scope files: `src/components/PageSizeSelect.tsx` and `src/lib/pagination.ts`. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` are local workspace artifacts and are not assignment features.
- Future context updates must record the current branch, HEAD commit, relationship to `main`, merge status, tracked/untracked status, and validation results. Never describe work on another branch as merged until Git history confirms it.
- Latest Git snapshot after flat-discount API verification: branch `main`, HEAD `c999f7d` (`added product variant related information`), matching `origin/main` and `origin/7-add-meaningful-variant-information`; `src/app/page.tsx` and this context update are uncommitted. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` remain local workspace artifacts.

## Latest documentation update

- Added untracked `guideline.md`, an interview/evaluation walkthrough covering project architecture, request/render flows, API-to-code mapping, every evaluation criterion, pricing and null-data behavior, cart persistence, security, performance decisions, Postman usage, common interview questions, limitations, and a final presentation script.
- The guide explicitly records three implementation nuances for accurate evaluation discussion: the API has no tested/documented rating field; the PLP category control uses the available Brand attribute and is page-scoped; and optimistic add-to-cart is implemented through the PDP CTA/shared cart, while the current `ProductCard` is a link without a separate card-level add button.
- Validation after documentation work: `npm run lint`, `npx tsc --noEmit`, and `npm run build` all passed. The build reports dynamic routes `/` and `/products/[uid]` plus the static `/_not-found` route.
- Git state verified before this update: branch `main`, `HEAD` `85e5b2d` (`updated context file`), aligned with `origin/main`; no merge/rebase in progress. Current uncommitted tracked change is `context.md`; current untracked files are `guideline.md`, `.idea/`, and `~$ltonplaza-api-reference.docx`. `.next` and `node_modules` remain generated artifacts.

## Authoritative audit snapshot — 27/08/2026

This section supersedes older Git-state statements above when they conflict with the current repository snapshot. It was written after inspecting the source tree, `README.md`, `guideline.md`, `AGENTS.md`, the Next.js 16 local documentation, and the complete Git graph.

### Verified implementation and fixes

- The app uses Next.js App Router 16.3.3, React 19.2.8, TypeScript strict mode, Tailwind CSS 4, Apollo Client 4.2.12, and the `@/*` → `src/*` alias.
- `src/app/page.tsx` is a server-rendered PLP. It fetches active products through the Walton GraphQL API, validates `statusCode === 200`, handles API/network errors, supports URL-driven `page` and validated `limit` values (12/20/30), and renders numbered pagination with boundary-safe Previous/Next links.
- `src/app/products/[uid]/page.tsx` is a dynamic server-rendered PDP. It supports UID lookup, image gallery selection, missing-image fallback, variants, stock-aware CTA, normalized pricing, information tabs, and not-found/error states.
- `src/lib/apollo.ts`, `queries.ts`, `data.ts`, and `types.ts` provide the typed GraphQL boundary, shared fragment, environment endpoint override, request headers, Apollo `InMemoryCache`, `cache-first` reads, nullable API models, and centralized pricing helpers.
- PLP controls are client-side and page-scoped: name search, available Brand-attribute filter (used as the category substitute), availability filter, and low/high MRP price sorting. The current page's result array is derived with `useMemo`.
- `ProductCard` is reusable and uses `next/image`, responsive `sizes`, remote-image configuration, hover lift/image-scale interaction, discount/price/stock presentation, and a no-image fallback. It links to the PDP; it does not contain a separate card-level add-to-cart button.
- Cart behavior is implemented by `src/lib/cart.tsx` and `CartDrawer.tsx`: add, merge-by-product-and-variant, remove, increment/decrement, clear confirmation, subtotal, empty state, Escape/backdrop close, stock caps, optimistic `useOptimistic` + `startTransition`, idempotent hydration, legacy-key migration, and versioned `walton-cart:v1` persistence.
- Fixed issues include incorrect percentage pricing/badges (live API uses `discount.value` as the percentage), null discount handling, flat discount calculation, zero-stock CTA/cart limits, null/empty information arrays, empty image handling, HTML detail rendering (sanitized with DOMPurify), invalid Tailwind `@theme` CSS, cart drawer overlap/scroll collapse, cart icon sizing/alignment/mobile behavior, variant identification and preview details, and route-level loading feedback.
- `RichText` permits only approved formatting tags and safe link attributes; scripts, event handlers, styles, and unsupported attributes are removed before rendering.
- `postman.json` is a Postman v2.1 collection with UID/POS-item and all-products requests, variables, API/HTTP tests, and the Walton connection workaround. `guideline.md` documents architecture, flows, trade-offs, limitations, and interview/evaluation notes.

### Evaluation against the assignment rubric

| Requirement | Assessment | Evidence or limitation |
|---|---|---|
| App Router, strict TypeScript, scalable structure | Met | `src/app`, `src/components`, `src/lib`; strict `tsconfig.json` |
| GraphQL client with caching, typed queries, env config | Met | Apollo `InMemoryCache`, typed response models, shared fragment, `NEXT_PUBLIC_GRAPHQL_URL` |
| PLP fetch and pagination/infinite scroll | Met | Offset `skip`/`limit`, URL pagination, page-size selector; pagination chosen because the API exposes offsets |
| Loading and error handling | Met | Route `loading.tsx` skeletons plus API status/network error states |
| Price/category/availability filtering | Partial but honest | Availability and price are implemented; Brand is the category substitute because no category field is documented/tested, and filtering is current-page scoped |
| Price/rating sorting | Partial | Price sorting is implemented; rating cannot be implemented without a rating field, so no data is fabricated |
| Product card, optimized image, hover, optimistic add | Partial | Card/image/hover are met; optimistic add-to-cart is implemented on the PDP/shared cart, not as a card-level CTA |
| PDP, gallery, variants, stock, dynamic pricing | Met | `/products/[uid]`, gallery/fallback, variant selection, stock CTA, centralized pricing |
| Cart add/remove/update and persistence | Met | Context/reducer, drawer controls, localStorage v1 persistence and migration |
| Memoization and server/client decisions | Met with room to refine | `useMemo`; server routes/data and client interactive boundaries are appropriate. No `React.memo`/`useCallback` is currently needed by measured evidence |
| GraphQL optimization | Met for current scope | Shared fragment, field-limited list/detail queries, offset pagination, cache-first reads; no generated-code pipeline |
| React 19 feature | Met | `useOptimistic` with `startTransition` |
| README/deliverable documentation | Met | README plus `guideline.md`, Postman collection, and this context file |

Overall evaluation: strong implementation for the requested stack and core product-flow criteria. The main scoring deductions are API-constrained category/rating behavior, page-scoped client filtering/sorting, and the missing ProductCard-level add button. Architecture, TypeScript, error/null handling, pricing correctness, PDP behavior, cart behavior, and documentation are otherwise in place. There are no automated unit/integration tests in the repository; validation currently relies on lint, TypeScript, production build, and documented API/Postman checks.

### Current Git truth

- At this audit: branch `8-Search-with-product-id-exact-search-in-product-listing`; `HEAD` is `89df5ff` (`context updated for review`).
- Local `main`, current feature branch, `origin/main`, and `origin/8-Search-with-product-id-exact-search-in-product-listing` all point to `89df5ff`. The branch is therefore merged/aligned with `main`; do not describe any other branch as merged unless future Git pointers/history confirm it.
- The prior feature branches listed in `git branch -avv` (`1-integrate-get-product-detail-api`, `116-not-getting-product-price-amount-correctly`, `2-enhance-ui`, `3-html-tags-showing-in-product-detail-page`, `4-add-numbered-pagination`, `5-need-a-visual-skeleton-preloader`, `6-add-records-per-page`, `7-add-meaningful-variant-information`, `ai-context-update`, and `getProducts-postman-request-add`) remain available as refs and their relevant commits are ancestors of current `main` unless a future graph says otherwise.
- There is no merge, rebase, or cherry-pick in progress. The committed branch pointers are aligned, but the current working tree contains uncommitted exact-UID-search changes in `README.md`, `src/app/page.tsx`, `src/components/ProductGrid.tsx`, and `src/lib/data.ts`, plus this `context.md` update. These changes are not merged into `main` until committed and confirmed by Git history. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` are local artifacts; `.next/` and `node_modules/` are generated/installed state and are not feature deliverables.
- Validation on this snapshot passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build`. The build reports dynamic `/` and `/products/[uid]` routes and static `/_not-found`.
- Final validation after reconciling the exact-UID-search working tree also passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build` (Next.js 16.3.3/Turbopack; dynamic `/` and `/products/[uid]`, static `/_not-found`).

### Context maintenance contract for future sessions

- `AGENTS.md` is the operating instruction: read this file before assignment changes and update it after every implementation, bug fix, design/dependency/configuration/test change, commit, merge, rebase, or branch switch.
- Every update must preserve prior functionality notes, record new public interfaces/files/limitations and validation, then inspect `git status --short --branch`, `git branch -avv`, and `git log --oneline --decorate --graph` before updating the Git section.
- Keep committed, uncommitted, and untracked work separate. Record branch/HEAD and ancestor or merge relationships from Git evidence only. If context cannot be updated, state that explicitly at handoff.

## Latest implementation update: exact product-ID search

- Exact product-ID search is now automatic after the complete UID length is entered. A UID matching `/^P-[A-Z0-9]+$/i` and the verified live-catalog length of 8 characters (for example `P-4TCF9V`) is normalized to uppercase and stored in the URL as `uid`; Enter remains supported as a fallback.
- The server listing route uses the existing `getProduct(uid)` API query for UID searches, then renders the single returned product through the existing `ProductCard`. The card's existing link continues to open `/products/[uid]`, so detail-page and cart functionality are unchanged.
- Normal product-name search remains a client-side filter for the currently loaded page. Existing brand/category, availability, price sorting, page-size, numbered pagination, loading skeleton, API error, and empty-state behavior remain intact.
- Exact UID mode hides page-size and pagination controls because the API result is a single product. Clearing the UID or submitting a non-UID search returns to the normal listing route; the selected `limit` is preserved.
- Live active-catalog verification found 1,966 UIDs, all with length 8; minimum and maximum lengths were both 8. Empty search input immediately removes the UID query and restores the normal paginated listing.
- `README.md`, `src/app/page.tsx`, `src/components/ProductGrid.tsx`, and `src/lib/data.ts` are modified for this feature. Unknown exact UIDs now show `Product not found.` instead of incorrectly displaying a successful API message. Validation passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Git snapshot after this implementation: branch `8-Search-with-product-id-exact-search-in-product-listing` at `89df5ff`, tracking `origin/8-Search-with-product-id-exact-search-in-product-listing`; `main` and `origin/main` also point to `89df5ff`. The exact-search changes are currently uncommitted on this branch and are not merged into `main`. Untracked local artifacts remain `.idea/` and `~$ltonplaza-api-reference.docx`; `.next` and `node_modules` are generated artifacts.

## Latest implementation update: flat discount badges

- Added shared `discountInfo` classification in `src/lib/types.ts`. Percentage discounts continue to display as `10% OFF` on listing cards and `Save 10%` on the PDP; flat discounts now display the actual deduction as `Save ৳X` in both the listing card badge and the PDP's selected-variant and variant-preview badges.
- Flat discount price calculation and cart subtotal calculation are unchanged; this change only corrects the customer-facing badge text and avoids deriving a misleading percentage for flat discounts.
- Validation passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Git snapshot after this implementation: branch `Flat-discount-badge-should-show-Save-X-tk-instead-of-percentage`, `HEAD` `21159dc`, aligned with local `main`, `origin/main`, and the feature branch remote. The badge changes are currently uncommitted in `src/lib/types.ts`, `src/components/ProductCard.tsx`, and `src/components/ProductDetails.tsx`; no merge is required for these pointers because `HEAD` is already aligned with `main`, but the working-tree changes must still be committed before handoff.

## Latest implementation update: supplied Walton SVG logo

- Replaced the text-built header logo with the supplied Walton Plaza SVG as the reusable `WaltonLogo` component in `src/components/Icons.tsx`.
- `Header` now renders the SVG inside the existing home link with `aria-label="Walton Plaza home"`; responsive sizing is preserved (`170px` on smaller screens and `216px` from the `sm` breakpoint). Cart, navigation, and route behavior are unchanged.
- Validation passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Git snapshot after this implementation: branch `main`, `HEAD` `e2054ae`, aligned with `origin/main`; the logo changes are currently uncommitted in `src/components/Header.tsx` and `src/components/Icons.tsx`. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: header background color

- Updated the sticky top header background from translucent white to the requested `#ddf0f4` color in `src/components/Header.tsx`. The SVG logo, navigation, cart, sticky positioning, and all other page colors remain unchanged.
- Git snapshot before this update: branch `main`, `HEAD` `e2054ae`, aligned with `origin/main`; the header color change is uncommitted in `src/components/Header.tsx`. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: page background color

- Changed the global `--background` color in `src/app/globals.css` to `#f5f5f5`, so the entire page body uses the requested light-gray background. Component-specific surfaces such as the header, cards, hero, cart drawer, and footer remain unchanged.
- Git snapshot before this update: branch `main`, `HEAD` `e2054ae`, aligned with `origin/main`; the page background change is uncommitted in `src/app/globals.css`. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: ribbon discount badge styling

- Added reusable `src/components/DiscountBadge.tsx` with a red gradient ribbon for listing cards and a compact gradient pill for PDP badges. The badge preserves the existing discount semantics: percentage discounts show `% OFF`/`Save X%`, while flat discounts show `Save ৳X`.
- Applied the badge to `ProductCard` and `ProductDetails`, including the selected-variant summary and each variant preview. Pricing, stock, variant selection, cart behavior, and API handling are unchanged.
- The referenced `.git/logs/refs/heads/discount-badge-ui-update` contains the branch creation reflog entry; the current branch is `discount-badge-ui-update`.
- Validation passed: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Git snapshot after this implementation: `HEAD` `db7a436`, with local `main`, `origin/main`, and `origin/discount-badge-ui-update` aligned at that commit. The ribbon changes are currently uncommitted in `src/components/ProductCard.tsx` and `src/components/ProductDetails.tsx`, with new untracked `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: two-line discount emphasis

- Updated `DiscountBadge` so both percentage and flat-discount badges intentionally render on two lines with a larger primary value. Percentage badges show the percentage above `OFF`; flat badges show the taka amount above `Save`.
- The two-line treatment applies to the listing ribbon and compact PDP badges. Discount values, price calculations, and all existing product/cart behavior remain unchanged.
- Validation passed: `npm run lint` and `npx tsc --noEmit`.
- Git snapshot after this implementation: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`. The two-line badge refinement is uncommitted in `src/components/DiscountBadge.tsx`; prior badge component changes remain uncommitted in the related product files. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: lifted discount ribbon

- Moved the listing ribbon down slightly inside the product image area (`top-2`) and strengthened its shadow so it appears lifted and separated from the card edge without being clipped by the card's existing `overflow-hidden` layout.
- Compact PDP badges are unchanged. Pricing, discount values, product links, and cart behavior remain unchanged.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the ribbon refinement is uncommitted in `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: ribbon over card edge

- Repositioned the listing discount ribbon relative to the product card instead of the image area. The card now permits the ribbon to overflow above its top edge, while the image container retains its own rounded-top clipping.
- The ribbon's red gradient, two-line amount emphasis, detail-page badges, pricing, and cart behavior remain unchanged.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the card/ribbon refinement is uncommitted in `src/components/ProductCard.tsx` and `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: ribbon protrusion

- Moved the listing ribbon to `-top-2` relative to the card so its upper section visibly pokes above the card border, matching the supplied visual reference. The card remains `overflow-visible`; the image area retains rounded-top clipping.
- Validation passed: `npm run lint` and `npx tsc --noEmit`.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the protrusion refinement is uncommitted in `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: tighter ribbon spacing

- Reduced the listing ribbon's internal padding and minimum size (`min-h-12 min-w-12`, `px-1 py-0.5`) so the two-line discount value has less empty space while staying legible and protruding above the card.
- Compact PDP badges, discount semantics, pricing, product links, and cart behavior remain unchanged.
- Validation passed: `npm run lint` and `npx tsc --noEmit`.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the tighter ribbon spacing is uncommitted in `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: darker, tighter, left-aligned ribbon

- Changed both discount badge gradients to darker red shades.
- Reduced the listing ribbon to `min-h-11 min-w-11`, `px-0.5 py-0`, and left-aligned its two-line content with `items-start text-left`.
- The ribbon remains positioned at `-top-2` above the product card. Compact PDP badges, discount semantics, pricing, product links, and cart behavior remain unchanged.
- Validation passed: `npm run lint` and `npx tsc --noEmit`.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the darker/tighter alignment refinement is uncommitted in `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: lighter-to-darker ribbon gradient and spacing

- Updated the listing ribbon gradient to use a brighter red at the top and a darker burgundy toward the bottom, matching the supplied visual reference more closely.
- Added a one-pixel line gap between the discount amount and `OFF`/`Save`, while retaining the compact horizontal padding and left-aligned content.
- The ribbon remains positioned at `-top-2` above the card. Discount calculations, badge semantics, PDP behavior, product links, and cart behavior remain unchanged.
- Validation passed: `npm run lint` and `npx tsc --noEmit`.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the gradient and spacing refinement is uncommitted in `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest implementation update: centered ribbon content

- Centered the listing ribbon's two-line discount content using `items-center text-center`, which better matches the ribbon's narrow shape and pointed bottom.
- Preserved the brighter-to-darker gradient, tight spacing, `-top-2` protrusion, discount calculations, PDP behavior, product links, and cart behavior.
- Validation passed: `npm run lint` and `npx tsc --noEmit`.
- Git snapshot before this update: branch `discount-badge-ui-update`, `HEAD` `db7a436`, aligned with local `main`, `origin/main`, and `origin/discount-badge-ui-update`; the alignment refinement is uncommitted in `src/components/DiscountBadge.tsx`. Untracked `.idea/`, `issues/`, and `~$ltonplaza-api-reference.docx` remain local artifacts.

## Latest documentation update: evaluation criteria report

- Added `evaluation.md`, a criterion-by-criterion assessment against `walton_frontend_evaluation.pdf`, cross-checked with `waltonplaza-api-reference.docx`, the current implementation, `README.md`, and `guideline.md`.
- The report records evidence and verification paths for all 19 criteria, including pagination rationale, loading/error behavior, cart persistence, server/client boundaries, Apollo caching, and React 19 `useOptimistic` usage.
- It explicitly records partial/API-constrained areas: no dedicated price-range filter, no documented rating field, brand used as the category-like filter, manually maintained GraphQL types, page-scoped client filtering/sorting, and no literal card-level add-to-cart CTA.
- Git snapshot before this documentation update: branch `main`, `HEAD` `f27a24b`, aligned with `origin/main`, `origin/discount-badge-ui-update`, and local `discount-badge-ui-update`; `evaluation.md` is untracked. Untracked `.idea/` and `~$ltonplaza-api-reference.docx` remain local artifacts.
