"use client";

import Link from "next/link";
import {ChevronLeftIcon, ChevronRightIcon} from "@/components/Icons";
import {useListingNavigation} from "@/components/ListingNavigation";

type PageItem = number | "ellipsis-left" | "ellipsis-right";

function getPageItems(page: number, totalPages: number): PageItem[] {
    if (totalPages <= 7) return Array.from({length: totalPages}, (_, index) => index + 1);
    if (page <= 4) return [1, 2, 3, 4, "ellipsis-right", totalPages];
    if (page >= totalPages - 3) return [1, "ellipsis-left", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "ellipsis-left", page - 1, page, page + 1, "ellipsis-right", totalPages];
}

function pageHref(page: number, limit: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (limit !== 12) params.set("limit", String(limit));
    const query = params.toString();
    return query ? `/?${query}` : "/";
}

function shouldHandleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function Pagination({page, totalPages, limit}: { page: number; totalPages: number; limit: number }) {
    const items = getPageItems(page, totalPages);
    const isFirstPage = page <= 1;
    const isLastPage = page >= totalPages;
    const {navigate} = useListingNavigation();
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!shouldHandleClick(event)) return;
        event.preventDefault();
        navigate(href);
    };

    return <nav aria-label="Product pages" className="mt-10 flex justify-center">
        <ul className="flex flex-wrap items-center justify-center gap-2">
            <li><Link aria-disabled={isFirstPage} tabIndex={isFirstPage ? -1 : undefined}
                      className={`inline-flex min-h-10 items-center rounded-xl border px-3 text-sm font-bold transition ${isFirstPage ? "pointer-events-none border-slate-200 bg-slate-50 text-slate-300" : "border-slate-200 bg-white text-[#233f6c] hover:border-[#233f6c] hover:bg-[#eef5ff]"}`}
                      href={pageHref(Math.max(1, page - 1), limit)} onClick={(event) => handleClick(event, pageHref(Math.max(1, page - 1), limit))}><ChevronLeftIcon className="mr-1 size-4"/>Previous</Link></li>
            {items.map((item) => {
                if (typeof item !== "number") return <li key={item} aria-hidden="true" className="inline-flex min-h-10 min-w-10 items-center justify-center px-1 text-sm font-bold text-slate-400">…</li>;
                const isCurrent = item === page;
                return <li key={item}><Link aria-current={isCurrent ? "page" : undefined}
                                            className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-bold transition ${isCurrent ? "border-[#233f6c] bg-[#233f6c] text-white shadow-sm" : "border-slate-200 bg-white text-[#233f6c] hover:border-[#233f6c] hover:bg-[#eef5ff]"}`}
                                            href={pageHref(item, limit)} onClick={(event) => handleClick(event, pageHref(item, limit))}>{item}</Link></li>;
            })}
            <li><Link aria-disabled={isLastPage} tabIndex={isLastPage ? -1 : undefined}
                      className={`inline-flex min-h-10 items-center rounded-xl border px-3 text-sm font-bold transition ${isLastPage ? "pointer-events-none border-slate-200 bg-slate-50 text-slate-300" : "border-slate-200 bg-white text-[#233f6c] hover:border-[#233f6c] hover:bg-[#eef5ff]"}`}
                      href={pageHref(Math.min(totalPages, page + 1), limit)} onClick={(event) => handleClick(event, pageHref(Math.min(totalPages, page + 1), limit))}>Next<ChevronRightIcon className="ml-1 size-4"/></Link></li>
        </ul>
    </nav>;
}
