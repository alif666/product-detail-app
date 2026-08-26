"use client";
import Link from "next/link";
import {useCart} from "@/lib/cart";

export function Header() {
    const {count} = useCart();
    return <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8"><Link href="/"
                                                                                                     className="flex items-center gap-2"><span
            className="grid size-10 place-items-center rounded-xl bg-[#ec1c24] font-black text-white">W</span><span
            className="text-xl font-extrabold tracking-tight text-slate-950">walton<span
            className="text-[#ec1c24]">plaza</span></span></Link>
            <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
                <a href="#products" className="hover:text-[#ec1c24]">Shop
                    products</a><a href="#why-us" className="hover:text-[#ec1c24]">Why Walton</a></nav>
            <button
                className="relative rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
                aria-label="Shopping cart">Cart <span className="ml-1 text-[#ec1c24]">({count})</span></button>
        </div>
    </header>;
}
