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

export function sellingPrice(variant: Variant | null | undefined): number {
  if (!variant) return 0;
  const mrp = variant.mrpPrice ?? 0;
  const discount = variant.discount;
  if (!discount || discount.amount == null) return mrp;
  return discount.type?.toLowerCase() === "percentage"
    ? mrp - (mrp * discount.amount) / 100
    : mrp - discount.amount;
}

export function discountPercent(variant: Variant | null | undefined): number | null {
  const discount = variant?.discount;
  if (!discount) return null;
  if (discount.type?.toLowerCase() === "percentage") return discount.amount;
  const mrp = variant.mrpPrice ?? 0;
  return mrp > 0 && discount.amount != null ? (discount.amount / mrp) * 100 : null;
}

export function attributeValue(product: Product, label: string): string | undefined {
  const attribute = product.productAttributes?.find((item) => item.enLabel?.toLowerCase() === label.toLowerCase());
  return attribute?.values?.map((value) => value.enName).filter(Boolean).join(", ") || undefined;
}
