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
- The live response contradicts the DOCX description of `discount.value`; calculate selling price from MRP and amount, and normalize discount type casing.
- The live product response uses `discount.type: "PERCENTAGE"`, `amount: 5199`, and `value: 10` for MRP `51990`; do not assume `discount.value` is the final price.

## Current project status

- The workspace initially contained only the source PDF, API DOCX, and a minimal README; the Next.js scaffold has since been generated.
- Current scaffold uses Next.js `16.3.3`, React/React DOM `19.2.8`, TypeScript, Tailwind CSS, and Apollo Client `4.2.12` (exact installed versions are recorded in `package.json` and `package-lock.json`).
- The assignment implementation is now present in `src/app`, `src/components`, and `src/lib`: PLP, PDP, Apollo data layer, typed models, pagination, filters, product cards, variant pricing, and cart persistence.
- PLP implementation: server-rendered live product fetch, `skip`/`limit` pagination, search by name, brand-attribute filtering, stock availability filtering, price sorting, responsive cards, optimized remote images, discount badges, and loading/error/empty-safe rendering.
- PDP implementation: dynamic `/products/[uid]` route, image gallery/fallback, variant selection, stock-aware CTA, normalized dynamic pricing, and tabs for basic, detailed, delivery, warranty, and special-feature information.
- Cart implementation: React Context plus reducer, `useOptimistic` with `startTransition`, idempotent `hydrate` action, versioned `walton-cart:v1` localStorage persistence, legacy-key migration, drawer UI, quantity controls, remove, subtotal, clear confirmation, empty state, Escape/backdrop closing, and stock limits.
- Cart drawer layout fix: moved the drawer outside the sticky blurred header and used viewport-based `h-dvh`, `min-h-0`, and independent scrolling so items no longer collapse behind the header.
- Brand refinement: uppercase `WALTON PLAZA` header logo, navy W mark, navy/teal/cyan palette, blue primary actions, cooler hero/banner, refined cards, PDP accents, cart styling, and navy footer; no localization was added.
- CSS compatibility fix: removed the unnecessary Tailwind `@theme inline` block from `src/app/globals.css` because generic CSS validators reported it as an unknown rule; Tailwind remains enabled through `@import "tailwindcss"`.
- `node_modules` and `.next` are present locally; they are generated artifacts and should not be treated as source deliverables.
- A Postman v2.1 collection was created at `postman.json`.
- The collection has variables: `baseUrl`, `uid`, `posItemCode`, `skip`, and `limit`.
- Its default request fetches product details by UID `P-4TCF9V` and includes basic Postman tests for HTTP success, `getProducts`, and API `statusCode`.
- The Postman request sets `posItemCode` to `null` while querying by UID. To query by POS item code, set `uid` to `null` and use the `posItemCode` variable in the request JSON.
- The collection now overrides Postman's default user agent with `Mozilla/5.0`, limits accepted compression to gzip/deflate, and sends `Connection: close`; these work around the Walton server's connection reset behavior.

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
- Current verification: `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass after implementation.

## Git and change tracking

- Repository branch at last context update: `ai-context-update`.
- `HEAD`: `dfdae7d` (`fix- @theme issue`).
- `HEAD` matches local `main`, `2-enhance-ui`, and their corresponding remote-tracking branches; there are no implementation commits ahead of or behind `main` at this snapshot.
- `origin/1-integrate-get-product-detail-api` remains at `a161e58`, which is an ancestor of the current history.
- Assignment implementation commit history, oldest to newest: `232f387` initial app implementation; `7e611dd` cart drawer and idempotent persistence; `a161e58` cart drawer viewport layout fix; `54ee3a7` Walton visual refinement; `dfdae7d` removal of the unknown Tailwind theme rule.
- At this context update, tracked `AGENTS.md` and `context.md` contain the new context-maintenance documentation and are uncommitted; there are no uncommitted application-code changes. Untracked `.idea/` exists as local IDE metadata and is not assignment functionality.
- Future context updates must record the current branch, HEAD commit, relationship to `main`, merge status, tracked/untracked status, and validation results. Never describe work on another branch as merged until Git history confirms it.
