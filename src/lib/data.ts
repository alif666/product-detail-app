import { createApolloClient } from "@/lib/apollo";
import { PRODUCT_QUERY, PRODUCTS_QUERY } from "@/lib/queries";
import type { Product, ProductsResponse } from "@/lib/types";

export async function getProducts(skip: number, limit: number): Promise<{ products: Product[]; count: number; error?: string }> {
  try {
    const { data } = await createApolloClient().query<ProductsResponse>({
      query: PRODUCTS_QUERY,
      variables: { skip, limit, isActive: true },
      fetchPolicy: "cache-first",
    });
    const result = data?.getProducts;
    if (!result || result.statusCode !== 200 || !result.result) {
      return { products: [], count: 0, error: result?.message ?? "Unable to load products." };
    }
    return { products: result.result.products, count: result.result.count };
  } catch {
    return { products: [], count: 0, error: "The product service is temporarily unavailable." };
  }
}

export async function getProduct(uid: string): Promise<{ product?: Product; error?: string }> {
  try {
    const { data } = await createApolloClient().query<ProductsResponse>({
      query: PRODUCT_QUERY,
      variables: { uid },
      fetchPolicy: "cache-first",
    });
    const result = data?.getProducts;
    if (!result || result.statusCode !== 200 || !result.result?.products[0]) {
      return { error: result?.message ?? "Product not found." };
    }
    return { product: result.result.products[0] };
  } catch {
    return { error: "The product service is temporarily unavailable." };
  }
}
