"use client";
import {useMemo, useState} from "react";
import type {FormEvent} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {ProductCard} from "@/components/ProductCard";
import type {Product} from "@/lib/types";

const PRODUCT_UID_PATTERN = /^P-[A-Z0-9]+$/i;
const PRODUCT_UID_LENGTH = 8;

export function ProductGrid({products, initialSearch = ""}: { products: Product[]; initialSearch?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(initialSearch);
    const [availability, setAvailability] = useState("all");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("featured");
    const categories = useMemo(() => Array.from(new Set(products.flatMap((p) => p.productAttributes?.filter((a) => a.enLabel?.toLowerCase() === "brand").flatMap((a) => a.values?.map((v) => v.enName).filter((v): v is string => Boolean(v)) ?? []) ?? []))).sort(), [products]);
    const visible = useMemo(() => products.filter((p) => {
        const query = search.trim().toLowerCase();
        const name = p.enName?.toLowerCase() ?? "";
        const brand = p.productAttributes?.find((a) => a.enLabel?.toLowerCase() === "brand")?.values?.[0]?.enName ?? "";
        const stock = (p.variants ?? []).some((v) => (v.quantity ?? 0) > 0);
        const matchesSearch = PRODUCT_UID_PATTERN.test(query) ? p.uid.toLowerCase() === query : name.includes(query);
        return matchesSearch && (availability === "all" || (availability === "in" ? stock : !stock)) && (category === "all" || brand === category);
    }).sort((a, b) => {
        const av = a.variants?.[0]?.mrpPrice ?? 0, bv = b.variants?.[0]?.mrpPrice ?? 0;
        return sort === "low" ? av - bv : sort === "high" ? bv - av : 0;
    }), [products, search, availability, category, sort]);
    function navigateForUid(query: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");
        if (query.length === 0) params.delete("uid");
        else if (query.length >= PRODUCT_UID_LENGTH && PRODUCT_UID_PATTERN.test(query)) params.set("uid", query.toUpperCase());
        else params.delete("uid");
        const queryString = params.toString();
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}#products`);
    }

    function handleSearchChange(value: string) {
        setSearch(value);
        const query = value.trim();
        if (query.length === 0 || (query.length >= PRODUCT_UID_LENGTH && PRODUCT_UID_PATTERN.test(query))) {
            navigateForUid(query);
        }
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigateForUid(search.trim());
    }

    return <div>
        <div
            className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <form onSubmit={submitSearch} className="contents"><label className="sr-only" htmlFor="search">Search products or product ID</label><input id="search" value={search}
                                                                                      onChange={(e) => handleSearchChange(e.target.value)}
                                                                                      placeholder="Search products or product ID..."
                                                                                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-[#ec1c24] focus:ring-2"/><button type="submit" className="sr-only">Search</button></form><select
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
            <option value="all">All brands</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}</select><select
            value={availability} onChange={(e) => setAvailability(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
            <option value="all">All availability</option>
            <option value="in">In stock</option>
            <option value="out">Out of stock</option>
        </select><select value={sort} onChange={(e) => setSort(e.target.value)}
                         className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
        </select></div>
        {visible.length ?
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{visible.map((product) => <ProductCard
                key={product.uid} product={product}/>)}</div> : <div
                className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">No
                products match your filters.</div>}</div>;
}
