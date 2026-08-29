import { createApolloClient } from "@/lib/apollo";
import { PRODUCT_QUERY, PRODUCTS_QUERY } from "@/lib/queries";
import { unstable_cache } from "next/cache";
import type { Product, ProductsResponse } from "@/lib/types";

type ProductPage = { products: Product[]; count: number };

class ApiResponseError extends Error {}

async function fetchProducts(skip: number, limit: number): Promise<ProductPage> {
  const { data } = await createApolloClient().query<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { skip, limit, isActive: true },
    fetchPolicy: "cache-first",
  });
  const result = data?.getProducts;
  if (!result || result.statusCode !== 200 || !result.result) {
    throw new ApiResponseError(result?.message ?? "Unable to load products.");
  }
  return { products: result.result.products, count: result.result.count };
}

const getCachedProducts = unstable_cache(fetchProducts, ["walton-products"], {
  revalidate: 120,
  tags: ["walton-products"],
});

export async function getProducts(skip: number, limit: number): Promise<ProductPage & { error?: string }> {
  try {
    return await getCachedProducts(skip, limit);
  } catch (error) {
    return { products: [], count: 0, error: error instanceof ApiResponseError ? error.message : "The product service is temporarily unavailable." };
  }
}

async function fetchProduct(uid: string): Promise<{ product: Product }> {
  const { data } = await createApolloClient().query<ProductsResponse>({
    query: PRODUCT_QUERY,
    variables: { uid },
    fetchPolicy: "cache-first",
  });
  const result = data?.getProducts;
  if (!result || result.statusCode !== 200 || !result.result) {
    throw new ApiResponseError(result?.message ?? "Product not found.");
  }
  if (!result.result.products[0]) {
    throw new ApiResponseError("Product not found.");
  }
  return { product: result.result.products[0] };
}

const getCachedProduct = unstable_cache(fetchProduct, ["walton-product"], {
  revalidate: 60,
  tags: ["walton-product"],
});

export async function getProduct(uid: string): Promise<{ product?: Product; error?: string }> {
  try {
    return await getCachedProduct(uid);
  } catch (error) {
    return { error: error instanceof ApiResponseError ? error.message : "The product service is temporarily unavailable." };
  }
}
