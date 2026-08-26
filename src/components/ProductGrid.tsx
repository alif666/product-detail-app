"use client";
import {useMemo, useState} from "react";
import {ProductCard} from "@/components/ProductCard";
import type {Product} from "@/lib/types";

export function ProductGrid({products}: { products: Product[] }) {
    const [search, setSearch] = useState("");
    const [availability, setAvailability] = useState("all");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("featured");
    const categories = useMemo(() => Array.from(new Set(products.flatMap((p) => p.productAttributes?.filter((a) => a.enLabel?.toLowerCase() === "brand").flatMap((a) => a.values?.map((v) => v.enName).filter((v): v is string => Boolean(v)) ?? []) ?? []))).sort(), [products]);
    const visible = useMemo(() => products.filter((p) => {
        const name = p.enName?.toLowerCase() ?? "";
        const brand = p.productAttributes?.find((a) => a.enLabel?.toLowerCase() === "brand")?.values?.[0]?.enName ?? "";
        const stock = (p.variants ?? []).some((v) => (v.quantity ?? 0) > 0);
        return name.includes(search.toLowerCase()) && (availability === "all" || (availability === "in" ? stock : !stock)) && (category === "all" || brand === category);
    }).sort((a, b) => {
        const av = a.variants?.[0]?.mrpPrice ?? 0, bv = b.variants?.[0]?.mrpPrice ?? 0;
        return sort === "low" ? av - bv : sort === "high" ? bv - av : 0;
    }), [products, search, availability, category, sort]);
    return <div>
        <div
            className="mb-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <label className="sr-only" htmlFor="search">Search products</label><input id="search" value={search}
                                                                                      onChange={(e) => setSearch(e.target.value)}
                                                                                      placeholder="Search products..."
                                                                                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-[#ec1c24] focus:ring-2"/><select
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
