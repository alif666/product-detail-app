# Walton Plaza Product Experience

A high-performance product listing and detail experience built for the Walton Plaza frontend evaluation.

## Stack

- Next.js App Router 16
- React 19 (`useOptimistic` for add-to-cart feedback)
- TypeScript strict mode
- Tailwind CSS 4
- Apollo Client with an in-memory cache
- Walton Plaza GraphQL API

## Getting started

Create `.env.local` if you want to override the default API endpoint:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://devapi.waltonplaza.com.bd/graphql
```

Then run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The product listing uses the live API and product details are available at `/products/[uid]`.

## Architecture

- `src/app/page.tsx` is the server-rendered product listing route. It fetches a paginated slice using the API's `skip` and `limit` fields.
- `src/app/products/[uid]/page.tsx` is the dynamic server-rendered product detail route.
- `src/lib/apollo.ts`, `queries.ts`, `data.ts`, and `types.ts` form the typed GraphQL/data layer. Apollo's `InMemoryCache` uses `cache-first` reads.
- Interactive filters, product interactions, tabs, variants, and cart behavior are isolated in client components.
- `src/lib/cart.tsx` provides add, remove, update, clear, optimistic feedback, and localStorage persistence.

## Product behavior

- Pagination is used because the API explicitly provides offset pagination with `skip` and `limit`; it keeps the initial payload small.
- Product-name search remains a responsive client-side filter for the loaded page. Once an 8-character UID such as `P-4TCF9V` is entered, the app automatically uses the API's `uid` filter and renders the single matching product card; the card keeps the existing navigation to the product detail page. Clearing the field restores the normal listing without changing cart behavior. Enter remains supported as a fallback for submitting/clearing the search.
- The listing defaults to 12 products per page and provides 20 and 30 page-size options. The selected size is stored in the URL as `limit`, resets to page 1 when changed, and is preserved across numbered pagination links. The application caps the requested page size at 30 to match the API behavior.
- Route-level loading skeletons provide immediate feedback during slow listing and detail API navigation, including page-size changes, pagination, opening products, and returning to the listing.
- Product cards use `next/image`, responsive `sizes`, remote image configuration, lazy loading, a missing-image fallback, and hover feedback.
- The live API exposes brand-like attributes, so the listing's category control uses available brand attributes. Rating is not present in the documented or tested live response, so no rating data is fabricated.
- API arrays may be null or empty and are rendered safely. Products with zero quantity cannot be added to the cart.
- Product descriptions from the API may contain HTML; this implementation displays structured API attributes safely. Any future raw HTML rendering should be sanitized first.

## Pricing note

The reference document says `discount.value` is the final selling price, but the verified live response for `P-4TCF9V` returned `type: "PERCENTAGE"`, `amount: 5199`, and `value: 10` for an MRP of `51990`. The app normalizes the type case, uses `discount.value` as the percentage for percentage discounts, and uses `discount.amount` as the BDT deduction for flat discounts.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The included `postman.json` collection tests the documented GraphQL endpoint. The Walton server may close connections for Postman's default runtime user agent, so the collection overrides it with `Mozilla/5.0` and uses `Connection: close`.
