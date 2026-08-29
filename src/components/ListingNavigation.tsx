"use client";

import {createContext, useCallback, useContext, useTransition, type ReactNode} from "react";
import {useRouter} from "next/navigation";
import {ProductSectionSkeleton} from "@/components/LoadingSkeleton";

type ListingNavigationContextValue = { navigate: (href: string) => void };
const ListingNavigationContext = createContext<ListingNavigationContextValue | null>(null);

export function useListingNavigation() {
    const context = useContext(ListingNavigationContext);
    if (!context) throw new Error("useListingNavigation must be used inside ListingNavigation");
    return context;
}

export function ListingNavigation({children}: { children: ReactNode }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const navigate = useCallback((href: string) => {
        startTransition(() => router.push(href, {scroll: false}));
    }, [router]);

    if (isPending) return <ProductSectionSkeleton/>;
    return <ListingNavigationContext.Provider value={{navigate}}>{children}</ListingNavigationContext.Provider>;
}
