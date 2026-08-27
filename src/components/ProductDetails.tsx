"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {useCart} from "@/lib/cart";
import {formatPrice} from "@/components/ProductCard";
import {discountPercent, sellingPrice, type Product, type ProductAttribute} from "@/lib/types";
import {RichText} from "@/components/RichText";

function InfoList({items}: { items: ProductAttribute[] | null }) {
    const rows = (items ?? []).filter((i) => i.enLabel && i.values?.some((v) => v.enName));
    return rows.length ? <dl className="divide-y divide-slate-100">{rows.map((item) => <div key={item.enLabel}
                                                                                            className="grid gap-1 py-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
        <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.enLabel}</dt>
        <dd className="text-sm leading-6 text-slate-700"><div className="space-y-2">{item.values?.map((v, index) => v.enName ? <RichText key={`${item.enLabel}-${index}`} value={v.enName} /> : null)}</div></dd>
    </div>)}</dl> : <p className="py-5 text-sm text-slate-400">No information available.</p>;
}

export function ProductDetails({product}: { product: Product }) {
    const images = product.images?.map((i) => i.url).filter(Boolean) as string[];
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const {add} = useCart();
    const variant = product.variants?.[selectedVariant] ?? product.variants?.[0];
    const price = sellingPrice(variant);
    const discount = discountPercent(variant);
    const [tab, setTab] = useState("basic");
    const tabs = [{id: "basic", label: "Basic information", items: product.productAttributes}, {
        id: "details",
        label: "Detailed information",
        items: product.detailedDescriptions
    }, {id: "delivery", label: "Terms & conditions", items: product.deliveries}, {
        id: "warranty",
        label: "Warranty",
        items: product.serviceAndDeliveries
    }, {id: "features", label: "Special features", items: product.priceAndStocks}].filter((t) => t.items?.length);
    return <><Link href="/" className="mb-6 inline-block text-sm font-bold text-slate-500 hover:text-[#ec1c24]">← Back
        to products</Link>
        <div className="grid gap-10 lg:grid-cols-2">
            <div>
                <div
                    className="relative aspect-square overflow-hidden rounded-3xl bg-slate-100">{images[selectedImage] ?
                    <Image src={images[selectedImage]} alt={product.enName ?? "Walton product"} fill
                           sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-8" priority/> :
                    <div className="grid h-full place-items-center text-slate-400">No image available</div>}</div>
                {images.length > 1 ? <div className="mt-4 flex gap-3">{images.map((image, index) => <button key={image}
                                                                                                            onClick={() => setSelectedImage(index)}
                                                                                                            className={`relative size-20 overflow-hidden rounded-xl border-2 bg-slate-50 ${selectedImage === index ? "border-[#ec1c24]" : "border-transparent"}`}>
                    <Image src={image} alt="" fill sizes="80px" className="object-contain p-2"/>
                </button>)}</div> : null}</div>
            <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ec1c24]">Walton official
                collection</p><h1
                className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{product.enName}</h1>
                <div className="mt-7 flex items-baseline gap-3"><strong
                    className="text-4xl font-black text-[#ec1c24]">{formatPrice(price)}</strong>{variant?.mrpPrice && variant.mrpPrice > price ?
                    <del className="text-lg text-slate-400">{formatPrice(variant.mrpPrice)}</del> : null}{discount ?
                    <span
                        className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Save {Math.round(discount)}%</span> : null}
                </div>
                <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5"><p
                    className="text-xs font-bold uppercase tracking-widest text-slate-400">Choose variant</p>
                    <div className="mt-3 flex flex-wrap gap-2">{(product.variants ?? []).map((item, index) => <button
                        key={item.posItemCode ?? index} onClick={() => setSelectedVariant(index)}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold ${selectedVariant === index ? "border-[#ec1c24] bg-red-50 text-[#ec1c24]" : "border-slate-200 text-slate-600"}`}>{item.posItemCode ?? `Option ${index + 1}`}</button>)}</div>
                    <p className={`mt-4 text-sm font-bold ${(variant?.quantity ?? 0) > 0 ? "text-emerald-600" : "text-red-600"}`}>{(variant?.quantity ?? 0) > 0 ? `${variant?.quantity} units available` : "Out of stock"}</p>
                    <button disabled={!variant || variant.quantity === 0}
                            onClick={() => variant && add(product, variant)}
                            className="mt-5 w-full rounded-xl bg-[#ec1c24] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300">{variant?.quantity === 0 ? "Out of stock" : "Add to cart"}</button>
                </div>
            </div>
        </div>
        <section className="mt-16">
            <div className="flex gap-2 overflow-x-auto border-b border-slate-200">{tabs.map((item) => <button
                key={item.id} onClick={() => setTab(item.id)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-bold ${tab === item.id ? "border-b-2 border-[#ec1c24] text-[#ec1c24]" : "text-slate-500"}`}>{item.label}</button>)}</div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"><InfoList
                items={tabs.find((item) => item.id === tab)?.items ?? null}/></div>
        </section>
    </>;
}
