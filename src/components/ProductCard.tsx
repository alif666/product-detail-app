import Image from "next/image";
import Link from "next/link";
import type {Product} from "@/lib/types";
import {discountInfo, sellingPrice} from "@/lib/types";

export function formatPrice(value: number) {
    return `৳${Math.round(value).toLocaleString("en-BD")}`;
}

export function ProductCard({product}: { product: Product }) {
    const variant = product.variants?.[0];
    const price = sellingPrice(variant);
    const oldPrice = variant?.mrpPrice ?? 0;
    const discount = discountInfo(variant);
    const image = product.images?.[0]?.url;
    return <article
        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#73c6d5] hover:shadow-xl">
        <Link href={`/products/${product.uid}`} className="block">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f8fa]">{image ?
                <Image src={image} alt={product.enName ?? "Walton product"} fill
                       sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                       className="object-contain p-5 transition duration-500 group-hover:scale-105"/> :
                <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">No
                    image</div>}{discount ? <span
                className="absolute left-3 top-3 rounded-lg bg-[#cd2027] px-2.5 py-1 text-xs font-bold text-white">{discount.type === "flat" ? `Save ${formatPrice(discount.value)}` : `${Math.round(discount.value)}% OFF`}</span> : null}</div>
            <div className="p-4"><p
                className="mb-2 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[#192d4d]">{product.enName ?? "Walton product"}</p>
                <div className="flex items-baseline gap-2"><strong
                    className="text-lg text-[#cd2027]">{formatPrice(price)}</strong>{oldPrice > price ?
                    <del className="text-xs text-slate-400">{formatPrice(oldPrice)}</del> : null}</div>
                {variant?.quantity === 0 ? <p className="mt-2 text-xs font-semibold text-red-600">Out of stock</p> :
                    <p className="mt-2 text-xs font-bold text-[#1a998d]">In stock</p>}</div>
        </Link></article>;
}
