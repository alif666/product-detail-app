import type {DiscountInfo} from "@/lib/types";

function formatDiscountAmount(value: number) {
    return `\u09F3${Math.round(value).toLocaleString("en-BD")}`;
}

export function DiscountBadge({discount, compact = false}: { discount: DiscountInfo; compact?: boolean }) {
    const value = discount.type === "flat" ? formatDiscountAmount(discount.value) : `${Math.round(discount.value)}%`;

    if (compact) {
        return <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-[#b91c1c] via-[#991b1b] to-[#7f1d1d] px-3 py-1 text-white shadow-sm"><strong className="text-xs font-black leading-4">{value}</strong><span className="text-[10px] font-bold uppercase leading-4">{discount.type === "flat" ? "Save" : "OFF"}</span></span>;
    }

    return <span className="absolute left-3 -top-2 z-10 flex min-h-11 min-w-11 flex-col items-center justify-center gap-px bg-gradient-to-b from-[#ef4444] via-[#b91c1c] to-[#7f1d1d] px-0.5 py-0 text-center text-white shadow-lg [clip-path:polygon(0_0,100%_0,100%_88%,50%_100%,0_88%)]"><strong className="text-sm font-black leading-4">{value}</strong><span className="text-[9px] font-bold uppercase leading-3">{discount.type === "flat" ? "Save" : "OFF"}</span></span>;
}
