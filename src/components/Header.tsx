"use client";
import Link from "next/link";
import {useCart} from "@/lib/cart";
import { useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";

export function Header() {
    const {count} = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    return <>
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8"><Link href="/"
                                                                                                     className="flex shrink-0 items-center gap-2"><span
            className="grid size-10 place-items-center rounded-xl bg-[#192d4d] font-black text-white shadow-sm">W</span><span
            className="text-xl font-extrabold tracking-tight text-[#192d4d]">WALTON<span
            className="text-[#1a998d]">PLAZA</span></span></Link>
            <div className="hidden max-w-md flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 lg:flex"><span className="mr-3 text-slate-400">⌕</span><span className="text-sm text-slate-400">Search Walton products</span></div>
            <nav className="hidden items-center gap-7 text-sm font-semibold text-[#192d4d] md:flex">
                <a href="#products" className="transition hover:text-[#1a998d]">Shop products</a><a href="#why-us" className="transition hover:text-[#1a998d]">Why Walton</a></nav>
            <button onClick={() => setCartOpen(true)}
                className="relative rounded-xl bg-[#192d4d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#233f6c]"
                aria-label="Shopping cart">Cart <span className="ml-1 text-[#c8eef5]">({count})</span></button>
        </div>
        </header>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>;
}
