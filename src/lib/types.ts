export type AttributeValue = { enName: string | null };
export type ProductAttribute = { enLabel: string | null; values: AttributeValue[] | null };
export type ImageAsset = { url: string | null };
export type Discount = { amount: number | null; value: number | null; type: string | null };
export type Variant = {
  mrpPrice: number | null;
  ebsItemCode: string | null;
  posItemCode: string | null;
  quantity: number | null;
  discount: Discount | null;
};
export type Product = {
  uid: string;
  enName: string | null;
  images: ImageAsset[] | null;
  productAttributes: ProductAttribute[] | null;
  detailedDescriptions: ProductAttribute[] | null;
  deliveries: ProductAttribute[] | null;
  serviceAndDeliveries: ProductAttribute[] | null;
  priceAndStocks: ProductAttribute[] | null;
  variants: Variant[] | null;
};
export type ProductsResponse = {
  getProducts: {
    message: string | null;
    statusCode: number;
    result: { count: number; products: Product[] } | null;
  };
};

export type DiscountInfo =
  | { type: "percentage"; value: number }
  | { type: "flat"; value: number };

export function sellingPrice(variant: Variant | null | undefined): number {
  if (!variant) return 0;
  const mrp = variant.mrpPrice ?? 0;
  const discount = variant.discount;
  if (!discount) return mrp;
  if (discount.type?.toLowerCase() === "percentage") {
    const percentage = discount.value ?? 0;
    return mrp - (mrp * percentage) / 100;
  }
  return discount.amount == null ? mrp : mrp - discount.amount;
}

export function discountPercent(variant: Variant | null | undefined): number | null {
  const discount = variant?.discount;
  if (!discount) return null;
  if (discount.type?.toLowerCase() === "percentage") return discount.value;
  const mrp = variant.mrpPrice ?? 0;
  return mrp > 0 && discount.amount != null ? (discount.amount / mrp) * 100 : null;
}

export function discountInfo(variant: Variant | null | undefined): DiscountInfo | null {
  const discount = variant?.discount;
  if (!discount) return null;
  const type = discount.type?.toLowerCase();
  if (type === "percentage" && discount.value != null && discount.value > 0) {
    return {type: "percentage", value: discount.value};
  }
  if (type === "flat" && discount.amount != null && discount.amount > 0) {
    return {type: "flat", value: discount.amount};
  }
  return null;
}

export function attributeValue(product: Product, label: string): string | undefined {
  const attribute = product.productAttributes?.find((item) => item.enLabel?.toLowerCase() === label.toLowerCase());
  return attribute?.values?.map((value) => value.enName).filter(Boolean).join(", ") || undefined;
}
