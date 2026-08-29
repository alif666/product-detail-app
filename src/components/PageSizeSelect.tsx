"use client";

import {usePathname, useSearchParams} from "next/navigation";
import {PAGE_SIZE_OPTIONS} from "@/lib/pagination";
import {useListingNavigation} from "@/components/ListingNavigation";

export function PageSizeSelect({value}: { value: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {navigate} = useListingNavigation();

    function handleChange(nextValue: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        params.set("limit", nextValue);
        navigate(`${pathname}?${params.toString()}#products`);
    }

    return <label className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        <span className="hidden sm:inline">Products per page</span>
        <select aria-label="Products per page" value={value} onChange={(event) => handleChange(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#233f6c] outline-none transition focus:border-[#233f6c] focus:ring-2 focus:ring-[#c8eef5]">
            {PAGE_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
    </label>;
}
